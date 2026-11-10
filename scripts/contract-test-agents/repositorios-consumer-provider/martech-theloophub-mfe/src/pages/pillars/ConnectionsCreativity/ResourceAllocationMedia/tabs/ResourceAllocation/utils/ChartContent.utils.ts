import { DatasetPattern } from 'models/ChartData';

import { StackedBarData } from '../types';

const STRIPED_PATTERN: DatasetPattern = {
  type: 'striped',
  flags: [0],
  params: {
    color: 'white',
    angle: 45,
    thickness: 3,
    spacing: 12,
  },
};

export const createDatasetWithPattern = (
  dataset: StackedBarData | undefined,
): StackedBarData => {
  if (!dataset) {
    return dataset;
  }

  return {
    ...dataset,
    pattern: STRIPED_PATTERN,
  };
};
