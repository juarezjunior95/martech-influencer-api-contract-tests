const TEXT_FONT = "normal 12px 'Work Sans', sans-serif";
const TEXT_HORIZONTAL_PADDING = 10;

export function getTextWidth(labelText: string): number {
  type GetTextWidthFunction = typeof getTextWidth & {
    _canvas?: HTMLCanvasElement;
  };
  const canvas =
    (getTextWidth as GetTextWidthFunction)._canvas ||
    ((getTextWidth as GetTextWidthFunction)._canvas =
      document.createElement('canvas'));
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const approx = labelText.length * 10;
    return approx;
  }

  ctx.font = TEXT_FONT;
  const metrics = ctx.measureText(labelText);
  const width = metrics.width;
  return width;
}

export function valueFits(
  barLength: number,
  value: number,
  unitMeasure: string,
): boolean {
  const labelText = `${value}${unitMeasure ?? ''}`;
  const textWidth = getTextWidth(labelText);

  return textWidth + TEXT_HORIZONTAL_PADDING * 2 < barLength;
}

export const getBackgroundColor = (
  index: number,
  backgroundColor: string | string[],
): string => {
  if (Array.isArray(backgroundColor)) {
    return backgroundColor[index] || backgroundColor[0];
  }
  return backgroundColor;
};
