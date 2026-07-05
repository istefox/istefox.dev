# CleanKey — Product Spec

_A macOS menu-bar utility. Free keyboard + trackpad lock for cleaning; Pro keep-awake with an AI coding mode. Competitor facts below were verified 2026-07; re-check before publishing._

## One-liner
CleanKey keeps your Mac awake while your AI agent codes, and lets it sleep the second it's done. It also locks your keyboard and trackpad so you can wipe them clean.

## Elevator pitch
CleanKey is a small menu-bar app that does two things no single competitor does together. It locks the keyboard and trackpad for a set time so you can clean the hardware without typing garbage, and it keeps the Mac awake on your terms. Its Pro "AI coding mode" ties the awake state to your AI coder: while Claude Code or Codex is working, the Mac stays awake; when the agent goes idle, the Mac is free to sleep. All of it is notarized, guarded against overheating and battery drain, and designed so the Mac is never left stuck awake or stuck locked.

## What it does
Click the menu-bar icon and pick a duration to lock the keyboard and trackpad, then clean the keys without triggering anything. A countdown shows the time left, and three quick presses of Escape unlock immediately if you need out. That part is free.

The Pro tier adds keep-awake: stop the Mac (and optionally the display) from sleeping, with real safety rails. It pauses when the Mac runs hot, steps aside when the battery gets low, can stay awake with the lid closed, and can follow a weekly schedule. The headline Pro feature is AI coding mode, which links keep-awake to your AI coding agent's activity.

## Free vs Pro

| Feature | Free | Pro |
|---|---|---|
| Lock keyboard + trackpad for cleaning | Yes | Yes |
| Lock scope: keyboard+trackpad or keyboard-only | Yes | Yes |
| Quick-pick lock durations | Yes | Yes |
| Triple-Escape emergency unlock | Yes | Yes |
| Countdown overlay / HUD | Yes | Yes |
| Global hotkey to lock | Yes | Yes |
| Sound feedback, launch at login | Yes | Yes |
| Alerts Center (state-change log) | Yes | Yes |
| Auto-update (Sparkle) | Yes | Yes |
| Keep Awake (system + display) | No | Yes |
| Auto-off cap + re-enable on launch | No | Yes |
| Battery guards (only-while-charging, % cutoff) | No | Yes |
| Thermal protection (pause when hot) | No | Yes |
| Clamshell keep-awake (lid closed) | No | Yes |
| Weekly + one-shot schedule | No | Yes |
| AI coding mode (Claude Code / Codex) | No | Yes |

## Feature deep-dive (Pro)

### AI coding mode (the flagship)
Run a long task in Claude Code or Codex and walk away. While the agent works, the Mac stays awake; when it stops, the Mac sleeps. CleanKey does this by watching a small heartbeat file that your AI tool's hooks touch on each unit of work. If the file has been touched recently, the agent is active and keep-awake is on; once it goes stale past your idle timeout, the agent is done and keep-awake releases.

It is tool-agnostic on purpose: CleanKey watches a file, not a specific product, so anything that can touch a file drives it. It is also fail-safe: if the agent crashes, the terminal closes, or a hook never runs, the window simply lapses and the Mac sleeps. It never gets stuck awake.

Setup is one paste. The pane has a "Copy hook setup" button; drop the result into Claude Code's `~/.claude/settings.json` (or the Codex equivalent):

```json
{
  "hooks": {
    "PostToolUse":      [{ "matcher": ".*", "hooks": [{ "type": "command", "command": "mkdir -p ~/.cleankey && touch ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }],
    "UserPromptSubmit": [{ "hooks": [{ "type": "command", "command": "mkdir -p ~/.cleankey && touch ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }],
    "SessionEnd":       [{ "hooks": [{ "type": "command", "command": "rm -f ~/.cleankey/heartbeat", "async": true, "timeout": 1 }] }]
  }
}
```

### Keep Awake
Prevent system sleep, or both system and display sleep. Set a maximum duration so it turns itself off after a few hours, and optionally re-arm on launch.

### Thermal protection
Pause keep-awake when the Mac reaches a thermal pressure level you choose, and resume when it cools. Most keep-awake apps have no thermal guard and lean on macOS throttling instead.

### Battery guards
Turn keep-awake off below a battery percentage you set, or only allow it while charging. This protects the charge when you are unplugged.

### Clamshell keep-awake
Keep the Mac awake with the lid closed, driven by a signed privileged helper that leases the awake state and clears it automatically if CleanKey stops. The lease design means a crash or a force-quit does not leave the Mac stuck awake.

### Schedule
Arm keep-awake for a one-shot window or a recurring weekly schedule, so it turns on and off on its own.

## Why CleanKey vs the alternatives

Every claim below is sourced. Facts were checked 2026-07; competitors change, so re-verify before publishing.

