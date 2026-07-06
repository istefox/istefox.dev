// Structured content for the CleanKey product landing page (/cleankey), in English.
// Source of truth: docs/spec/CleanKey-spec.md. Kept data-driven so copy is easy to edit and translate.

export interface FeatureRow {
  feature: string;
  free: boolean;
  pro: boolean;
}

export interface ProFeature {
  title: string;
  body: string;
}

export interface AutomationAction {
  name: string;
  body: string;
}

export interface ComparisonRow {
  label: string;
  // order: CleanKey, Amphetamine, KeepingYouAwake, Adrafinil (CLI)
  values: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Shot {
  // Filename under src/assets/cleankey/ (matched by import.meta.glob). Rendered as a placeholder
  // until the real asset exists. `title`/`desc` add a caption under the shot in the gallery.
  key: string;
  caption: string;
  title?: string;
  desc?: string;
}

export const HERO = {
  headline: "Awake while it codes. Asleep when it’s done.",
  subhead:
    "Start a long run in Claude Code or Codex, then walk away. CleanKey keeps the Mac awake while the agent works and lets it sleep the moment it stops. It also locks the keyboard and trackpad so you can wipe them clean.",
  // Trust chips under the CTAs. Kept short: each one answers a purchase objection.
  chips: [
    "macOS, notarized",
    "Pay once — from €2.99",
    "14-day refund",
    "No subscription",
  ],
};

// Used for <meta description> and OG. Keep ≤160 chars so search results show it uncut.
export const META_DESCRIPTION =
  "Free macOS keyboard and trackpad lock for cleaning, plus Pro keep-awake with AI coding mode: your Mac stays awake while Claude Code or Codex works, then sleeps.";

export const WHAT_IT_DOES: string[] = [
  "Click the menu-bar icon and pick a duration to lock the keyboard and trackpad, then clean the keys without triggering anything. A countdown shows the time left, and three quick presses of Escape unlock immediately if you need out. That part is free.",
  "The Pro tier adds keep-awake: stop the Mac (and optionally the display) from sleeping, with real safety rails. It pauses when the Mac runs hot, steps aside when the battery gets low, can stay awake with the lid closed, and can follow a weekly schedule. The headline Pro feature is AI coding mode, which links keep-awake to your AI coding agent’s activity and can close the loop by running an action sequence when the agent is done.",
];

export const FREE_VS_PRO: FeatureRow[] = [
  { feature: "Lock keyboard + trackpad for cleaning", free: true, pro: true },
  {
    feature: "Lock scope: keyboard+trackpad or keyboard-only",
    free: true,
    pro: true,
  },
  { feature: "Quick-pick lock durations", free: true, pro: true },
  { feature: "Triple-Escape emergency unlock", free: true, pro: true },
  { feature: "Countdown overlay / HUD", free: true, pro: true },
  { feature: "Global hotkey to lock", free: true, pro: true },
  { feature: "Sound feedback, launch at login", free: true, pro: true },
  { feature: "Alerts Center (state-change log)", free: true, pro: true },
  { feature: "Auto-update (Sparkle)", free: true, pro: true },
  { feature: "Keep Awake (system + display)", free: false, pro: true },
  { feature: "Auto-off cap + re-enable on launch", free: false, pro: true },
  {
    feature: "Battery guards (only-while-charging, % cutoff)",
    free: false,
    pro: true,
  },
  { feature: "Thermal protection (pause when hot)", free: false, pro: true },
  { feature: "Clamshell keep-awake (lid closed)", free: false, pro: true },
  { feature: "Weekly + one-shot schedule", free: false, pro: true },
  { feature: "AI coding mode (Claude Code / Codex)", free: false, pro: true },
  {
    feature: "End-of-session automations (notify, run Shortcut, lock, sleep)",
    free: false,
    pro: true,
  },
];

// The flagship feature gets a dedicated block with the hook snippet; the rest are short cards.
export const AI_CODING_MODE = {
  title: "AI coding mode for Claude Code and Codex",
  body: [
    "Run a long task in Claude Code or Codex and walk away. While the agent works, the Mac stays awake; when it stops, the Mac sleeps. CleanKey watches a small heartbeat file that your AI tool’s hooks touch on each unit of work. If the file was touched recently, the agent is active and keep-awake is on; once it goes stale past your idle timeout, keep-awake releases.",
    "It is tool-agnostic on purpose: CleanKey watches a file, not a specific product, so anything that can touch a file drives it. It is also fail-safe: if the agent crashes, the terminal closes, or a hook never runs, the window simply lapses and the Mac sleeps. It never gets stuck awake.",
    "Setup is one paste. The pane has a “Copy hook setup” button; drop the result into Claude Code’s ~/.claude/settings.json (or the Codex equivalent). After an app update the installed hook refreshes itself, so the commands it injects always match the current version with no manual remove and re-add:",
  ],
  hookJson: `{
  "hooks": {
    "PostToolUse":      [{ "matcher": ".*", "hooks": [{ "type": "command", "command": "mkdir -p ~/.cleankey && touch ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }],
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "mkdir -p ~/.cleankey && touch ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }],
    "SessionEnd":       [{ "hooks": [{ "type": "command", "command": "rm -f ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }]
  }
}`,
};

// End-of-session automations (ADR-012). The "what happens when it's done" companion to AI
// coding mode: a trigger fires an ordered action sequence behind a cancelable countdown.
export const AUTOMATIONS = {
  title: "Close the loop: end-of-session automations",
  body: [
    "AI coding mode keeps the Mac awake while your agent works. End-of-session automations decide what happens the moment it stops. Pick a trigger, pick the actions, and CleanKey runs them while you are away from the desk.",
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
    "Every sequence opens with a countdown you can cancel, from ten seconds to five minutes. Move the mouse, press a key, or click Cancel and nothing runs. If your agent picks the work back up, the countdown cancels itself. A failed step never blocks the others, only one sequence runs at a time, and the Alerts Center logs every run.",
};

export const PRO_FEATURES: ProFeature[] = [
  {
    title: "Keep Awake",
    body: "Prevent system sleep, or both system and display sleep. Set a maximum duration so it turns itself off after a few hours, and optionally re-arm on launch.",
  },
  {
    title: "Thermal protection",
    body: "Pause keep-awake when the Mac reaches a thermal pressure level you choose, and resume when it cools. Most keep-awake apps have no thermal guard and lean on macOS throttling instead.",
  },
  {
    title: "Battery guards",
    body: "Turn keep-awake off below a battery percentage you set, or only allow it while charging. This protects the charge when you are unplugged.",
  },
  {
    title: "Clamshell keep-awake",
    body: "Keep the Mac awake with the lid closed, driven by a signed privileged helper that leases the awake state and clears it automatically if CleanKey stops. A crash or force-quit does not leave the Mac stuck awake.",
  },
  {
    title: "Schedule",
    body: "Arm keep-awake for a one-shot window or a recurring weekly schedule, so it turns on and off on its own.",
  },
];

export const COMPARISON_COLS = [
  "CleanKey",
  "Amphetamine",
  "KeepingYouAwake",
  "Adrafinil (CLI)",
];
export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "Keyboard + trackpad lock", values: ["Yes", "No", "No", "No"] },
  { label: "Keep-awake", values: ["Yes", "Yes", "Yes", "Yes"] },
  {
    label: "Battery % cutoff",
    values: ["Yes", "Yes", "Yes (Low Power Mode)", "Not documented"],
  },
  {
    label: "Thermal pause",
    values: ["Yes", "No (relies on macOS)", "No", "Yes"],
  },
  {
    label: "Clamshell (lid closed)",
    values: ["Yes (leased helper)", "Yes (v5.0+)", "No", "Yes (XPC helper)"],
  },
  {
    label: "AI-agent-driven awake",
    values: ["Yes (file heartbeat)", "No", "No", "Yes (process/agent)"],
  },
  {
    label: "Menu-bar GUI app",
    values: ["Yes", "Yes", "Yes", "No (command line)"],
  },
  {
    label: "Notarized paid app",
    values: ["Yes", "Free", "Free / open source", "Free / open source"],
  },
];

