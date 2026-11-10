import { AI_SUMMARY_PAGE_IDENTIFIERS } from 'pages/constants';

export const MAIN_CARDS_CONFIG = [
  {
    titleId: 'Innovation.Home.increaseVolume' as const,
    dataKey: 'innovationVolume' as const,
    kpiId: 'volume' as const,
    aiSummaryIdentifier: AI_SUMMARY_PAGE_IDENTIFIERS.INNOVATION_HOME_PB_VOLUME,
  },
  {
    titleId: 'Innovation.Home.increaseRevenue' as const,
    dataKey: 'innovationNetRevenue' as const,
    kpiId: 'nr' as const,
    aiSummaryIdentifier:
      AI_SUMMARY_PAGE_IDENTIFIERS.INNOVATION_HOME_PB_NETREVENUE,
  },
] as const;

export const PERFORMANCE_KPI_MAIN_CARDS_CONFIG = [
  {
    titleId: 'Innovation.Home.increaseVolume' as const,
    kpiId: 'volume' as const,
  },
  {
    titleId: 'Innovation.Home.increaseRevenue' as const,
    kpiId: 'nr' as const,
  },
  {
    titleId: 'Innovation.Home.performanceKpiMaco' as const,
    kpiId: 'maco' as const,
  },
  {
    titleId: 'Innovation.Home.performanceKpiMacoMargin' as const,
    kpiId: 'macoMargin' as const,
  },
] as const;

export const HOW_WE_DO_IT_CONFIG = [
  {
    titleId: 'Innovation.Home.portfolioHealth.title',
    descriptionId: 'Innovation.Home.portfolioHealth.description',
    dataKey: 'portfolioHealthBigNumber' as const,
  },
  {
    titleId: 'Innovation.Home.packPrice.title',
    descriptionId: 'Innovation.Home.packPrice.description',
    dataKey: 'packPriceBigNumber' as const,
  },
  {
    titleId: 'Innovation.Home.brandRenovation.title',
    descriptionId: 'Innovation.Home.brandRenovation.description',
    dataKey: 'brandRenovationBigNumber' as const,
  },
  {
    titleId: 'Innovation.Home.newInnovations.title',
    descriptionId: 'Innovation.Home.newInnovations.description',
    dataKey: 'newInnovationsBigNumber' as const,
  },
] as const;
