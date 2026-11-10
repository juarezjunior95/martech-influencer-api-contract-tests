/**
 * Single division row inside a competition (`label` / `value`).
 */
export interface CompetitionDivision {
  value: string;
  label: string;
}

/**
 * One competition row, with optional `divisions` and a `default`
 * division when the competition is a cup.
 */
export interface Competition {
  value: string;
  label: string;
  divisions?: CompetitionDivision[];
  default?: CompetitionDivision;
}

/**
 * Top-level default selection emitted alongside the competition list.
 */
export interface CompetitionDefault {
  value: string;
  label: string;
}

export interface GlCompetitionsPresetValue {
  enabled: boolean;
  default: CompetitionDefault | Record<string, never>;
  values: Competition[];
}

/**
 * Author-facing config for the `gl-competitions` preset.
 *
 *   - `type`: optional filter restricting the list to a single
 *     competition kind (`"league"` or `"cup"`). Anything else is
 *     rejected as a bad request. Omitted / empty returns the full
 *     list.
 *
 * Query overrides: `?gl-competitions[type]=cup` or a BFF-fixed
 * `type: "league" | "cup"`.
 */
export interface GlCompetitionsPresetConfig {
  type?: string;
}
