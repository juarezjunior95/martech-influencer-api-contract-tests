import { getRankingLegendColor } from './rankingUtils';

const PATTERN_CONFIG = {
  type: 'striped',
  params: {
    color: 'white',
    angle: -45,
  },
};

export const getChartLegend = (legend: string) => {
  const color = getRankingLegendColor(legend);
  return {
    label: legend,
    color,
    pointStyle: 'lineThicker',
    fontWeight: 'bold',
    pattern: legend.includes('BU') ? PATTERN_CONFIG : null,
  };
};