| | CleanKey | Amphetamine | KeepingYouAwake | Adrafinil (CLI) |
|---|---|---|---|---|
| Keyboard + trackpad lock | Yes | No | No | No |
| Keep-awake | Yes | Yes | Yes | Yes |
| Battery % cutoff | Yes | Yes ([<10% / <20%][4]) | Yes (Low Power Mode) ([6]) | Not documented |
| Thermal pause | Yes | No ([relies on macOS][3]) | No ([6]) | Yes ([20]) |
| Clamshell (lid closed) | Yes (leased helper) | Yes (v5.0+) ([5]) | No ([6]) | Yes (XPC helper) ([20]) |
| AI-agent-driven awake | Yes (file heartbeat) | No | No | Yes (agent calls `acquire`/`release`, or process sniffing) ([20]) |
| Menu-bar GUI app | Yes | Yes ([1]) | Yes ([6]) | No (command line) ([20]) |
| Notarized paid app | Yes | Free ([1]) | Free / open source ([6]) | Free / open source ([20]) |

Honest differentiators:
- **Lock plus keep-awake, together.** No single app found in this research does both; lock tools and keep-awake tools are always separate.
- **AI coding mode in a GUI.** A couple of open-source command-line tools (Adrafinil, Agents Sleep Preventer) already tie keep-awake to AI agents, so CleanKey is not the first to the idea. CleanKey's version differs in two ways: it runs as a polished menu-bar app instead of a CLI you install and configure, and it triggers off a plain file heartbeat, so any tool that can touch a file works, with no dedicated binary to call.
- **Thermal pause is rare.** Among the mainstream menu-bar keep-awake apps (Amphetamine, KeepingYouAwake, Lungo, Owly, Theine), none pause on heat; they defer to macOS. CleanKey pauses at a level you pick.
- **Fail-safe by design.** The lock auto-releases if Accessibility permission is lost, the clamshell helper clears its lease if the app stops, and the AI window lapses on a missed signal. The Mac is never left stuck.
- **Honest note:** battery cutoff is common, not a differentiator, and clamshell is matched by Amphetamine and by the CLI tools. We lead with the combination and the packaging, not with single-feature firsts.

## Who it's for
- **The vibe coder.** Runs Claude Code or Codex on long tasks and wants the Mac awake during the run and asleep after, without babysitting a timer.
- **The clamshell power user.** Docks to an external display, or runs headless overnight jobs with the lid shut, and wants safety guards so nothing overheats.
- **Everyone with a dirty keyboard.** Wants to wipe the keys and trackpad without typing nonsense, with a guaranteed way out.

## Trust and safety
- Notarized by Apple, Hardened Runtime on.
- Auto-updates are cryptographically signed (EdDSA) on top of Gatekeeper, via Sparkle.
- Fail-safe watchdog throughout; wall-clock timekeeping so the countdown survives sleep and wake.
- Transparent Alerts Center logs every automatic state change, so you always see why the Mac was released or the lock ended.
- Local only. Keep-awake follows a file on your own machine; nothing about your work leaves the Mac.

## Pricing and licensing
CleanKey is free to download and use for the lock features. Pro unlocks keep-awake and everything above with a license key, activated in the app and sold through Polar. _(Insert current price here.)_

## FAQ
- **Does it need Accessibility permission?** Yes, the lock uses it to block input. If the permission is ever revoked, the lock releases itself.
- **Will keep-awake drain my battery?** Only if you let it. Set a battery cutoff or "only while charging", and it steps aside when unplugged or low.
- **Does it work with the lid closed?** Yes, with the clamshell option. It uses a signed helper that clears the awake state automatically if the app stops.
- **Does AI coding mode work with Codex, not just Claude Code?** Yes. It watches a file, so any tool whose hooks can touch that file works, including Codex.
- **What if my agent crashes mid-task?** The heartbeat goes stale and the Mac sleeps after the idle timeout. Nothing is left stuck awake.
- **Will it get hot running overnight?** Thermal protection pauses keep-awake when the Mac gets too warm and resumes when it cools.
- **Is it on the Mac App Store?** _(Answer per your plan.)_
- **How do updates work?** Built-in, signed, one click. The app checks, downloads, verifies, installs, and relaunches.

## Screenshot and GIF shot list (Pro)
Assets that best sell the Pro tier. For each: still or GIF, and a caption.
- **Hero GIF:** AI coding mode live. The menu-bar sun appears as the agent fires tools, then goes out when the task ends and the Mac sleeps. GIF. Caption: "Awake while it codes. Asleep when it's done."
- **Keep Awake pane:** the Pro options with the gold PRO badge in the sidebar. Still. Caption: "One pane, every guard."
- **AI coding mode section:** the toggle, idle-timeout, and "Copy hook setup" button. Still. Caption: "One paste to wire your agent."
- **Thermal + battery guards:** the rows for thermal trigger level and battery cutoff. Still. Caption: "Stays cool, saves charge."
- **Clamshell status:** the lid-closed option with the helper status dot. Still. Caption: "Lid down, still working."
- **Weekly schedule:** the schedule editor. Still. Caption: "Set it and forget it."
- **Alerts Center:** an entry reading "Keep Awake turned off — the AI coder went idle." Still. Caption: "Always know why."
- **Menu-bar icon states:** locked, awake, paused, side by side. Still. Caption: "Glance and know."

