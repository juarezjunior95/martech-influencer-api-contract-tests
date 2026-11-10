export const BASE_LINE_COLORS: Record<string, string> = {
  Megabrands: '#EBB400',
  Expansion: '#C9AF82',
  Sustain: '#70C6FF',
  Tail: '#B5B4AF',
};

export const getBaseLineColors = (array: string[]) => {
  if (!array) return [];
  return array.map((color) => {
    if (!color) return 'transparent';

    if (BASE_LINE_COLORS[color]) {
      return BASE_LINE_COLORS[color];
    }

    return color;
  });
};
