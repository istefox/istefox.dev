// Structured content for the Agentwake beta-recruitment page (/agentwake), in English.
// Lives in its own file so src/data/agentwake.ts stays untouched for the launch restore:
// at launch, delete this file and move src/pages/agentwake/preview.astro back to agentwake.astro.
// The old pre-launch "no prices, no free/paid framing" rule is retired: this page states the
// beta deal (free lifetime Pro for testers, €7.99 after 31 August 2026) openly. The one hard
// rule that remains: the private 100%-off Polar checkout link is email-only and must never
// appear in this file or on any page (see functions/api/waitlist.ts).

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
import { PRICING } from "./pricing";

// The post-beta list price and the beta deadline, used across the copy below. The date is the
// expiry of the private Polar discount (capped at 100 redemptions, expires 2026-08-31).
const LIST_PRICE = PRICING.listPrice; // "€7.99"
const BETA_END_HUMAN = "31 August 2026";
export const BETA_END_ISO = "2026-08-31";

export const WAITLIST_TITLE =
  "Agentwake beta for macOS: keep your Mac awake for AI agents";

// Used for <meta description> and OG. Keep ≤160 chars so search results show it uncut.
export const WAITLIST_META_DESCRIPTION =
  "Agentwake keeps your Mac awake while AI agents like Claude Code work. Beta testers get Pro free for life until 31 Aug 2026; €7.99 after. macOS 14+.";

export const WAITLIST_SUBHEAD = HERO.subhead;
export const WAITLIST_USE_CASES = USE_CASES;

// Trust chips under the CTA. Each one answers a signup objection.
export const WAITLIST_CHIPS = [
  "macOS 14+, notarized",
  "In development and testing for ~6 months",
  "Beta testers get Pro free, for life",
  `${LIST_PRICE} after ${BETA_END_HUMAN}`,
];

// Screenshots shown inline on the page (keys into SHOT_LIST / src/assets/agentwake).
export const WAITLIST_SHOT_KEYS = [
  "ai-coding-mode.png",
  "automations-pane.png",
  "keep-awake-pane.png",
  "menu-bar-states.png",
];

// Beta-specific FAQ entries. Each answer is self-contained (readable out of context) on
// purpose: these are the blocks AI answer engines lift verbatim.
export const BETA_FAQ_EXTRA: FaqItem[] = [
  {
    q: "What is the Agentwake beta program?",
    a: `Sign up with your email before ${BETA_END_HUMAN} and you get the current Agentwake build plus a free lifetime copy of Pro, delivered by email right after signup. In exchange, you tell us what breaks, what is confusing, and what is missing. After the beta closes, Agentwake Pro costs ${LIST_PRICE} one-time.`,
  },
  {
    q: "Is the beta stable enough for daily use?",
    a: "Yes. Agentwake has been in development and testing for about six months and is already used daily on real overnight agent runs. Beta here means your feedback shapes the final release, not that the app crashes on you.",
  },
  {
    q: "What happens after the beta ends?",
    a: `Beta testers keep Pro free for life, updates included. From 1 September 2026 new users pay ${LIST_PRICE} one-time. No subscription either way.`,
  },
];

// FAQ subset for this page, selected by exact question text so a copy drift in agentwake.ts
// surfaces as a missing entry here instead of silently changing the page.
const WAITLIST_FAQ_QUESTIONS = [
  "Does it really keep the Mac awake with the lid closed?",
  "Why does Agentwake need the Accessibility permission?",
  "Does Agentwake read my code or my conversations?",
  "What happens if an agent hangs or a hook misses?",
  "Why is Agentwake not on the Mac App Store?",
  "Is it a subscription?",
  "How do I get help?",
];
export const WAITLIST_FAQ: FaqItem[] = [
  ...BETA_FAQ_EXTRA,
  ...WAITLIST_FAQ_QUESTIONS.flatMap((q) => {
    const item = FAQ.find((f) => f.q === q);
    return item ? [item] : [];
  }),
];

// Comparison table: the landing table with the Price row reworded for the beta deal. Only the
// Agentwake cell changes; competitor cells and footnotes stay verbatim.
export const WAITLIST_COMPARISON = {
  intro: COMPARISON_INTRO,
  cols: COMPARISON_COLS,
  rows: COMPARISON_ROWS.map((r) =>
    r.label === "Price"
      ? {
          ...r,
          values: [
            `Free for beta testers (lifetime), ${LIST_PRICE} after 31 Aug 2026`,
            ...r.values.slice(1),
          ],
        }
      : r,
  ),
  footnotes: COMPARISON_FOOTNOTES,
};

export const WHY_JOIN = {
  title: "Why become a beta tester",
  bullets: [
    "You get Pro free, for life. The activation link lands in your inbox right after signup, together with the download.",
    "The app is already stable: about six months of development and daily testing on real overnight agent runs.",
    "Your feedback and feature requests decide what ships in the public release.",
    `The beta closes on ${BETA_END_HUMAN}. After that, Agentwake Pro costs ${LIST_PRICE} one-time.`,
  ],
};

// The dedicated feedback section ("What to tell us, and how"). Tone matches the beta invite
// email in functions/api/waitlist.ts: direct, first person, low-key.
export const FEEDBACK_SECTION = {
  title: "What to tell us, and how",
  intro:
    "The whole point of this beta is making Agentwake stable and complete before launch. You do not need to write a formal report, a couple of sentences is plenty. What helps most:",
  kinds: [
    "Bugs: what you did, what you expected, what happened instead. A screenshot helps.",
    "Rough edges: anything confusing, slower than it should be, or harder to find than it should be.",
    "Feature requests: what is missing from your workflow, and when you would use it.",
    "Setup friction: anything that tripped you up in the first ten minutes.",
  ],
  channels: [
    {
      name: "GitHub Issues",
      body: "The preferred channel: issues are trackable, and you see when a fix ships. No template required.",
      href: "https://github.com/istefox/Agentwake-releases/issues/new",
      linkLabel: "Open an issue",
    },
    {
      name: "Email",
      body: "For anything private, or if you just prefer it: reply to your beta invite email, or write directly. I read every message myself.",
      href: "mailto:stefferri@icloud.com?subject=Agentwake%20beta%20feedback",
      linkLabel: "stefferri@icloud.com",
    },
  ],
};

export const WAITLIST_FORM = {
  heading: "Become a beta tester",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  submitLabel: "Get the beta",
  successMessage:
    "You're in. Check your inbox for the download link and your free Pro activation.",
  errorInvalidEmail: "That doesn't look like a valid email address.",
  errorTurnstile: "The anti-spam check failed. Please retry.",
  errorNetwork: "Something went wrong. Please try again in a moment.",
  privacyNote:
    "Your email is stored only for the Agentwake beta and never shared. You get the invite email with your download and Pro activation, and nothing else. No newsletter.",
};

// Cloudflare Turnstile site key — public by design, safe to commit. The matching secret
// lives only in the Cloudflare Pages project settings (TURNSTILE_SECRET).
export const TURNSTILE_SITE_KEY = "0x4AAAAAAD7h_iCKEeaHy6bQ";
