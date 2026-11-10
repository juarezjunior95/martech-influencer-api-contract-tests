export function buildFilterSearchParams(
  applied: Record<string, any>,
  extras?: Record<string, string>,
): URLSearchParams {
  const params = new URLSearchParams();
  if (applied?.zone) params.set('filter_zone', String(applied.zone));
  if (applied?.country) params.set('filter_country', String(applied.country));
  if (applied?.years) params.set('filter_years', String(applied.years));
  if (applied?.segments)
    params.set('filter_segments', String(applied.segments));
  if (extras) {
    Object.entries(extras).forEach(([k, v]) => params.set(k, v));
  }
  return params;
}
