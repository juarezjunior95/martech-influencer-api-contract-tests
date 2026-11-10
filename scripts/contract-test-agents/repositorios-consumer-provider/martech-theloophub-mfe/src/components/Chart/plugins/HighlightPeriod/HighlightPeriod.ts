import { AnnotationOptions } from 'chartjs-plugin-annotation';

/**
 * Creates annotation configurations for highlighting specific indexes in a chart
 * @param highlightedIndexes - Array of indexes to highlight
 * @param color - Background color for the highlight (default: light yellow)
 * @returns Annotation configuration object
 */
export function createHighlightAnnotations(
  highlightedIndexes: number[],
  color = 'rgba(255, 247, 205, 0.4)',
): Record<string, AnnotationOptions> {
  if (!highlightedIndexes || highlightedIndexes.length === 0) {
    return {};
  }

  const annotations: Record<string, AnnotationOptions> = {};

  highlightedIndexes.forEach((index, idx) => {
    annotations[`highlight-${idx}`] = {
      type: 'box',
      xMin: index - 0.5,
      xMax: index + 0.5,
      yMax: Number.MAX_SAFE_INTEGER,
      backgroundColor: color,
      borderWidth: 0,
      drawTime: 'beforeDatasetsDraw',
    };
  });

  return annotations;
}
