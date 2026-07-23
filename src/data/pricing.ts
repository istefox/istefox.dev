// Agentwake launch price ladder — the single source of truth for every price on the site.
//
// Calendar ladder (fixed dates, no launch-day trigger): the beta runs until 31 August 2026
// (free lifetime Pro for testers, handled outside this file); Pro sells at €3.99 for the
// whole of September 2026 and settles at the permanent €7.99 list price from 1 October 2026.
// Every date shown on the site is real and published in advance; the price never moves back
// down once it has risen. The only manual step at each boundary is changing the product price
// in the Polar dashboard (€3.99 on 1 Sep 2026, €7.99 on 1 Oct 2026) — the site itself stays
// aligned via the daily rebuild in .github/workflows/scheduled-redeploy.yml.
export const LAUNCH_START = "2026-09-01T00:00:00+02:00";
export const FULL_PRICE_FROM = "2026-10-01T00:00:00+02:00";

export type LadderStep = "prelaunch" | "launch" | "final";

export interface Pricing {
  step: LadderStep;
  /** Display price for the current step, e.g. "€3.99". */
  price: string;
  /** Same figure for JSON-LD offers.price, e.g. "3.99". */
  priceNumeric: string;
  /** The permanent list price. */
  listPrice: string;
  /** Next ladder price, null on the final step. */
  nextPrice: string | null;
  /** When the price next rises. Null on the final step. */
  nextDate: Date | null;
  nextDateISO: string | null;
  /** Human form for copy, e.g. "1 October 2026". */
  nextDateHuman: string | null;
  /** The banner renders only while a real, dated increase is ahead. */
  showBanner: boolean;
  bannerText: string | null;
  /** One-sentence ladder summary for the pricing section. */
  ladderSentence: string;
}

const STEP_PRICES: Record<Exclude<LadderStep, "prelaunch">, string> = {
  launch: "€3.99",
  final: "€7.99",
};

const human = (d: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Rome",
  }).format(d);

export function resolvePricing(now: Date = new Date()): Pricing {
  const launchStart = new Date(LAUNCH_START);
  const fullPriceFrom = new Date(FULL_PRICE_FROM);

  // Beta phase. The public checkout is not promoted yet, so no banner; the launch price is
  // already the ladder's September figure for any surface that needs one (e.g. the parked
  // landing preview).
  if (now < launchStart) {
    return {
      step: "prelaunch",
      price: STEP_PRICES.launch,
      priceNumeric: "3.99",
      listPrice: STEP_PRICES.final,
      nextPrice: STEP_PRICES.final,
      nextDate: fullPriceFrom,
      nextDateISO: fullPriceFrom.toISOString(),
      nextDateHuman: human(fullPriceFrom),
      showBanner: false,
      bannerText: null,
      ladderSentence:
        "Launch price €3.99 for all of September 2026, then €7.99 from 1 October 2026. One-time purchase, lifetime updates.",
    };
  }

  if (now < fullPriceFrom) {
    return {
      step: "launch",
      price: STEP_PRICES.launch,
      priceNumeric: "3.99",
      listPrice: STEP_PRICES.final,
      nextPrice: STEP_PRICES.final,
      nextDate: fullPriceFrom,
      nextDateISO: fullPriceFrom.toISOString(),
      nextDateHuman: human(fullPriceFrom),
      showBanner: true,
      bannerText:
        "Launch price: €3.99 until 30 September 2026, then €7.99. One-time purchase, lifetime updates.",
      ladderSentence:
        "Launch price €3.99 until 30 September 2026, then €7.99 from 1 October. One-time purchase, lifetime updates.",
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
// scheduled redeploy keeps it aligned with the calendar as the ladder boundaries pass.
export const PRICING: Pricing = resolvePricing();
