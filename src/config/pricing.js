/**
 * QuickQuote pricing config — Podere 173 · GemButcher
 * Edit these values whenever prices change.
 * All amounts in EUR. Ranges inclusive.
 */
export const PRICING = {
  sizes: [
    { id: "small",  min: 60,  max: 120, gate: false },
    { id: "medium", min: 120, max: 250, gate: true  },
    { id: "large",  min: 250, max: 400, gate: true  },
    { id: "xl",     min: 500, max: 700, gate: true  }, // Full day sitting (~8h)
  ],
  // `boost` = extra complexity uplift applied only when size.gate = true (medium+)
  styles: [
    { id: "patutikon",         boost: 0.20 },
    { id: "patutiki",          boost: 0.10 },
    { id: "samoano",           boost: 0.12 },
    { id: "giapponese",        boost: 0.05 },
    { id: "cyberpunk-organic", boost: 0    },
    { id: "blackwork",         boost: 0    },
    { id: "lettering",         boost: 0    },
    { id: "figurativo",        boost: 0    },
    { id: "anime",             boost: 0    },
    { id: "floreale",          boost: 0    },
    { id: "ornamentale",       boost: 0    },
  ],
  placements: [
    { id: "standard", multiplier: 1.0  },
    { id: "chest",    multiplier: 1.0  },
    { id: "ribs",     multiplier: 1.15 },
    { id: "neck",     multiplier: 1.20 },
    { id: "head",     multiplier: 1.15 },
    { id: "hand",     multiplier: 1.10 },
    { id: "foot",     multiplier: 1.10 },
  ],
};

/**
 * Compute a rounded price range for the chosen combo.
 * Style boost only kicks in for pieces medium and above (size.gate).
 */
export function computeQuote({ sizeId, styleId, placementId }) {
  const size = PRICING.sizes.find((s) => s.id === sizeId);
  const style = PRICING.styles.find((s) => s.id === styleId);
  const placement = PRICING.placements.find((p) => p.id === placementId);
  if (!size || !style || !placement) return null;

  let multiplier = placement.multiplier;
  if (style.boost > 0 && size.gate) {
    multiplier *= 1 + style.boost;
  }

  const round5 = (v) => Math.round(v / 5) * 5;
  return {
    min: round5(size.min * multiplier),
    max: round5(size.max * multiplier),
    currency: "€",
  };
}
