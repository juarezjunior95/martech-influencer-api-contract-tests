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
import { WaterfallConfig } from 'pages/pillars/ValueCreation/PerformanceTool/config';
import { WATERFALL_COLORS } from 'pages/pillars/ValueCreation/PerformanceTool/constants';

import { UseWaterfallData } from '../../../../types';
import {
  StyledChartContainer,
  StyledWaterfallContainer,
} from './WaterfallSection.styles';

interface WaterfallSectionProps {
  config: WaterfallConfig;
  measure: string;
  data: UseWaterfallData;
  skeletonProps?: React.ComponentProps<typeof Skeleton>;
}

export const WaterfallSection: React.FC<WaterfallSectionProps> = ({
  config,
  measure,
  data,
  skeletonProps = {
    height: '328px',
    width: '100%',
    length: 1,
    borderRadius: 'none',
  },
}) => {
  const chartData = data.waterfallData;

  const normalizeKpiConfig = useCallback(
    (value: string) => value.replaceAll('_', '-'),
    [],
  );

  const rightContent = useMemo(
    () => (
      <SubFilter.Select
        apiKey={`performance-tool-waterfall-options_${normalizeKpiConfig(config.kpiName)}`}
        dataApiKey="performance-tool-waterfall-options"
        params={{}}
        stateKey="waterfall_view_by"
        contextKey={data.contextKey}
        valueLabel="View by:"
        shape="pill"
        size="medium"
        chips
        clearChips={false}
        disabled={data.isViewByDisabled}
        onValueChange={data.handleViewByChange}
      />
    ),
    [
      config.kpiName,
      data.contextKey,
      data.isViewByDisabled,
      data.handleViewByChange,
      normalizeKpiConfig,
    ],
  );

  const disabledIndexes = useMemo(() => {
    return config.getDisabledIndexes(chartData?.labels);
  }, [config, chartData?.labels]);

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
              length={chartData?.labels?.length}
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
        title: data?.title,
        measure: measure,
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
        loading={data.loading}
        error={data.error}
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
                onBarSelect: data.handleBarClick,
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
                gridColumnsLength={chartData?.labels?.length}
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