export const DIFFERENTIATORS: string[] = [
  "Lock plus keep-awake, together. No single app does both; lock tools and keep-awake tools are always separate.",
  "AI coding mode in a polished menu-bar app, not a CLI. It triggers off a plain file heartbeat, so any tool that can touch a file works, with no dedicated binary to call.",
  "Thermal pause is rare. Among mainstream menu-bar keep-awake apps, none pause on heat; they defer to macOS. CleanKey pauses at a level you pick.",
  "Fail-safe by design. The lock auto-releases if Accessibility permission is lost, the clamshell helper clears its lease if the app stops, and the AI window lapses on a missed signal. The Mac is never left stuck.",
];

export const WHO_FOR: ProFeature[] = [
  {
    title: "The vibe coder",
    body: "Runs Claude Code or Codex on long tasks and wants the Mac awake during the run and asleep after, without babysitting a timer.",
  },
  {
    title: "The clamshell power user",
    body: "Docks to an external display, or runs headless overnight jobs with the lid shut, and wants safety guards so nothing overheats.",
  },
  {
    title: "Everyone with a dirty keyboard",
    body: "Wants to wipe the keys and trackpad without typing nonsense, with a guaranteed way out.",
  },
];

export const TRUST: string[] = [
  "Notarized by Apple, Hardened Runtime on.",
  "Auto-updates are cryptographically signed (EdDSA) on top of Gatekeeper, via Sparkle.",
  "Fail-safe watchdog throughout; wall-clock timekeeping so the countdown survives sleep and wake.",
  "Transparent Alerts Center logs every automatic state change, so you always see why the Mac was released or the lock ended.",
  "Local only. Keep-awake follows a file on your own machine; nothing about your work leaves the Mac.",
];

