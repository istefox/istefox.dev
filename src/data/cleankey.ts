// Structured content for the CleanKey product landing page (/cleankey), in English.
// Source of truth: docs/marketing/website-refactor-handoff-2026-07-18.md in the CleanKey repo
// (verified against v1.16.1). Kept data-driven so copy is easy to edit and translate.
// Every price on the page comes from the launch ladder in ./pricing — never hardcode one here.

import { PRICING } from "./pricing";

export interface AutomationAction {
  name: string;
  body: string;
}

export interface ComparisonRow {
  label: string;
  // order: CleanKey, Amphetamine, Adrafinil, Agent Caffeine
  values: string[];
}

export interface UseCase {
  title: string;
  body: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface Shot {
  // Filename under src/assets/cleankey/ (matched by import.meta.glob). Rendered as a placeholder
  // until the real asset exists. `title`/`desc` add a caption under the shot.
  key: string;
  caption: string;
  title?: string;
  desc?: string;
}

export const HERO = {
  headline: "CleanKey knows when your unattended work is done.",
  // Doubles as the self-contained "what is CleanKey" answer block for AI search (40–60 words).
  subhead:
    "It watches your AI coding agents, Claude Code, Cursor, Codex, Gemini and more, and keeps your Mac awake, lid closed if you want, only while they are working. The moment the last one finishes it can notify you, run your Shortcut, and put the Mac to sleep. And it locks your keyboard so you can clean it. That part is free.",
  // Trust chips under the CTAs. Kept short: each one answers a purchase objection.
  chips: [
    "macOS 14+, notarized",
    `Pay once — ${PRICING.price}`,
    "14-day refund",
    "No subscription",
  ],
  ctaPrimary: "Download free for macOS 14+",
};

// Used for <meta description> and OG. Keep ≤160 chars so search results show it uncut.
export const META_DESCRIPTION =
  "CleanKey keeps your Mac awake while AI coding agents like Claude Code work, lid closed if you want, then lets it sleep when they finish. The cleaning lock is free.";

// The pain, three lines. Verbatim from the handoff.
export const PAIN = {
  title: "The three-hour run that died at minute four",
  body: "You kick off a three-hour agent run, close the lid, and the Mac goes to sleep at minute four. So you prop the lid open with a book and leave the machine running warm all night for a job that finished at 1 AM. Keep-awake apps hold the Mac awake; none of them knows when the work is done.",
};

// How it knows: the signal in one paragraph (handoff copy), plus the manual hook snippet for
// people who want to see exactly what gets installed.
export const HOW_IT_KNOWS = {
  title: "How it knows: hooks, a process fallback, and a fail-safe",
  body: [
    "CleanKey installs a tiny activity hook into each coding tool with one click (nine tools built in, custom agents supported), and falls back to process detection for tools without hooks. Every session reports a heartbeat; when the last one goes quiet, the work is done. The design is fail-safe: a missed signal lets the Mac sleep. It never gets stuck awake.",
    "Prefer to wire it yourself? This is the whole hook, ready to paste into Claude Code’s ~/.claude/settings.json. After an app update the installed hook refreshes itself, so it always matches the current version:",
  ],
  hookJson: `{
  "hooks": {
    "PostToolUse":      [{ "matcher": ".*", "hooks": [{ "type": "command", "command": "mkdir -p ~/.cleankey && touch ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }],
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "mkdir -p ~/.cleankey && touch ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }],
    "SessionEnd":       [{ "hooks": [{ "type": "command", "command": "rm -f ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }]
  }
}`,
};

// Feature grid. The governing rule, quotable: the signal is free, the reaction is paid.
export const FEATURE_RULE = "The signal is free. The reaction is paid.";

export const FREE_FEATURES: string[] = [
  "System-wide keyboard and trackpad lock, 5 seconds to 10 minutes on a two-zone slider",
  "Full-screen dark overlay on every display with a live countdown; timing survives sleep and wake",
  "Compact HUD-corner mode, and a keyboard-only mode that leaves the cursor visible",
  "Triple-Escape emergency unlock, always available",
  "Quick-pick durations, recordable global hotkey, sound feedback, last duration remembered",
  "Self-healing watchdog restores input automatically if the tap or the permission is lost",
  "Live per-tool agent status in the menu: working or idle and for how long, across concurrent sessions",
  "One-click hook install; nine tools built in (Claude Code, Codex, Cursor, Gemini, Aider, OpenCode, Cline, Hermes, Pi) plus custom agents",
  "Hook-free process detection fallback against a verified allowlist, with CPU-idle release",
  "Live view of the session dashboard",
];

export const PRO_FEATURES_LIST: string[] = [
  "Display-only or full-system sleep prevention, with an auto-off cap and re-enable on launch",
  "Battery guards: only-while-charging, and a battery cutoff (default 30%) with a re-enable-anyway banner",
  "Thermal guard: pauses on overheat and resumes on cooldown, trigger level configurable",
  "Clamshell keep-awake (lid closed, no external display) via a lease-bound privileged helper: a crashed app can never leave the Mac stuck awake",
  "Lid-close confirmation chime, plus four distinct pre-sleep motifs",
  "Lid-open summary notification: what ran, for how long, peak thermal pressure, guards fired",
  "One-shot and true weekly recurring schedules",
  "AI Coding mode: awake only while at least one agent works, released the instant the last goes idle",
  "Fail-safe throughout: a missed signal lets the Mac sleep, never the reverse",
  "Agent notifications, each toggleable: all idle, unexpected end, long-running session, session started",
  "End-of-session automations: Notify, Run Shortcut, Lock, Sleep behind a cancellable countdown",
  "In-app Alerts log of every automatic state change, surfaced by a menu-bar badge",
  "Dashboard History, Metrics, and Billing panes; per-project billable time with rounding rules and CSV export",
  "Consent-gated token-cost estimation for Claude Code sessions: usage and model fields only, never conversation content",
  "Retention controls: row cap and time window",
  "cleankey CLI (hold, release, acquire, status), file-based and SSH-reachable, works with the app closed",
  "MCP server: hold, release, and status as agent-callable tools, one-click install into Claude Code",
  "Menu-bar quick holds from 15 minutes to until-stopped, with live remaining time",
];

// The finish line: end-of-session automations (the flagship scenario).
export const AUTOMATIONS = {
  title: "The finish line: what happens when the work ends",
  body: [
    "Keep-awake gets your run to the end. End-of-session automations decide what happens the moment it stops: pick a trigger, pick the actions, and CleanKey runs them while you are away from the desk.",
    "The flagship case: your agent goes idle for twenty minutes, CleanKey sends a notification, runs your cleanup Shortcut, and puts the Mac to sleep. You come back to finished work and a cool, sleeping machine.",
  ],
  triggers: [
    "Your AI agent goes idle. The heartbeat goes stale past the timeout, so CleanKey treats the run as finished.",
    "The keep-awake cap expires. The maximum-duration timer you set runs out.",
    "A schedule window closes. A weekly or one-shot keep-awake window ends on its own.",
  ],
  actions: [
    {
      name: "Notify",
      body: "Post a notification so you know the session ended, even from another room.",
    },
    {
      name: "Run Shortcut",
      body: "Run any macOS Shortcut by name. Commit, push, post to Slack, anything Shortcuts can do, with no extra permissions and no change to how CleanKey is signed.",
    },
    {
      name: "Lock",
      body: "Lock the keyboard and trackpad with CleanKey’s own lock, so nothing disturbs the Mac after the run.",
    },
    {
      name: "Sleep",
      body: "Put the Mac to sleep once the rest of the sequence has finished.",
    },
  ] as AutomationAction[],
  safety:
    "Every sequence opens with a countdown you can cancel, from ten seconds to five minutes. Move the mouse, press a key, or click Cancel and nothing runs. If your agent picks the work back up, the countdown cancels itself. A failed step never blocks the others, only one sequence runs at a time, and the Alerts log records every run.",
};

// Comparison. Verbatim handoff intro; cells verified 2026-07-18 against caffeinagent.com,
// github.com/kageroumado/adrafinil (v1.5.1), and the Amphetamine App Store page. Two handoff
// [VERIFY] markers resolved on the same day: Agent Caffeine's battery clamshell needs a
// one-time sudoers setup (confirmed on caffeinagent.com); Amphetamine's "~20% auto-off" was
// not confirmable, so its cell states only the documented low-battery auto-end. Vigil
// (amazingmachine.app/vigil, not runvigil.ai, an unrelated AI-security product with the same
// name) added 2026-07-19 after the same verification pass: it is a general-purpose keep-awake
// app with no AI-agent awareness, so it is not a source of the [VERIFY] markers above.
export const COMPARISON_INTRO =
  "Amphetamine is excellent and free, and it deserves its reputation. But like every mainstream keep-awake app it has no idea what your agents are doing. Two newer tools do: Adrafinil (free, macOS 26.4+ only) and Agent Caffeine ($9). A third, Vigil (free, macOS 13+), does not detect agents either, but it goes further than Amphetamine on scheduling, profiles, and session history. Here is the honest picture, feature by feature, sources checked July 2026.";

export const COMPARISON_COLS = [
  "CleanKey",
  "Amphetamine",
  "Adrafinil",
  "Agent Caffeine",
  "Vigil",
];

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Price",
    values: [
      PRICING.step === "final"
        ? "Free + Pro €7.99 one-time"
        : `Free + Pro ${PRICING.price} one-time (list ${PRICING.listPrice})`,
      "Free",
      "Free (MIT)",
      "$9 one-time",
      "Free",
    ],
  },
  {
    label: "macOS required",
    values: ["14+", "10.13+", "26.4+", "13+", "13+"],
  },
  {
    label: "Detects AI coding agents",
    values: [
      "Yes (hooks + process fallback)",
      "No",
      "Yes (hooks + process fallback)",
      "Yes (process polling, 5 s)",
      "No",
    ],
  },
  {
    label: "Agent tools covered",
    values: [
      "9 built-in + custom UI",
      "n/a",
      "9 hooks + custom via CLI",
      "40+ allowlist, editable",
      "n/a",
    ],
  },
  {
    label: "Awake only while agents work",
    values: ["Yes", "No", "Yes", "Yes", "No"],
  },
  {
    label: "End-of-session action chain (notify, Shortcut, lock, sleep)",
    values: [
      "Yes (cancellable countdown)",
      "No (AppleScript for external automation)",
      "No",
      "No",
      "Partial (lock on end only)",
    ],
  },
  {
    label: "Agent notifications (idle / unexpected end / long-run)",
    values: ["Yes", "No", "No", "No", "No"],
  },
  {
    label: "Clamshell: lid closed, no external display",
    values: [
      "Yes (built-in helper)",
      "Partial (separate Enhancer app)",
      "Yes",
      "Partial (one-time sudo setup on battery)",
      "Partial (AC power only)",
    ],
  },
  {
    label: "Lid-close chime + pre-sleep sounds",
    values: [
      "Yes (chime + 4 motifs)",
      "No",
      "Partial (chime)",
      "No",
      "Partial (session start/end sound)",
    ],
  },
  {
    label: "Lid-open summary",
    values: ["Yes", "No", "Yes", "No", "No"],
  },
  {
    label: "Thermal guard",
    values: [
      "Yes (pause + auto-resume, configurable)",
      "No",
      "Partial (force-release)",
      "No",
      "No",
    ],
  },
  {
    label: "Battery guards (cutoff %, only-while-charging)",
    values: [
      "Yes (both)",
      "Partial (low-battery auto-end)",
      "No",
      "No",
      "Partial (fixed 20% cutoff)",
    ],
  },
  {
    label: "Native scheduling (one-shot + weekly)",
    values: [
      "Yes",
      "Partial (clock-time triggers)",
      "No",
      "No",
      "Yes (schedule + profiles)",
    ],
  },
  {
    label: "SSH-reachable CLI",
    values: ["Yes", "No", "Yes", "No", "Yes (Terminal, Shortcuts, CI)"],
  },
  {
    label: "MCP tool for agents",
    values: ["Yes", "No", "Yes", "No", "No"],
  },
  {
    label: "Timed holds from the menu",
    values: [
      "Yes (presets + readout)",
      "Yes (durations)",
      "Yes (time-boxed)",
      "No",
      "Yes (5 min to 4h + custom, countdown)",
    ],
  },
  {
    label: "Session history, metrics, billing, token cost",
    values: [
      "Yes",
      "No",
      "No",
      "Partial (reads Claude session files)",
      "Partial (last 100 sessions, weekly total)",
    ],
  },
  {
    label: "In-app alerts log",
    values: ["Yes", "No", "No", "No", "No"],
  },
  {
    label: "Keyboard/trackpad cleaning lock",
    values: ["Yes (free)", "No", "No", "No", "No"],
  },
];

