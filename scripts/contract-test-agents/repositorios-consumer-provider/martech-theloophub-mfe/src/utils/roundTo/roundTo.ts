export function roundNumbersTo(array: number[], roundTo = 100): number[] {
  const rounded = array.map((n) => Math.abs(n * 10) / 10);

  const absTotal = rounded.reduce((acc, n) => acc + n, 0);
  const diff = roundTo - absTotal;

  if (Math.abs(diff) < 0.00001) {
    return rounded.map((n) => Number.parseFloat(n.toFixed(2)));
  }

  const adjusted = rounded.map((n) => {
    const proportion = Math.abs(n) / absTotal;
    const adjustment = diff * proportion;
    const newValue = Math.abs(n) + adjustment;

    return Number.parseFloat((Math.round(newValue * 1e6) / 1e6).toFixed(2));
  });

  return adjusted;
}
