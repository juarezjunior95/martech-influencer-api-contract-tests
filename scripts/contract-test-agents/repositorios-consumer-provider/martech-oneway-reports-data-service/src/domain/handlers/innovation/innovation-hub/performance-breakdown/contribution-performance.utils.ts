import { DataItem } from "@domain/entities/datasource.entity";

export const VALID_CONTRIBUTION_KPIS = new Set([
  "volume",
  "nr",
  "maco",
  "maco_margin",
]);

export const EPIC_CONTRIBUTION_LABELS = [
  "'24 FY",
  "'25 FY",
  "Expiration",
  "Baseline",
  "Y1",
  "Y2",
  "Y3",
  "Y4",
  "Y5",
  "'26 LE",
] as const;

const KPI_SLUG_ALIASES: Record<string, string> = {
  volume: "volume",
  nr: "nr",
  "net revenue": "nr",
  "net rev": "nr",
  "net rev.": "nr",
  maco: "maco",
  "maco margin": "maco_margin",
  maco_margin: "maco_margin",
};

const LABEL_INDEX_BY_KEY: Record<string, number> = {
  "'24 fy": 0,
  "24 fy": 0,
  "fy_year-2": 0,
  "fy year-2": 0,
  "'25 fy": 1,
  "25 fy": 1,
  "fy_year-1": 1,
  "fy year-1": 1,
  expiration: 2,
  baseline: 3,
  y1: 4,
  y2: 5,
  y3: 6,
  y4: 7,
  y5: 8,
  "'26 le": 9,
  "26 le": 9,
  le_year: 9,
  "le year": 9,
};

export const pickField = (
  item: Record<string, unknown>,
  ...keys: string[]
): unknown => {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null) {
      return item[key];
    }

    const upperKey = key.toUpperCase();
    if (item[upperKey] !== undefined && item[upperKey] !== null) {
      return item[upperKey];
    }
  }

  return undefined;
};

export const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numericValue = Number(value);

  return Number.isNaN(numericValue) ? undefined : numericValue;
};

export const normalizeKpi = (value: unknown): string | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value).trim().toLowerCase();
};

export const mapKpiSlug = (value: unknown): string | undefined => {
  const normalized = normalizeKpi(value);

  if (!normalized) {
    return undefined;
  }

  return KPI_SLUG_ALIASES[normalized] ?? normalized;
};

const normalizeLabelKey = (value: unknown): string =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export const resolveEpicLabelIndex = (
  item: Record<string, unknown>,
): number => {
  for (const field of [
    "period_label",
    "PERIOD_LABEL",
    "label",
    "LABEL",
    "bar_type",
    "BAR_TYPE",
  ]) {
    const value = pickField(item, field);

    if (value === undefined || value === null) {
      continue;
    }

    const key = normalizeLabelKey(value);

    if (key in LABEL_INDEX_BY_KEY) {
      return LABEL_INDEX_BY_KEY[key];
    }
  }

  const barOrder = toNumber(pickField(item, "bar_order", "BAR_ORDER"));

  if (
    barOrder !== undefined &&
    barOrder >= 1 &&
    barOrder <= EPIC_CONTRIBUTION_LABELS.length
  ) {
    return barOrder - 1;
  }

  return Number.MAX_SAFE_INTEGER;
};

export const sortByBarOrder = (rows: DataItem[]): DataItem[] =>
  [...rows].sort(
    (left, right) =>
      resolveEpicLabelIndex(left as Record<string, unknown>) -
      resolveEpicLabelIndex(right as Record<string, unknown>),
  );

export const toCanonicalPeriodLabel = (
  item: Record<string, unknown>,
  index: number,
): string => {
  const labelIndex = resolveEpicLabelIndex(item);

  if (labelIndex >= 0 && labelIndex < EPIC_CONTRIBUTION_LABELS.length) {
    return EPIC_CONTRIBUTION_LABELS[labelIndex];
  }

  if (index >= 0 && index < EPIC_CONTRIBUTION_LABELS.length) {
    return EPIC_CONTRIBUTION_LABELS[index];
  }

  return String(
    pickField(item, "period_label", "PERIOD_LABEL", "label", "LABEL") ?? "",
  );
};