// The mainstream field in one line, and the honest CleanKey-only set among the five apps
// above. Clamshell, lid-open summary, CLI, and MCP are NOT in this list on purpose:
// Adrafinil has all four since v1.5.1. Native scheduling is out too: Vigil has it (schedule +
// profiles), just without AI-agent awareness.
export const COMPARISON_FOOTNOTES: string[] = [
  "The mainstream field, briefly: KeepingYouAwake (free, MIT), Caffeinated ($3.99), and Lungo ($4) are manual on/off tools. None of the three detects agents, schedules natively, runs end-of-session actions, or supports a closed lid without an external display.",
  "Where CleanKey stands alone in this table: end-of-session action chains, the agent notifications suite, the dashboard with billing and token cost, an alerts log tied to AI-agent events, a thermal guard that pauses and resumes, configurable battery guards (cutoff percentage and only-while-charging, not a fixed threshold), and the free cleaning lock.",
];

export const USE_CASES: UseCase[] = [
  {
    title: "Agents overnight",
    body: "Start Claude Code or Codex before bed and close the lid. CleanKey holds the Mac awake exactly as long as the run lasts, then notifies you, runs your Shortcut, and lets it sleep.",
  },
  {
    title: "Renders and backups",
    body: "Long exports, builds, and backup jobs get a timed or scheduled hold with battery and thermal guards, and the lid-open summary tells you how it went.",
  },
  {
    title: "Presentations",
    body: "A quick menu-bar hold keeps the display awake through a talk or a screen share, then expires on its own. No trip to System Settings.",
  },
  {
    title: "Cleaning the keyboard",
    body: "Lock the keyboard and trackpad for a set time, wipe everything down, and triple-press Escape if you need out early. That part is free.",
  },
];

