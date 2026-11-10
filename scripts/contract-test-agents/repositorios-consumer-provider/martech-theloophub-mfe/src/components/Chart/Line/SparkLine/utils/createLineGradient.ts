export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '222, 179, 51';
  return [
    Number.parseInt(result[1], 16),
    Number.parseInt(result[2], 16),
    Number.parseInt(result[3], 16),
  ].join(', ');
};

export const createLineGradient = (
  ctx: CanvasRenderingContext2D,
  top: number,
  bottom: number,
  colorRgb: string,
  opacityStart = 0.35,
  opacityEnd = 0,
): CanvasGradient => {
  const gradient = ctx.createLinearGradient(0, top, 0, bottom);
  gradient.addColorStop(0, `rgba(${colorRgb}, ${opacityStart})`);
  gradient.addColorStop(1, `rgba(${colorRgb}, ${opacityEnd})`);
  return gradient;
};
