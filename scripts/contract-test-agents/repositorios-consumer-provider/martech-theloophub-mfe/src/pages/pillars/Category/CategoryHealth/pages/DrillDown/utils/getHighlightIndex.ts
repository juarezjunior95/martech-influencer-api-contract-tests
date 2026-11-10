export function getHighlightIndex(
  labels: string[],
  highlightLabel?: string,
): number | undefined {
  if (!highlightLabel) return undefined;

  const idx = labels.indexOf(highlightLabel);
  if (idx === -1) return undefined;

  return idx;
}
