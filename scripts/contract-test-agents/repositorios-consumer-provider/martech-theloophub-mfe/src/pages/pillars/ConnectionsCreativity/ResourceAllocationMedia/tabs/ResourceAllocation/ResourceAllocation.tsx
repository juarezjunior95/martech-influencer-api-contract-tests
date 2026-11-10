import React, { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { BasicContainer, CountryFlag } from 'components';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import {
  useGoogleAnalytics,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterManagement,
} from 'hooks';
import { PageTitle } from 'pages/components';
import { StyledTooltip } from 'shared/Styles';

import { RESOURCE_ALLOCATION_MEDIA_PAGE_NAME } from '../../ResourceAllocationMedia';
import { ResourcePanel } from './components';
import { radioOptions } from './constants';
import { useComparisonSubFilter } from './hooks/useComparisonSubFilter';
import { useKpiRequests } from './hooks/useKpiRequests';
import { StyledResourceAllocationWrapper } from './ResourceAllocation.styles';

export interface ResourceAllocationProps {
  dataTestId?: string;
}

export const ResourceAllocation: React.FC<ResourceAllocationProps> = ({
  dataTestId,
}) => {
  useDataRefreshForTab('Resource Allocation - Resource Allocation');
  const { formatMessage } = useIntl();
  const trackGA = useGoogleAnalytics();
  const { isGlobalZone } = usePageFilterApplied(
    RESOURCE_ALLOCATION_MEDIA_PAGE_NAME,
  );
  const { updateForm, apply } = usePageFilterManagement(
    RESOURCE_ALLOCATION_MEDIA_PAGE_NAME,
  );
  const { dataFilters } = usePageFilterData(
    RESOURCE_ALLOCATION_MEDIA_PAGE_NAME,
  );

  const [kpiFilter, setKpiFilter] = useState(
    radioOptions.kpiFilter.default.value,
  );

  const { data: resourceAllocationData, loading } = useKpiRequests({
    kpiFilter,
    isGlobalZone,
  });

  const {
    options: comparisonOptions,
    selectedValues: comparisonValues,
    handleChange: handleComparisonChange,
    isInitialized: comparisonInitialized,
    isUserSelection: comparisonIsUserSelection,
    allValues: comparisonAllValues,
  } = useComparisonSubFilter({
    filterData: resourceAllocationData?.filter,
  });

  const pinnedLabel = useMemo(() => {
    const filterValues = new Set(
      (resourceAllocationData?.filter ?? []).map((item) => item.value),
    );
    const labels = resourceAllocationData?.media?.media?.labels ?? [];
    return labels.find((label) => !filterValues.has(label)) ?? null;
  }, [resourceAllocationData]);

  const selectedComparisons = useMemo(() => {
    if (!comparisonInitialized || !comparisonIsUserSelection) return null;
    if (comparisonValues.length === comparisonAllValues.length) return null;
    if (pinnedLabel) {
      const withoutPinned = comparisonValues.filter((v) => v !== pinnedLabel);
      return [pinnedLabel, ...withoutPinned];
    }
    return comparisonValues;
  }, [
    comparisonInitialized,
    comparisonIsUserSelection,
    comparisonValues,
    comparisonAllValues,
    pinnedLabel,
  ]);

  const handleGAEvent = (label: string) => {
    if (!label) return;

    try {
      trackGA({
        event_category: 'Content',
        event_action: 'Content',
        event_label: label,
      });
    } catch (error) {
      console.error('Failed to track Google Analytics event:', error);
    }
  };

  const handleKpiFilterChange = (value: string) => {
    setKpiFilter(value);
    handleGAEvent(value);
  };

  const handleCountryClick = useCallback(
    (country: string) => {
      const zone = FilterDataAccessor.getInstance().getZoneByCountry(
        dataFilters,
        country,
      );
      if (zone?.value) {
        updateForm('zone', zone.value);
      }
      updateForm('country', country);
      apply();
    },
    [apply, dataFilters, updateForm],
  );

  return (
    <StyledResourceAllocationWrapper>
      <PageTitle
        title={formatMessage({
          id: 'ConnectionsCreativity.ResourceAllocationMedia.ResourceAllocationTab.title',
        })}
        description={formatMessage({
          id: 'ConnectionsCreativity.ResourceAllocationMedia.ResourceAllocationTab.sectionDescription',
        })}
        tooltip={
          <StyledTooltip
            size="basis"
            data-testid={dataTestId ? `${dataTestId}-tooltip` : undefined}
          >
            {formatMessage({
              id: 'ConnectionsCreativity.ResourceAllocationMedia.ResourceAllocationTab.tooltip',
            })}
          </StyledTooltip>
        }
        rightContent={<CountryFlag dataTestId={dataTestId} />}
        dataTestId="page-title"
      />

      <BasicContainer
        dataTestId={dataTestId}
        layout={{
          border: 'small',
          bodyPadding: true,
          background: '#F9F9F9',
        }}
      >
        <ResourcePanel
          kpiFilters={kpiFilter}
          content={resourceAllocationData}
          formatMessage={formatMessage}
          loading={loading}
          kpiFilter={kpiFilter}
          handleKpiFilterChange={handleKpiFilterChange}
          comparisonFilter={{
            options: comparisonOptions,
            value: comparisonValues,
            onChange: handleComparisonChange,
          }}
          selectedComparisons={selectedComparisons}
          hoverable
          isGlobalZone={isGlobalZone}
          pinnedLabel={pinnedLabel}
          onCountryClick={handleCountryClick}
          dataTestId={dataTestId}
        />
      </BasicContainer>
    </StyledResourceAllocationWrapper>
  );
};
