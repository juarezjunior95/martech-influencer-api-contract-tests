import { DataItem } from "@domain/entities/datasource.entity";
import { formatDirection } from "@common/utils/direction.utils";

export const VALID_OVERTIME_KPIS = new Set([
  "volume",
  "nr",
  "maco",
  "maco_margin",
]);

const OVERTIME_KPI_ALIASES: Record<string, string> = {
  volume: "volume",
  nr: "nr",
  "net revenue": "nr",
  maco: "maco",
  maco_margin: "maco_margin",
  "maco margin": "maco_margin",
};

const MONTH_NAME_TO_NUMBER: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
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

export const normalizeMonth = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const numericValue = Number(value);

  if (!Number.isNaN(numericValue) && numericValue >= 1 && numericValue <= 12) {
    return Math.floor(numericValue);
  }

  const monthKey = String(value).trim().toLowerCase().slice(0, 3);

  return MONTH_NAME_TO_NUMBER[monthKey];
};

export const normalizeKpiName = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/^innovation_/, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ");

  return OVERTIME_KPI_ALIASES[normalized];
};

export const variationDirection = (
  value: number | undefined,
): string | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return formatDirection(value);
};

export const hasInvalidOvertimeKpiRows = (rows: DataItem[]): boolean => {
  return rows.some((row) => {
    const rawKpiName = pickField(
      row as Record<string, unknown>,
      "kpi_name",
      "KPI_NAME",
    );

    if (rawKpiName === undefined || rawKpiName === null || rawKpiName === "") {
      return false;
    }

    return normalizeKpiName(rawKpiName) === undefined;
  });
};