// Pricing section. The ladder sentence and prices come from ./pricing.
export const PRICING_COPY = {
  title: "Get CleanKey",
  freeName: "Free",
  freeBody:
    "The whole lock, the live agent status, the hook installer, process detection, and the dashboard’s live view.",
  proName: "Pro",
  proBody:
    "Everything that reacts: keep-awake and its guards, schedules, automations, notifications, history and billing, the CLI and the MCP tool.",
  note: "Pay once, no subscription. 14-day refund, and the lock stays free either way.",
};

// FAQ. The first eight are verbatim from the handoff (the trust floor: permissions,
// stuck-awake risk, privacy, why not MAS); the last four cover the practical questions
// buyers actually send. Phrased the way people type them into a search box.
export const FAQ: FaqItem[] = [
  {
    q: "Does it really keep the Mac awake with the lid closed?",
    a: "Yes, with no external display, through a privileged helper you approve on first use. The helper holds a lease that the app renews every few seconds; if CleanKey ever crashes, the lease expires and the Mac sleeps normally. It cannot get stuck awake.",
  },
  {
    q: "Why does CleanKey need the Accessibility permission?",
    a: "The keyboard lock swallows input events system-wide, which macOS only allows to apps you trust in System Settings, Privacy & Security, Accessibility. The keep-awake side does not use it.",
  },
  {
    q: "Does CleanKey read my code or my conversations?",
    a: "No. The agent hooks report only 'this session is alive' heartbeats. The optional token-cost estimate reads usage and model fields from local Claude Code session files, only after you opt in, and never the conversation content. There is no telemetry.",
  },
  {
    q: "What happens if an agent hangs or a hook misses?",
    a: "The Mac sleeps. Every detection path fails toward sleep, never toward stuck-awake. Battery cutoff and thermal pause add two more layers of protection.",
  },
  {
    q: "How is this different from Amphetamine?",
    a: "Amphetamine starts and stops awake sessions on triggers like time, app, or battery. It cannot tell whether your agents are working, and it cannot run actions when the work ends. CleanKey does both.",
  },
  {
    q: "Adrafinil is free. Why pay for CleanKey?",
    a: "Adrafinil covers keep-awake for agents and requires macOS 26.4. CleanKey runs on macOS 14+, adds weekly schedules, battery guards, agent notifications, end-of-session action chains, a session dashboard with billable time and token costs, and the keyboard-cleaning lock. If Adrafinil covers your need, use it; it is good software.",
  },
  {
    q: "Why is CleanKey not on the Mac App Store?",
    a: "The App Store sandbox forbids the two things CleanKey exists to do: suppressing input events and installing the lid-closed helper. The DMG is signed and notarized by Apple's process, and Sparkle keeps it updated.",
  },
  {
    q: "What exactly is free?",
    a: "The whole lock, the live agent status, the hook installer, process detection, and the dashboard's live view. Pro adds everything that reacts: keep-awake and its guards, schedules, automations, notifications, history and billing, the CLI and the MCP tool.",
  },
  {
    q: "How do updates work?",
    a: "Through Sparkle, built in: the app checks, downloads, verifies the signature, installs, and relaunches. Updates are included for life.",
  },
  {
    q: "Is it a subscription?",
    a: "No. One payment through Polar, the license key is yours, and every update is included.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. If Pro is not for you, write within 14 days of purchase and you get a full refund.",
  },
  {
    q: "How do I get help?",
    a: "Email stefferri@icloud.com and I will get back to you.",
  },
];

