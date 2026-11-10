/**
 * Shared demographic option registries for the cohorts preset and the
 * standalone gender, age-groups, and income-groups filters.
 */

/** Value / label / full-label row emitted in filter preset payloads. */
export interface DemographicTuple {
  value: string;
  label: string;
  full: string;
}

const row = (value: string, label: string): DemographicTuple => ({
  value,
  label,
  full: "",
});

/** Full gender filter option list, including the aggregate `All` row. */
export function getAllGenderTuples(): DemographicTuple[] {
  return [row("All", "All"), row("Male", "Male"), row("Female", "Female")];
}

/** Full age-band option list, including the aggregate `All` row. */
export function getAllAgeGroupTuples(): DemographicTuple[] {
  return [
    row("All", "All"),
    row("LDA - 24", "LDA-24"),
    row("25-34", "25-34"),
    row("35-44", "35-44"),
    row("45-54", "45-54"),
    row("55+", "55+"),
  ];
}

/** Full income-tier option list, including the aggregate `All` row. */
export function getAllIncomeGroupTuples(): DemographicTuple[] {
  return [
    row("All", "All"),
    row("High Income", "High Income"),
    row("Medium Income", "Medium Income"),
    row("Low Income", "Low Income"),
  ];
}

/** Social economic level tuples for POS tool drilldown cohorts. */
export function getAllSocialEconomicLevelTuples(): DemographicTuple[] {
  return [
    row("All", "All"),
    row("Low", "Low"),
    row("Medium", "Medium"),
    row("High", "High"),
  ];
}

/**
 * Drops the first tuple (the aggregate `All` row) so cohort slices only
 * expose specific segments.
 */
export function tuplesWithoutAll(rows: DemographicTuple[]): DemographicTuple[] {
  if (rows.length === 0) {
    return [];
  }
  return rows.slice(1).map((r) => ({ ...r }));
}
