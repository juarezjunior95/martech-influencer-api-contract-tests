import { IntlFormatters } from 'react-intl';

import { FilterValue } from 'models/Filters';

import { RA_DEEP_DIVE_SUBFILTER, VIEW_TYPES } from '../constants';

interface GetDeepDiveHeaderMessageParams {
  activeSubFilters: Record<string, FilterValue>;
  isGlobalZone: boolean;
  data: any;
  formatMessage: IntlFormatters['formatMessage'];
  selectedView?: string;
}

type ZoneVariant = 'global' | 'countries';

interface RankingConfig {
  title: Record<ZoneVariant, string>;
  measure: Record<ZoneVariant, string>;
  tooltip?: Record<ZoneVariant, string | undefined>;
}

const RANKING_BASE_PATH =
  'ConnectionsCreativity.ResourceAllocationMedia.Overview.Ranking';
const TITLES = `${RANKING_BASE_PATH}.titles`;
const TOOLTIPS = `${RANKING_BASE_PATH}.tooltips`;

const RANKING_CONFIGS: Record<string, RankingConfig> = {
  media_spend: {
    title: {
      global: `${TITLES}.mediaSpendGlobal`,
      countries: `${TITLES}.mediaSpendCountries`,
    },
    measure: {
      global: `${TITLES}.measureMioUsd`,
      countries: `${TITLES}.measureMioUsd`,
    },
  },
  megabrands: {
    title: {
      global: `${TITLES}.megabrandsGlobal`,
      countries: `${TITLES}.qwoaCountries`,
    },
    measure: {
      global: `${TITLES}.measurePercentage`,
      countries: `${TITLES}.measureHash`,
    },
    tooltip: {
      global: undefined,
      countries: `${TOOLTIPS}.megabrands`,
    },
  },
  qwoa: {
    title: {
      global: `${TITLES}.qwoaGlobal`,
      countries: `${TITLES}.qwoaCountries`,
    },
    measure: {
      global: `${TITLES}.measurePercentage`,
      countries: `${TITLES}.measureHash`,
    },
  },
  campaigns: {
    title: {
      global: `${TITLES}.campaignsGlobal`,
      countries: `${TITLES}.campaignsCountries`,
    },
    measure: {
      global: `${TITLES}.measurePercentage`,
      countries: `${TITLES}.measureHash`,
    },
  },
  resource_allocation: {
    title: {
      global: `${TITLES}.resourceAllocationGlobal`,
      countries: `${TITLES}.resourceAllocationCountries`,
    },
    measure: {
      global: `${TITLES}.measurePercentage`,
      countries: `${TITLES}.measureHash`,
    },
    tooltip: {
      global: `${TOOLTIPS}.resourceAllocationGlobal`,
      countries: `${TOOLTIPS}.resourceAllocationCountries`,
    },
  },
};

const getZoneVariant = (isGlobalZone: boolean): ZoneVariant =>
  isGlobalZone ? 'global' : 'countries';

const formatOptionalMessage = (
  formatMessage: IntlFormatters['formatMessage'],
  id?: string,
  fallback = '',
) => (id ? formatMessage({ id }) : fallback);

export const getDeepDiveHeaderMessage = ({
  activeSubFilters,
  isGlobalZone,
  data,
  formatMessage,
  selectedView,
}: GetDeepDiveHeaderMessageParams) => {
  const rankingKey = activeSubFilters[RA_DEEP_DIVE_SUBFILTER];
  const labelsCount =
    data?.overview_graph?.total_per_year_full?.labels?.length || '';
  const isRankingView = selectedView === VIEW_TYPES.RANKING;

  const zoneVariant = getZoneVariant(isGlobalZone);
  const config = RANKING_CONFIGS[rankingKey];

  const titleKey = config?.title[zoneVariant];
  const measureKey = config?.measure[zoneVariant];
  const connectorKey = `${TITLES}.connector${isGlobalZone ? 'Global' : 'Countries'}`;

  const tooltipKey = isRankingView ? config?.tooltip?.[zoneVariant] : undefined;

  const isResourceAllocation = rankingKey === 'resource_allocation';
  const resourceAllocationTooltipKey = `${TOOLTIPS}.resourceAllocation${isGlobalZone ? 'Global' : 'Countries'}`;

  const labelIconTooltip =
    isRankingView && isResourceAllocation
      ? `${TOOLTIPS}.resourceAllocationLabelIconCountries`
      : undefined;

  const horizontalDashedLineTooltip =
    isRankingView && isResourceAllocation
      ? resourceAllocationTooltipKey
      : undefined;

  const shouldShowGuidelineColumnTooltip =
    selectedView === VIEW_TYPES.BREAKDOWN && isResourceAllocation;

  const guidelineColumnTooltipMessage = shouldShowGuidelineColumnTooltip
    ? formatMessage({ id: resourceAllocationTooltipKey })
    : undefined;

  const context = isGlobalZone
    ? formatMessage(
        { id: `${TITLES}.topCountries` },
        { countriesQuantity: labelsCount },
      )
    : formatMessage({ id: `${TITLES}.countryBrands` });

  return {
    title: formatOptionalMessage(formatMessage, titleKey, '-'),
    connector: formatOptionalMessage(formatMessage, connectorKey),
    context,
    measure: formatOptionalMessage(formatMessage, measureKey, '-'),
    tooltip: formatOptionalMessage(formatMessage, tooltipKey),
    shouldShowGuidelineColumnTooltip,
    guidelineColumnTooltipMessage,
    labelIconTooltip: formatOptionalMessage(formatMessage, labelIconTooltip),
    horizontalDashedLineTooltip: formatOptionalMessage(
      formatMessage,
      horizontalDashedLineTooltip,
    ),
  };
};
