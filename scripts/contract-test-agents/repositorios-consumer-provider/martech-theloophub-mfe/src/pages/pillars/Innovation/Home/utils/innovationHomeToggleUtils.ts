/** `[enabled, loading]` from `useFeatureToggle` */
export type InnovationHomeFeatureToggleTuple = readonly [boolean, boolean];

export function isInnovationHomeToggleOn(
  tuple: InnovationHomeFeatureToggleTuple,
) {
  const [enabled, loading] = tuple;
  return enabled && !loading;
}
