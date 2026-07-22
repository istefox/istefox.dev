// Structured content for the Agentwake pre-launch waitlist page (/agentwake), in English.
// Lives in its own file so src/data/agentwake.ts stays untouched for the launch restore:
// at launch, delete this file and move src/pages/agentwake/preview.astro back to agentwake.astro.
// Hard rule for everything exported here: no prices, no free/paid framing, no download links.

import {
  COMPARISON_COLS,
  COMPARISON_FOOTNOTES,
  COMPARISON_INTRO,
  COMPARISON_ROWS,
  FAQ,
  HERO,
  USE_CASES,
} from "./agentwake";
import type { FaqItem } from "./agentwake";

export const WAITLIST_TITLE =
  "Agentwake for macOS: keep your Mac awake for AI agents — coming soon";

// Used for <meta description> and OG. Keep ≤160 chars so search results show it uncut.
export const WAITLIST_META_DESCRIPTION =
  "Agentwake keeps your Mac awake while AI coding agents like Claude Code work, then lets it sleep when they finish. Join the waitlist to test it early on macOS 14+.";

// HERO.subhead and the use cases minus their trailing "That part is free." — the waitlist
// page carries zero free/paid framing, so the sentence is trimmed here rather than editing
// the landing copy.
const trimFree = (s: string) => s.replace(/\s*That part is free\.$/, "");
export const WAITLIST_SUBHEAD = trimFree(HERO.subhead);
export const WAITLIST_USE_CASES = USE_CASES.map((u) => ({
  ...u,
  body: trimFree(u.body),
}));

// Trust chips under the CTA. Same spirit as the landing chips, without the purchase ones.
export const WAITLIST_CHIPS = [
  "macOS 14+, notarized",
  "Launching soon",
  "Free early access for testers",
];

// Screenshots shown inline on the waitlist page (keys into SHOT_LIST / src/assets/agentwake).
export const WAITLIST_SHOT_KEYS = [
  "ai-coding-mode.png",
  "automations-pane.png",
  "keep-awake-pane.png",
  "menu-bar-states.png",
];

// Pricing-free FAQ subset, selected by exact question text so a copy drift in agentwake.ts
// surfaces as a missing entry here instead of silently reintroducing pricing talk.
const WAITLIST_FAQ_QUESTIONS = [
  "Does it really keep the Mac awake with the lid closed?",
  "Why does Agentwake need the Accessibility permission?",
  "Does Agentwake read my code or my conversations?",
  "What happens if an agent hangs or a hook misses?",
  "Why is Agentwake not on the Mac App Store?",
];
export const WAITLIST_FAQ: FaqItem[] = WAITLIST_FAQ_QUESTIONS.flatMap((q) => {
  const item = FAQ.find((f) => f.q === q);
  return item ? [item] : [];
});

// Comparison table for the waitlist page: the landing table minus its "Price" row, with the
// one "(free)" qualifier on the cleaning-lock row and the "free cleaning lock" footnote
// mention trimmed. Competitor prices in the intro stay — they sharpen the positioning
// without revealing Agentwake's own pricing.
export const WAITLIST_COMPARISON = {
  intro: COMPARISON_INTRO,
  cols: COMPARISON_COLS,
  rows: COMPARISON_ROWS.filter((r) => r.label !== "Price").map((r) => ({
    ...r,
    values: r.values.map((v) => (v === "Yes (free)" ? "Yes" : v)),
  })),
  footnotes: COMPARISON_FOOTNOTES.map((f) =>
    f.replace("the free cleaning lock", "the cleaning lock"),
  ),
};

export const WHY_JOIN = {
  title: "Why join the waitlist",
  bullets: [
    "Test early builds before anyone else, on your real overnight agent runs.",
    "Shape the roadmap: early testers' feedback decides what ships at launch.",
    "Get one email when Agentwake launches. No newsletter, no drip campaign.",
  ],
};

export const WAITLIST_FORM = {
  heading: "Join the waitlist",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  submitLabel: "Join the waitlist",
  successMessage: "You're on the list. Watch your inbox.",
  errorInvalidEmail: "That doesn't look like a valid email address.",
  errorTurnstile: "The anti-spam check failed. Please retry.",
  errorNetwork: "Something went wrong. Please try again in a moment.",
  privacyNote:
    "Your email is stored only for the Agentwake waitlist and never shared. One launch email, early-build invitations, nothing else.",
};

// Cloudflare Turnstile site key — public by design, safe to commit. The matching secret
// lives only in the Cloudflare Pages project settings (TURNSTILE_SECRET).
export const TURNSTILE_SITE_KEY = "0x4AAAAAAD7h_iCKEeaHy6bQ";
