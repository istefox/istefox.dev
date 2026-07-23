// Resolves the current Agentwake DMG from the Sparkle appcast at build time, so the site always
// points at the latest signed release (the same feed that drives in-app auto-updates). Falls back
// to a pinned URL if the fetch or parse fails, so the pages never ship a dead button.
//
// Pinned fallback verified against the live appcast 2026-07-23: latest release is Agentwake 3.0.0
// (build 51). Keep this in step by hand whenever it drifts noticeably from the live feed.
export const APPCAST_URL =
  "https://raw.githubusercontent.com/istefox/Agentwake-releases/main/appcast.xml";
export const DMG_FALLBACK_URL =
  "https://github.com/istefox/Agentwake-releases/releases/download/v3.0.0/Agentwake-3.0.0.dmg";
export const DMG_FALLBACK_VERSION = "3.0.0";

export interface AppcastRelease {
  dmgUrl: string;
  version: string;
}

async function fetchLatest(): Promise<AppcastRelease> {
  let dmgUrl = DMG_FALLBACK_URL;
  let version = DMG_FALLBACK_VERSION;
  try {
    const res = await fetch(APPCAST_URL);
    if (res.ok) {
      const xml = await res.text();
      const url = xml.match(/<enclosure[^>]*\burl="([^"]+\.dmg)"/i)?.[1];
      const ver = xml.match(
        /<sparkle:shortVersionString>([^<]+)<\/sparkle:shortVersionString>/i,
      )?.[1];
      if (url) dmgUrl = url;
      if (ver) version = ver.trim();
    }
  } catch {
    // keep the fallback
  }
  return { dmgUrl, version };
}

// Memoized so the landing and the download page share one fetch per build.
let cached: Promise<AppcastRelease> | undefined;
export function resolveAppcast(): Promise<AppcastRelease> {
  cached ??= fetchLatest();
  return cached;
}
