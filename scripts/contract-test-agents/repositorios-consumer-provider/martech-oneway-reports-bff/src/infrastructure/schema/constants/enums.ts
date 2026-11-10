/**
 * Shared schema constants and enums
 * Single source of truth for reusable validation values
 */

export const VARIATION_DIRECTIONS = ["up", "down", "neutral"] as const;

export const UNIT_OF_MEASURE = ["pp", "%", "hl", "number"] as const;

export const TEXT_ALIGNMENTS = ["left", "center", "right"] as const;

export const TITLE_SIZES = ["H2", "H3", "H4", "H5"] as const;

export const HEX_COLOR_PATTERN = "^#[0-9A-Fa-f]{6}$";

export const STRICT_ID_PATTERN = "^[a-z][a-z0-9_-]*$";

export const ID_PATTERN = "^[a-zA-Z_][a-zA-Z0-9_-]*$";

export const DYNAMIC_PROPERTY_PATTERN = "^[a-zA-Z_][a-zA-Z0-9_-]*$";

export const TREND_VALUES = ["positive", "negative"] as const;

export const INNOVATION_CARD_IDS = [
  "volume",
  "volumeMix",
  "nr",
  "maco",
] as const;
