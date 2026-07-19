// Agentwake launch price ladder — the single source of truth for every price on the site.
// Handoff: docs/marketing/website-refactor-handoff-2026-07-18.md (Agentwake app repo), section 5.
//
// The ladder: €4.99 from day 0 (public launch) for 14 days, €5.99 through day 42, then the
// permanent €7.99 list price. Every date shown on the site is real and published in advance;
// a price never moves back down once it has risen. The only manual steps at each ladder
// boundary are (a) changing the product price in the Polar dashboard and (b) a rebuild —
// .github/workflows/scheduled-redeploy.yml handles the rebuild daily once the deploy-hook
// secret is set.
//
// To launch: set LAUNCH_DAY0 to the public launch date (Show HN day) and redeploy.
export const LAUNCH_DAY0: string | null = null; // e.g. "2026-08-04T00:00:00+02:00"

export type LadderStep = "prelaunch" | "launch" | "step2" | "final";

export interface Pricing {
  step: LadderStep;
  /** Display price for the current step, e.g. "€4.99". */
  price: string;
  /** Same figure for JSON-LD offers.price, e.g. "4.99". */
  priceNumeric: string;
  /** The permanent list price. */
  listPrice: string;
  /** Next ladder price, null on the final step. */
  nextPrice: string | null;
  /** When the price next rises. Null when day 0 is unset or on the final step. */
  nextDate: Date | null;
  nextDateISO: string | null;
  /** Human form for copy, e.g. "18 August 2026". */
  nextDateHuman: string | null;
  /** The banner renders only while a real, dated increase is ahead. */
  showBanner: boolean;
  bannerText: string | null;
  /** One-sentence ladder summary for the pricing section. */
  ladderSentence: string;
}

const STEP_PRICES: Record<Exclude<LadderStep, "prelaunch">, string> = {
  launch: "€4.99",
  step2: "€5.99",
  final: "€7.99",
};

// Boundaries are exact 24h multiples from the day-0 instant. If day 14 or day 42 crosses a
// Europe/Rome DST change, the flip lands one hour off local midnight; the dates shown on the
// site are formatted from these same instants, so the page always stays self-consistent.
const DAY_MS = 24 * 60 * 60 * 1000;

const human = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(d);

export function resolvePricing(now: Date = new Date()): Pricing {
  if (LAUNCH_DAY0 === null) {
    return {
      step: "prelaunch",
      price: STEP_PRICES.launch,
      priceNumeric: "4.99",
      listPrice: STEP_PRICES.final,
      nextPrice: STEP_PRICES.step2,
      nextDate: null,
      nextDateISO: null,
      nextDateHuman: null,
      showBanner: false,
      bannerText: null,
      ladderSentence:
        "Launch price €4.99. It rises to €5.99 two weeks after launch and settles at €7.99 six weeks in. One-time purchase, lifetime updates.",
    };
  }

  const day0 = new Date(LAUNCH_DAY0);
  const day14 = new Date(day0.getTime() + 14 * DAY_MS);
  const day42 = new Date(day0.getTime() + 42 * DAY_MS);

  if (now < day14) {
    return {
      step: "launch",
      price: STEP_PRICES.launch,
      priceNumeric: "4.99",
      listPrice: STEP_PRICES.final,
      nextPrice: STEP_PRICES.step2,
      nextDate: day14,
      nextDateISO: day14.toISOString(),
      nextDateHuman: human(day14),
      showBanner: true,
      bannerText: `Launch price: €4.99 until ${human(day14)}. Then €5.99, and €7.99 from ${human(day42)}. One-time purchase, lifetime updates.`,
      ladderSentence: `Launch price €4.99 until ${human(day14)}, then €5.99, and €7.99 from ${human(day42)}. One-time purchase, lifetime updates.`,
    };
  }

  if (now < day42) {
    return {
      step: "step2",
      price: STEP_PRICES.step2,
      priceNumeric: "5.99",
      listPrice: STEP_PRICES.final,
      nextPrice: STEP_PRICES.final,
      nextDate: day42,
      nextDateISO: day42.toISOString(),
      nextDateHuman: human(day42),
      showBanner: true,
      bannerText: `€5.99 until ${human(day42)}, then the price settles at €7.99. One-time purchase, lifetime updates.`,
      ladderSentence: `€5.99 until ${human(day42)}, then the price settles at €7.99. One-time purchase, lifetime updates.`,
    };
  }

  return {
    step: "final",
    price: STEP_PRICES.final,
    priceNumeric: "7.99",
    listPrice: STEP_PRICES.final,
    nextPrice: null,
    nextDate: null,
    nextDateISO: null,
    nextDateHuman: null,
    showBanner: false,
    bannerText: null,
    ladderSentence: "€7.99, one-time purchase, lifetime updates.",
  };
}

// Build-time snapshot. The site is static, so this is evaluated once per deploy; the daily
// scheduled redeploy keeps it aligned with the calendar once the ladder is running.
export const PRICING: Pricing = resolvePricing();
