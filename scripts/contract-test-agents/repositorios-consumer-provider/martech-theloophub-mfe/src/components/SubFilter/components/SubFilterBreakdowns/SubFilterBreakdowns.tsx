import { useMemo } from 'react';

import { BarChart2, Beer, BeerBottles, World } from '@hexa-ui/icons2';
import { SubFilter } from 'components';
import { useSubFilters } from 'hooks';
import { FilterValue } from 'models/Filters';

import {
  SubFilterBreakdownsBox,
  SubFilterBreakdownsSelects,
} from './SubFilterBreakdowns.styles';

export const BREAKDOWN_GROUPS_SUBFILTER = 'breakdown-select-groups';
export const PP_BREAKDOWN_SUBFILTER = 'pp-breakdown';
export const YTD_MONTH_SUBFILTER = 'ytd-month';
export const BREAKDOWN_REGIONS_SUBFILTER = 'breakdown-regions';
export const BREAKDOWN_CATEGORIES_SUBFILTER = 'breakdown-categories';
export const BREAKDOWN_BRANDS_SUBFILTER = 'breakdown-brands';

export const getFilterKey = (breakdownType: FilterValue): string => {
  switch (breakdownType) {
    case 'region':
      return BREAKDOWN_REGIONS_SUBFILTER;
    case 'category':
      return BREAKDOWN_CATEGORIES_SUBFILTER;
    case 'brands':
      return BREAKDOWN_BRANDS_SUBFILTER;
    default:
      return breakdownType as string;
  }
};

const getParamsApi = (breakdownType: FilterValue): Record<string, any> => {
  const filterKey = getFilterKey(breakdownType);
  return breakdownType === 'brands'
    ? { [filterKey + '[include_all]']: true }
    : {};
};

const iconsByValue = {
  region: World,
  category: BeerBottles,
  brands: Beer,
};

interface SubFilterBreakdownsProps {
  dataTestId?: string;
}

export const SubFilterBreakdowns = ({
  dataTestId,
}: SubFilterBreakdownsProps) => {
  const { activeSubFilters = {} } = useSubFilters();

  const paramsApi = useMemo(() => {
    const breakdownType = activeSubFilters[BREAKDOWN_GROUPS_SUBFILTER];
    return getParamsApi(breakdownType);
  }, [activeSubFilters, activeSubFilters[BREAKDOWN_GROUPS_SUBFILTER]]);

  const iconForBreakdownGroups = useMemo(() => {
    return iconsByValue[activeSubFilters[BREAKDOWN_GROUPS_SUBFILTER]];
  }, [activeSubFilters[BREAKDOWN_GROUPS_SUBFILTER]]);

  const secondDropdownFilter = useMemo(() => {
    const breakdownType = activeSubFilters[BREAKDOWN_GROUPS_SUBFILTER];
    return getFilterKey(breakdownType);
  }, [activeSubFilters, activeSubFilters[BREAKDOWN_GROUPS_SUBFILTER]]);

  return (
    <SubFilterBreakdownsBox data-testid={dataTestId}>
      <SubFilterBreakdownsSelects
        data-testid={dataTestId ? `${dataTestId}-group-selects` : undefined}
      >
        <SubFilter.Select
          name="groupBy"
          apiKey={BREAKDOWN_GROUPS_SUBFILTER}
          stateKey={BREAKDOWN_GROUPS_SUBFILTER}
          icon={iconForBreakdownGroups}
          iconsByValue={iconsByValue}
          dataTestId={dataTestId ? `${dataTestId}-group-by` : undefined}
        />
        {!!activeSubFilters[BREAKDOWN_GROUPS_SUBFILTER] && (
          <SubFilter.Select
            name="subBreakdown"
            apiKey={secondDropdownFilter}
            stateKey={secondDropdownFilter}
            params={paramsApi}
            dataTestId={dataTestId ? `${dataTestId}-sub-breakdown` : undefined}
            menuFitContent
          />
        )}
      </SubFilterBreakdownsSelects>
      <SubFilterBreakdownsSelects
        data-testid={
          dataTestId ? `${dataTestId}-performance-selects` : undefined
        }
      >
        <SubFilter.Select
          name="performanceBreakdown"
          apiKey={PP_BREAKDOWN_SUBFILTER}
          stateKey={PP_BREAKDOWN_SUBFILTER}
          icon={BarChart2}
          dataTestId={dataTestId ? `${dataTestId}-performance` : undefined}
        />
      </SubFilterBreakdownsSelects>
    </SubFilterBreakdownsBox>
  );
};
