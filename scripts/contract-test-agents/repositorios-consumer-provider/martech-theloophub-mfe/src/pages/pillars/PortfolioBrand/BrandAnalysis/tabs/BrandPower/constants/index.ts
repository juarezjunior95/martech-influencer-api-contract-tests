import { KpiConfig } from 'pages/types';

import { applyCompetitorConfigs } from '../utils/applyConfigs';

export const ALL_BRANDS_VALUE = 'All';
export const DEFAULT_AWARENESS_OPTION = 'unaided-awareness';

export const powerKpiConfigs: Record<string, KpiConfig> = {
  power: {
    key: 'power',
    measure: 'PortfolioBrand.BrandPower.kpis.brandPower.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.brandPower.tooltip',
      source: 'kantar',
      refresh: 'quarterly',
    },
    title: 'PortfolioBrand.BrandPower.kpis.brandPower.title',
    titleAllBrands: 'PortfolioBrand.BrandPower.kpis.brandPower.titleAllBrands',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  meaning: {
    key: 'meaning',
    measure: 'PortfolioBrand.BrandPower.kpis.meaning.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.meaning.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.meaning.title',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  affinity: {
    key: 'affinity',
    measure: 'PortfolioBrand.BrandPower.kpis.affinity.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.affinity.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.affinity.title',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  meetNeeds: {
    key: 'meetNeeds',
    measure: 'PortfolioBrand.BrandPower.kpis.meetNeeds.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.meetNeeds.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.meetNeeds.title',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  difference: {
    key: 'difference',
    measure: 'PortfolioBrand.BrandPower.kpis.difference.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.difference.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.difference.title',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  dynamic: {
    key: 'dynamic',
    measure: 'PortfolioBrand.BrandPower.kpis.dynamic.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.dynamic.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.dynamic.title',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  unique: {
    key: 'unique',
    measure: 'PortfolioBrand.BrandPower.kpis.unique.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.unique.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.unique.title',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  salience: {
    key: 'salience',
    measure: 'PortfolioBrand.BrandPower.kpis.salience.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.salience.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.salience.title',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  unaided_awareness: {
    key: 'powerAwareness',
    measure: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    },
    title: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  brand_clarity: {
    key: 'BrandClarity',
    measure: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    },
    title: 'PortfolioBrand.BrandPower.kpis.powerAwareness',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  occasion: {
    key: 'occasion',
    measure: 'PortfolioBrand.BrandPower.kpis.occasion.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.occasion.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.occasion.title',
    kpiGroup: 'power',
  },
  imageries: {
    key: 'imageries',
    measure: 'PortfolioBrand.BrandPower.kpis.imageries.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.imageries.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.imageries.title',
    kpiGroup: 'power',
    applyConfigs: applyCompetitorConfigs,
  },
  bip: {
    key: 'bip',
    measure: 'PortfolioBrand.BrandPower.kpis.bip.measure',
    tooltip: {
      content: 'PortfolioBrand.BrandPower.kpis.bip.tooltip',
    },
    title: 'PortfolioBrand.BrandPower.kpis.bip.title',
    kpiGroup: 'power',
  },
};

export const unaidedAwarenessOptions = [
  {
    key: 'UnaidadeAwareness',
    value: 'unaided-awareness',
    label: 'Unaided Awareness',
    disabled: false,
  },
  {
    key: 'BrandClarity',
    value: 'brand-clarity',
    label: 'Brand Clarity',
    disabled: false,
  },
  {
    key: 'TradeVisibility',
    value: 'trade-visibility',
    label: 'Trade Visibility',
    disabled: true,
  },
  {
    key: 'PackAvailability',
    value: 'pack-availability',
    label: 'Pack Availability',
    disabled: true,
  },
  {
    key: 'PricePerception',
    value: 'price-perception',
    label: 'Price Perception',
    disabled: true,
  },
];
