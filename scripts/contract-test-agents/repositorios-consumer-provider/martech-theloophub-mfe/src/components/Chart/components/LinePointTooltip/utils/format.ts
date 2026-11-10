/**
 * Parses a metric value shown in chart tooltips (EU-style separators, optional `k` suffix).
 * Used when only the localized `formattedValue` string is available.
 */
export function parseMetricNumberString(raw: string): number | null {
  const s = raw.trim().replace(/k$/i, '').trim();
  if (!s || s === '—' || s === '-') return null;

  if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    const n = Number(s.replaceAll('.', '').replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }

  const dot = s.indexOf('.');
  const lastComma = s.lastIndexOf(',');
  if (
    lastComma > -1 &&
    (dot === -1 || lastComma > dot) &&
    /^\d+$/.test(s.slice(lastComma + 1))
  ) {
    const head = s.slice(0, lastComma).replaceAll('.', '');
    const n = Number(`${head}.${s.slice(lastComma + 1)}`);
    return Number.isFinite(n) ? n : null;
  }

  const n = Number(s.replaceAll(',', ''));
  return Number.isFinite(n) ? n : null;
}