export const FAQ: FaqItem[] = [
  {
    q: "Does it need Accessibility permission?",
    a: "Yes, the lock uses it to block input. If the permission is ever revoked, the lock releases itself.",
  },
  {
    q: "Will keep-awake drain my battery?",
    a: "Only if you let it. Set a battery cutoff or “only while charging”, and it steps aside when unplugged or low.",
  },
  {
    q: "Does it work with the lid closed?",
    a: "Yes, with the clamshell option. It uses a signed helper that clears the awake state automatically if the app stops.",
  },
  {
    q: "Does AI coding mode work with Codex, not just Claude Code?",
    a: "Yes. It watches a file, so any tool whose hooks can touch that file works, including Codex.",
  },
  {
    q: "What can it do when my agent finishes?",
    a: "End-of-session automations run a sequence you choose: notify, run a macOS Shortcut, lock, then sleep. A countdown you can cancel runs first, and nothing happens if you move the mouse or the agent starts working again.",
  },
  {
    q: "What if my agent crashes mid-task?",
    a: "The heartbeat goes stale and the Mac sleeps after the idle timeout. Nothing is left stuck awake.",
  },
  {
    q: "Will it get hot running overnight?",
    a: "Thermal protection pauses keep-awake when the Mac gets too warm and resumes when it cools.",
  },
  {
    q: "How do updates work?",
    a: "Built-in, signed, one click. The app checks, downloads, verifies, installs, and relaunches.",
  },
  {
    q: "How do I buy CleanKey Pro?",
    a: "Buy a license through Polar, then paste the key into the app’s License pane. Every Pro feature unlocks, and the lock stays free either way.",
  },
  {
    q: "How much does Pro cost?",
    a: "Pay what you want, from €2.99, with €4.99 suggested. One payment, not a subscription, and the license is yours to keep.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes. If Pro is not for you, ask within 14 days and you get a full refund.",
  },
  {
    q: "Is it a subscription?",
    a: "No. You pay once, keep the license, and updates arrive in the app.",
  },
  {
    q: "How do I get help?",
    a: "Email stefferri@icloud.com and I will get back to you.",
  },
];

export const SHOT_LIST: Shot[] = [
  // index 0 is the hero (rendered as a <video>, not in the gallery).
  {
    key: "hero-ai-coding-mode.gif",
    caption: "Awake while it codes. Asleep when it’s done.",
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
    caption: "Alerts Center",
    title: "Alerts Center",
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
// the Buy-Pro CTA as "coming soon". Pro is pay-what-you-want (min €2.99, suggested €4.99); PRO_PRICE
// is the display figure on the CTA (the Polar checkout shows the real amount either way).
export const POLAR_CHECKOUT_URL: string =
  "https://buy.polar.sh/polar_cl_PBbomGVla4ni0vXmxjgo5myXmxtWNqyRCb2Og4K4BvS";
export const PRO_PRICE: string | null = "€4.99";