// Footer. The source repo is private, so GitHub links point at the public releases repo
// (signed DMGs + changelog); no source-repo link is exposed.
export const FOOTER_PRIVACY =
  "No telemetry. The only network calls CleanKey makes are Sparkle update checks, license validation, and the pricing-table refresh you trigger yourself.";

export const FOOTER_LINKS: FooterLink[] = [
  {
    label: "Releases and changelog",
    href: "https://github.com/istefox/CleanKey-releases/releases",
  },
  { label: "Download", href: "/cleankey/download" },
  { label: "Contact", href: "mailto:stefferri@icloud.com" },
  { label: "GitHub Sponsors", href: "https://github.com/sponsors/istefox" },
  { label: "Ko-fi", href: "https://ko-fi.com/stefox" },
];

export const SHOT_LIST: Shot[] = [
  // index 0 is the hero (rendered as a <video>, not inline).
  {
    key: "hero-ai-coding-mode.gif",
    caption: "CleanKey knows when your unattended work is done.",
  },
  {
    key: "keep-awake-pane.png",
    caption: "Keep Awake",
    title: "Keep Awake",
    desc: "Stop system and display sleep, cap it with an auto-off, and keep running with the lid closed through a signed helper.",
  },
  {
    key: "ai-coding-mode.png",
    caption: "AI coding mode",
    title: "AI coding mode",
    desc: "Stay awake while Claude Code or Codex works, then sleep after it goes idle. One paste wires the hook, and CleanKey detects the tool.",
  },
  {
    key: "battery-thermal.png",
    caption: "Battery and thermal guards",
    title: "Battery and thermal guards",
    desc: "Turn keep-awake off below a battery level or only while charging, and pause it when the Mac runs hot.",
  },
  {
    key: "schedule-weekly.png",
    caption: "Weekly schedule",
    title: "Weekly schedule",
    desc: "Set on and off hours per weekday. Keep-awake arms and releases itself, with no timer to babysit.",
  },
  {
    key: "automations-pane.png",
    caption: "End-of-session automations",
    title: "End-of-session automations",
    desc: "When a session ends, run a sequence you pick: notify, run a Shortcut, lock, sleep. Choose it per trigger: AI idle, time limit, schedule end.",
  },
  {
    key: "lock-pane.png",
    caption: "Lock for cleaning",
    title: "Lock for cleaning",
    desc: "Lock the keyboard and trackpad for a set time so you can wipe them down. Choose the scope, and triple-press Escape to get out early.",
  },
  {
    key: "alerts-center.png",
    caption: "Alerts log",
    title: "Alerts log",
    desc: "CleanKey logs every automatic state change, so you always see why keep-awake released or a session ended.",
  },
  {
    key: "menu-bar-states.png",
    caption: "Glance and know",
    title: "Glance and know",
    desc: "The menu-bar icon shows the state at a glance: off, keeping awake with a sun, or an unread alert.",
  },
];

// Distribution + purchase.
// The "Download free" CTA points at the in-site download page, which resolves the current DMG from
// the Sparkle appcast at build time (see src/pages/cleankey/download.astro). No source-repo link is
// exposed: the CleanKey code repo is private, only the signed DMG is distributed.
export const DOWNLOAD_URL = "/cleankey/download";

// The Sparkle appcast resolver (latest DMG + version at build time) lives in src/data/appcast.ts.

// Polar embedded checkout. Set POLAR_CHECKOUT_URL to the product/checkout link; leave '' to render
// the Buy-Pro CTA as "coming soon". The price shown anywhere on the site comes from ./pricing
// (launch ladder); the product price in the Polar dashboard must be kept in step by hand.
export const POLAR_CHECKOUT_URL: string =
  "https://buy.polar.sh/polar_cl_PBbomGVla4ni0vXmxjgo5myXmxtWNqyRCb2Og4K4BvS";
