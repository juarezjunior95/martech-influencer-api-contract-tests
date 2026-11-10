import { useCallback, useMemo } from 'react';

import {
  BasicContainer,
  BrandAvatarList,
  ComparisonLine,
  DataStateHandler,
  Skeleton,
  SubFilter,
  Waterfall,
} from 'components';
import {
  useCurrentPage,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterManagement,
  useSubFilters,
} from 'hooks';
import { WaterfallConfig } from 'pages/pillars/ValueCreation/PerformanceTool/config';
import { WATERFALL_COLORS } from 'pages/pillars/ValueCreation/PerformanceTool/constants';
import { useWaterfallViewBySync } from 'pages/pillars/ValueCreation/PerformanceTool/hooks/useWaterfallViewBySync';
import { WaterfallSectionData } from 'pages/pillars/ValueCreation/PerformanceTool/types';

import {
  StyledChartContainer,
  StyledWaterfallContainer,
} from './WaterfallSection.styles';

interface WaterfallSectionProps {
  config: WaterfallConfig;
  title: string;
  measure?: string;
  tooltip?: string;
  data?: WaterfallSectionData;
  loading: boolean;
  error?: Error | null;
  variant?: 'large' | 'small';
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
}

export const WaterfallSection: React.FC<WaterfallSectionProps> = ({
  config,
  title,
  measure,
  tooltip,
  loading,
  error,
  data,
  variant = 'large',
  skeletonProps = {
    height: '328px',
    width: '100%',
    length: 1,
    borderRadius: 'none',
  },
}) => {
  const { currentPage } = useCurrentPage();
  const { applied, isGlobalZone } = usePageFilterApplied(currentPage);
  const { dataFilters } = usePageFilterData(currentPage);
  const { updateForm, apply } = usePageFilterManagement(currentPage);
  const { activeSubFilters } = useSubFilters();

  const chartData = data?.[variant];

  const contextKey = useMemo(
    () => config.getContextKey(applied, isGlobalZone),
    [config, applied, isGlobalZone],
  );

  const isViewByDisabled = useMemo(
    () => config.isViewByDisabled(contextKey, activeSubFilters, applied),
    [config, contextKey, activeSubFilters, applied],
  );

  const { handleViewByChange } = useWaterfallViewBySync({
    config,
    contextKey,
  });

  const normalizeKpiConfig = (value: string) => value.replaceAll('_', '-');

  const rightContent = useMemo(
    () => (
      <SubFilter.Select
        apiKey={`performance-tool-waterfall-options_${normalizeKpiConfig(config.kpiName)}`}
        dataApiKey="performance-tool-waterfall-options"
        params={{}}
        stateKey="waterfall_view_by"
        contextKey={contextKey}
        valueLabel="View by:"
        shape="pill"
        size="medium"
        chips
        clearChips={false}
        disabled={isViewByDisabled}
        onValueChange={handleViewByChange}
      />
    ),
    [config.kpiName, contextKey, isViewByDisabled, handleViewByChange],
  );

  const disabledIndexes = useMemo(() => {
    return config.getDisabledIndexes(chartData?.labels);
  }, [config, chartData?.labels]);

  const handleBarClick = useCallback(
    (index: number | null) => {
      if (index === null) {
        return;
      }

      config.handleBarClick({
        index,
        labels: chartData?.labels,
        activeSubFilters,
        dataFilters,
        applied,
        updateForm,
        apply,
      });
    },
    [
      config,
      chartData?.labels,
      activeSubFilters,
      dataFilters,
      applied,
      updateForm,
      apply,
    ],
  );

  const renderLegend = useCallback(() => {
    const brandsData = chartData?.images?.data?.map((brand, index) => {
      const { mainBrand, ...rest } = brand;
      const labelEntry = chartData?.labels?.[index];
      const country = Array.isArray(labelEntry) ? labelEntry[1] : undefined;

      return {
        ...rest,
        index,
        description: country || undefined,
        ...(mainBrand?.src ? { mainBrand } : {}),
      };
    });

    return (
      <>
        {brandsData?.length ? (
          <div style={{ marginTop: 8, marginBottom: 12 }}>
            <BrandAvatarList
              data={brandsData}
              length={chartData.labels?.length}
              borderConfig={{ marginLeft: 16, marginRight: 16 }}
              gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
            />
          </div>
        ) : null}
      </>
    );
  }, [chartData]);

  return (
    <BasicContainer
      header={{
        title,
        measure,
        tooltip,
        titleSize: 'H4',
        rightContent,
      }}
      layout={{
        border: 'small',
        borderRadius: 'large',
        shadow: 'small',
        bodyPadding: false,
        bottomSeparator: 'border',
      }}
      fullWidth
    >
      <DataStateHandler
        loading={loading}
        error={error}
        empty={!chartData}
        skeletonProps={skeletonProps}
      >
        <StyledWaterfallContainer>
          <StyledChartContainer>
            <Waterfall
              values={chartData?.values || []}
              labels={chartData?.labels || []}
              formattedData={chartData?.formattedData}
              showLabels={false}
              options={{
                animation: false,
              }}
              colors={WATERFALL_COLORS}
              interactiveConfig={{
                onBarSelect: handleBarClick,
                clickability: {
                  enabled: true,
                  disabledIndexes,
                },
                renderLegend,
                fillHeight: true,
                showTooltip: true,
              }}
            />
          </StyledChartContainer>
          {chartData?.comparisonLine?.data && (
            <div style={{ marginTop: 12 }}>
              <ComparisonLine
                data={chartData?.comparisonLine?.data}
                gridColumnsLength={chartData.labels?.length}
                borderConfig={{ marginLeft: 16, marginRight: 16 }}
                gridConfig={{ paddingLeft: 0, paddingRight: 0 }}
              />
            </div>
          )}
        </StyledWaterfallContainer>
      </DataStateHandler>
    </BasicContainer>
  );
};
