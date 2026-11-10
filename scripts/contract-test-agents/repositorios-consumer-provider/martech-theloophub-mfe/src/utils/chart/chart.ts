export const getLabels = (labels: string[], breakLine = false) => {
  let newLabels = [];
  if (breakLine) {
    newLabels = labels.map((label) => {
      return breakLabel(label || '');
    });
  }

  return newLabels;
};

const breakLabel = (label: string) => {
  if (label.length > 15) {
    if (label.includes('|')) {
      const [first, second] = label.split('|');
      return [first + '|', breakLabel(second)].flat(Infinity);
    }

    if (label.includes('-')) {
      const [first, second] = label.split('-');
      return [first + '-', breakLabel(second)].flat(Infinity);
    }

    if (label.includes('(')) {
      const [first, second] = label.split('(');
      return [breakLabel(first), '(' + second].flat(Infinity);
    }

    if (label.includes('to')) {
      const [first, second] = label.split('to');
      return [first + 'to', breakLabel(second)].flat(Infinity);
    }

    if (label.includes('TO')) {
      const [first, second] = label.split('TO');
      return [first + 'TO', breakLabel(second)].flat(Infinity);
    }
  }

  return label;
};

function getAbbreviatedMonth() {
  return new Date().toLocaleString('en-US', { month: 'short' });
}

function getLastTwoDigitsOfYear(year = null) {
  const fullYear = year || new Date().getFullYear();
  return fullYear.toString().slice(-2);
}

export function getCurrentPeriod(year?: string) {
  const currentYear = year || new Date().getFullYear();
  const formattedYear = getLastTwoDigitsOfYear(currentYear);

  const currentQuarter =
    year && year >= currentYear
      ? `Q${Math.ceil((new Date().getMonth() + 1) / 3)}’${getLastTwoDigitsOfYear()}`
      : null;

  return [
    getAbbreviatedMonth(),
    formattedYear,
    currentYear.toString(),
    currentQuarter,
  ];
}

export function getQuarters(year: string): string[] {
  return [1, 2, 3, 4].map((number) => {
    return `Q${number}'${getLastTwoDigitsOfYear(year)}`;
  });
}

export const getChartAxisLimits = (data: any) => {
  const { min, max } = data || {};

  if (min == null || max == null) {
    return { yMin: 0, yMax: null };
  }

  const range = max - min;
  return {
    yMin: min - range * 0.3 - (range < 5 ? 2.5 : 0),
    yMax: max + range * 0.3 + (range < 5 ? 2.5 : 0),
  };
};
