export function getVerticalBorderWidths(dataset: any): {
  top: number;
  bottom: number;
} {
  const borderWidth = dataset?.borderWidth;

  if (typeof borderWidth === 'number') {
    return { top: borderWidth, bottom: borderWidth };
  }

  if (borderWidth && typeof borderWidth === 'object') {
    return {
      top: typeof borderWidth.top === 'number' ? borderWidth.top : 0,
      bottom: typeof borderWidth.bottom === 'number' ? borderWidth.bottom : 0,
    };
  }

  return { top: 0, bottom: 0 };
}
