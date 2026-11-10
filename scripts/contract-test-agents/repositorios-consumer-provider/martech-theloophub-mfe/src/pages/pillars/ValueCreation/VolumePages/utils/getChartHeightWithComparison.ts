export const getChartHeightWithComparison = (
  maxChartHeight = 258,
  comparisonLength = 0,
  comparisonHeight = 38,
) => {
  return maxChartHeight - comparisonLength * comparisonHeight + 'px';
};
