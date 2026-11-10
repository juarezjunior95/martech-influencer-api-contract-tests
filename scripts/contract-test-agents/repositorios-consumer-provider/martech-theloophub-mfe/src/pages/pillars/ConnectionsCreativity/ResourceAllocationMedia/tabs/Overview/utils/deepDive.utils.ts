import { IntlFormatters } from 'react-intl';

import { FilterValue } from 'models/Filters';

interface KpiConfig {
  title: string;
  measure: string;
}

interface GetDeepDiveHeaderMessageParams {
  activeSubFilters: Record<string, FilterValue>;
  isGlobalZone: boolean;
  formatMessage: IntlFormatters['formatMessage'];
}

interface DeepDiveHeaderMessage {
  title: string;
  measure: string;
}

const KPI_CONFIGS: Record<string, KpiConfig> = {
  media_spend: {
    title:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.mediaSpend',
    measure:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measureMioUsd',
  },
  qwoaByCountry: {
    title:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.qwoaByCountry',
    measure:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measurePercentage',
  },
  qwoaByBrand: {
    title:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.qwoaByBrand',
    measure:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measurePercentage',
  },
  campaigns: {
    title:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.campaigns',
    measure:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measurePercentage',
  },
  nwm: {
    title:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.nwm',
    measure:
      'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measurePercentage',
  },
} as const;

const REGION_LABELS = {
  COUNTRY: 'Label.country',
  BRAND: 'Label.brand',
} as const;

export const getDeepDiveHeaderMessage = ({
  activeSubFilters,
  isGlobalZone,
  formatMessage,
}: GetDeepDiveHeaderMessageParams): DeepDiveHeaderMessage => {
  const subfilter = activeSubFilters.dropdown;
  if (!subfilter) {
    return {
      title: KPI_CONFIGS['media_spend'].title,
      measure: KPI_CONFIGS['media_spend'].measure,
    };
  }
  const kpiConfig = KPI_CONFIGS[subfilter];

  const regionView = isGlobalZone ? REGION_LABELS.COUNTRY : REGION_LABELS.BRAND;

  try {
    const formattedTitle = formatMessage({ id: kpiConfig.title });
    const formattedRegion = formatMessage({ id: regionView });
    const formattedMeasure = formatMessage({ id: kpiConfig.measure });

    return {
      title: `${formattedTitle} ${formattedRegion}`,
      measure: formattedMeasure,
    };
  } catch (error) {
    console.error('Error formatting deep dive header message:', error);

    return {
      title: KPI_CONFIGS['media_spend'].title,
      measure: KPI_CONFIGS['media_spend'].measure,
    };
  }
};
