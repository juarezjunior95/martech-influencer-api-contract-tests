/**
 * Innovation Hub Overview — BFF preset adapter for KPI scope.
 *
 * The BFF `kpis.values` list is the source of truth for **order** and which cards exist.
 * Preset `value` strings (often snake_case) map to in-app card ids (camelCase) via
 * {@link presetKpiValueToOverviewCardId}. When building view filters for the BFF, use
 * {@link overviewCardIdToPresetKpiValue} for snake_case payloads. Do not duplicate a fixed
 * KPI key list on the front; derive from the preset instead.
 */
import type { FilterDataStructure } from 'models/Filters';

/**
 * Maps a BFF preset KPI `value` (often snake_case) to a stable Overview card id (camelCase).
 */
export function presetKpiValueToOverviewCardId(raw: string): string | null {
  const normalized = raw.trim().replaceAll('-', '_');
  if (!normalized) return null;
  return normalized.replace(/_([a-z])/g, (_: string, letter: string) =>
    letter.toUpperCase(),
  );
}

/** Inverse of {@link presetKpiValueToOverviewCardId} for BFF payloads (e.g. view filters). */
export function overviewCardIdToPresetKpiValue(cardId: string): string {
  return cardId
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/** All KPI cards from the preset, in BFF order (includes disabled). */
export function getOrderedOverviewCardIdsFromKpisPreset(
  kpis: FilterDataStructure['kpis'],
): string[] {
  const values = kpis?.values;
  if (!Array.isArray(values) || values.length === 0) {
    return [];
  }

  const out: string[] = [];
  for (const opt of values) {
    const id = presetKpiValueToOverviewCardId(String(opt.value));
    if (id && !out.includes(id)) {
      out.push(id);
    }
  }
  return out;
}

/** KPI cards the user may open in Performance & Breakdown (`!isDisabled` in preset). */
export function getNavigableOverviewCardIdsFromKpisPreset(
  kpis: FilterDataStructure['kpis'],
): string[] {
  const values = kpis?.values;
  if (!Array.isArray(values) || values.length === 0) {
    return [];
  }

  const out: string[] = [];
  for (const opt of values) {
    if (opt.isDisabled) continue;
    const id = presetKpiValueToOverviewCardId(String(opt.value));
    if (id && !out.includes(id)) {
      out.push(id);
    }
  }
  return out;
}

/** Normalizes ad-hoc KPI tokens (URL, sub-filters) to Overview card ids. */
export function normalizeInnovationHubKpiTokens(raw: unknown): string[] {
  const strings: string[] = [];
  if (Array.isArray(raw)) {
    strings.push(...raw.map(String));
  } else if (typeof raw === 'string' && raw.length > 0) {
    strings.push(raw);
  }
  const keys: string[] = [];
  for (const s of strings) {
    const id = presetKpiValueToOverviewCardId(s);
    if (id && !keys.includes(id)) {
      keys.push(id);
    }
  }
  return keys;
}
