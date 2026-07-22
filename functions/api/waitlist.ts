// Cloudflare Pages Function: POST /api/waitlist — Agentwake pre-launch email capture.
// Bindings (configured in the Pages project dashboard, Production AND Preview):
//   WAITLIST         → KV namespace "agentwake-waitlist"
//   TURNSTILE_SECRET → Turnstile secret key (environment variable, type Secret)
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
    await env.WAITLIST.put(
      key,
      JSON.stringify({
        ts: new Date().toISOString(),
        ua: request.headers.get("user-agent") ?? undefined,
        ref: request.headers.get("referer") ?? undefined,
      }),
    );
  }
  return json({ ok: true });
}
