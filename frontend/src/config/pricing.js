/**
 * QuickQuote pricing config — Podere 173 · GemButcher
 * Edit ranges here to keep the "60 second quote" tool in sync with reality.
 * All amounts in EUR. Ranges are inclusive.
 */
export const PRICING = {
  sizes: [
    { id: "small",  min: 60,  max: 120, gate: false },
    { id: "medium", min: 120, max: 250, gate: true  },
    { id: "large",  min: 250, max: 400, gate: true  },
    { id: "xl",     min: 500, max: 700, gate: true  }, // Full day sitting (~8h)
  ],
  styles: [
    { id: "patutikon",          patutikonBoost: true  },
    { id: "patutiki",           patutikonBoost: false },
    { id: "cyberpunk-organic",  patutikonBoost: false },
    { id: "blackwork",          patutikonBoost: false },
  ],
  placements: [
    { id: "standard", multiplier: 1.0 },
    { id: "chest",    multiplier: 1.0 },
    { id: "ribs",     multiplier: 1.15 },
    { id: "neck",     multiplier: 1.20 },
    { id: "head",     multiplier: 1.15 },
    { id: "hand",     multiplier: 1.10 },
    { id: "foot",     multiplier: 1.10 },
  ],
  // Patutikon complexity uplift only kicks in for medium+ pieces
  patutikon_multiplier: 1.20,
};

/**
 * Compute a rounded price range for the chosen combo.
 * Returns { min, max, currency }
 */
export function computeQuote({ sizeId, styleId, placementId }) {
  const size = PRICING.sizes.find((s) => s.id === sizeId);
  const style = PRICING.styles.find((s) => s.id === styleId);
  const placement = PRICING.placements.find((p) => p.id === placementId);
  if (!size || !style || !placement) return null;

  let multiplier = placement.multiplier;
  if (style.patutikonBoost && size.gate) {
    multiplier *= PRICING.patutikon_multiplier;
  }

  const round5 = (v) => Math.round(v / 5) * 5;
  return {
    min: round5(size.min * multiplier),
    max: round5(size.max * multiplier),
    currency: "€",
  };
}
