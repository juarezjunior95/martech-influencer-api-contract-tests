export function isVisualZeroBar(dataset: any, index: number): boolean {
  const originalValues = dataset.originalValues || dataset.data;
  const value = originalValues[index];
  if (value !== 0) return false;

  for (let j = 0; j < index; j++) {
    if (typeof originalValues[j] === 'number' && originalValues[j] > 0) {
      return true;
    }
  }
  return false;
}

export function isPreStartZero(dataset: any, index: number): boolean {
  const originalValues = dataset.originalValues || dataset.data;
  if (originalValues[index] !== 0) return false;
  for (let j = 0; j < index; j++) {
    if (typeof originalValues[j] === 'number' && originalValues[j] > 0)
      return false;
  }
  return true;
}

export function countVisualZeroBarsBelow(
  datasets: any[],
  datasetIndex: number,
  columnIndex: number,
): number {
  let count = 0;
  for (let d = datasetIndex - 1; d >= 0; d--) {
    if (isVisualZeroBar(datasets[d], columnIndex)) {
      count++;
    } else {
      break;
    }
  }
  return count;
}
