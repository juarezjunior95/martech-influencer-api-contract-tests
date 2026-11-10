import { defaultBarsThickness } from 'pages/constants';
import { KpiConfig } from 'pages/types';

export const beesDistributionKpiConfig: Record<string, KpiConfig> = {
  total_distribution: {
    key: 'total_distribution',
    kpiName: 'total_distribution',
    barsThickness: defaultBarsThickness,
    chartType: {
      total_per_year_full: 'bar',
      total_per_month_quarter: 'line',
    },
    measure: 'Mio',
    tooltip: {
      content: 'PortfolioBrand.Cores.kpis.cores.tooltip',
      source: 'sunlight',
      refresh: 'monthly',
    },
    title: 'Total distribution',
    kpiGroup: 'finance',
  },
  total_buyers: {
    key: 'total_buyers',
    kpiName: 'total_buyers',
    barsThickness: defaultBarsThickness,
    chartType: {
      total_per_year_full: 'bar',
      total_per_month_quarter: 'line',
    },
    measure: 'Mio',
    tooltip: {
      content: 'PortfolioBrand.Cores.kpis.cores.tooltip',
      source: 'sunlight',
      refresh: 'monthly',
    },
    title: 'Total Buyers',
    kpiGroup: 'finance',
  },
  sku_per_poc: {
    key: 'sku_per_poc',
    kpiName: 'sku_per_poc',
    barsThickness: defaultBarsThickness,
    chartType: {
      total_per_year_full: 'bar',
      total_per_month_quarter: 'line',
    },
    measure: '#',
    tooltip: {
      content: 'PortfolioBrand.Cores.kpis.cores.tooltip',
      source: 'sunlight',
      refresh: 'monthly',
    },
    title: 'SKU per POC',
    kpiGroup: 'finance',
  },
};
