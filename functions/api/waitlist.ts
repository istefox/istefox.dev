// Cloudflare Pages Function: POST /api/waitlist — Agentwake beta signup + invite email.
// Bindings (configured in the Pages project dashboard, Production AND Preview):
//   WAITLIST         → KV namespace "agentwake-waitlist"
//   TURNSTILE_SECRET → Turnstile secret key (environment variable, type Secret)
//   RESEND_API_KEY   → Resend API key (environment variable, type Secret)
// Export at launch needs no code: keys ARE the emails —
//   npx wrangler kv key list --namespace-id=<ID> --remote
//
// Minimal hand-rolled types instead of @cloudflare/workers-types: that package redefines
// Request/Response and conflicts with the DOM lib the rest of the repo type-checks against.
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  WAITLIST: KVNamespace;
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
}

// Beta invite email, sent once per genuinely new signup (see the KV-guarded branch below).
// The Polar checkout link carries a 100%-off, no-code discount capped at 100 redemptions,
// expiring 2026-08-31 (see memory: agentwake_beta_checkout.md) — private on purpose, never
// put on the public site, only delivered here by email.
const BETA_EMAIL_FROM = "Agentwake <beta@istefox.dev>";
// istefox.dev has no mail receiving set up (Enable Receiving is off in Resend, no MX for
// inbound), so replies must route to the real support inbox already used site-wide, not to
// BETA_EMAIL_FROM, which would bounce.
const BETA_EMAIL_REPLY_TO = "stefferri@icloud.com";
const BETA_EMAIL_SUBJECT = "Your Agentwake beta build is ready";
const BETA_CHECKOUT_URL =
  "https://buy.polar.sh/polar_cl_iUIyoNpKB839F0hFDj6TTYxfOnL1z0VZ0J8Mw0dvUVx";
const BETA_DOWNLOAD_URL = "https://istefox.dev/agentwake/download";
const BETA_ISSUES_URL =
  "https://github.com/istefox/Agentwake-releases/issues/new";

const betaEmailText = `Thanks for signing up for the Agentwake beta.

Agentwake keeps your Mac awake while AI coding agents like Claude Code work, then lets it sleep the moment they finish.

Download it here: ${BETA_DOWNLOAD_URL}

As a beta tester you get Pro free. Use this link to activate it, it's tied to your signup and works once: ${BETA_CHECKOUT_URL}

This is pre-release software, so expect rough edges. Found a bug, or have an idea for a feature or a change? Open an issue here: ${BETA_ISSUES_URL}

Prefer email? Just reply to this one, I read every message myself.

Stefano`;

const betaEmailHtml = `<p>Thanks for signing up for the Agentwake beta.</p>
<p>Agentwake keeps your Mac awake while AI coding agents like Claude Code work, then lets it sleep the moment they finish.</p>
<p><a href="${BETA_DOWNLOAD_URL}">Download it here</a>.</p>
<p>As a beta tester you get Pro free. <a href="${BETA_CHECKOUT_URL}">Use this link to activate it</a>, it's tied to your signup and works once.</p>
<p>This is pre-release software, so expect rough edges. Found a bug, or have an idea for a feature or a change? <a href="${BETA_ISSUES_URL}">Open an issue here</a>.</p>
<p>Prefer email? Just reply to this one, I read every message myself.</p>
<p>Stefano</p>`;

async function sendBetaEmail(
  env: Env,
  to: string,
): Promise<{ sent: true } | { sent: false; error: string }> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: BETA_EMAIL_FROM,
        to,
        reply_to: BETA_EMAIL_REPLY_TO,
        subject: BETA_EMAIL_SUBJECT,
        text: betaEmailText,
        html: betaEmailHtml,
      }),
    });
    if (!res.ok) return { sent: false, error: `resend_${res.status}` };
    return { sent: true };
  } catch {
    return { sent: false, error: "resend_fetch_failed" };
  }
}

const json = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function onRequestPost(ctx: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = ctx;

  // Same-origin gate, no CORS headers on purpose. Comparing against the request's own host
  // accepts both istefox.dev and *.pages.dev preview deployments without a hardcoded list.
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).hostname !== new URL(request.url).hostname) {
        return json({ ok: false, error: "forbidden" }, 403);
      }
    } catch {
      return json({ ok: false, error: "forbidden" }, 403);
    }
  }

  const form = await request.formData().catch(() => null);
  if (!form) return json({ ok: false, error: "bad_request" }, 400);

  // Honeypot: bots that fill the hidden "website" field get a success response and nothing stored.
  if (String(form.get("website") ?? "") !== "") return json({ ok: true });

  const email = String(form.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }

  // Turnstile server-side verification. Tokens are single-use.
  const token = String(form.get("cf-turnstile-response") ?? "");
  const verify = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get("cf-connecting-ip") ?? "",
      }),
    },
  );
  const outcome = (await verify.json().catch(() => null)) as {
    success?: boolean;
  } | null;
  if (!outcome?.success) return json({ ok: false, error: "turnstile" }, 403);

  // Idempotent store: an already-registered email still gets { ok: true }, so the response
  // never doubles as an is-this-email-registered oracle. No KV-based rate limiting: KV is
  // eventually consistent and unfit for counters; Turnstile is the throttle.
  const key = `email:${email}`;
  if ((await env.WAITLIST.get(key)) === null) {
    // Fail-open: a Resend outage must never turn a successful signup into an error response.
    // emailSent/emailError let a manual `wrangler kv key list` audit spot anyone who needs a
    // hand-sent follow-up, same fallback already used to check signups today.
    const result = await sendBetaEmail(env, email);
    await env.WAITLIST.put(
      key,
      JSON.stringify({
        ts: new Date().toISOString(),
        ua: request.headers.get("user-agent") ?? undefined,
        ref: request.headers.get("referer") ?? undefined,
        emailSent: result.sent,
        ...(result.sent ? {} : { emailError: result.error }),
      }),
    );
  }
  return json({ ok: true });
}
