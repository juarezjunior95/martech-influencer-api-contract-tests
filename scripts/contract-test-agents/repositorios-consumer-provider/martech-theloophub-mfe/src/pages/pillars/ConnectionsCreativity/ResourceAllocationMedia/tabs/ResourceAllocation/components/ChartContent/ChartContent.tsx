import { KeyboardEvent, useCallback } from 'react';

import { BorderRadius } from 'chart.js';
import { CaptionWithFlag } from 'components/CaptionWithFlag/CaptionWithFlag';

import { BACKGROUND_COLORS_AC, BACKGROUND_COLORS_BU } from '../../constants';
import { KpiContent, StackedBarData, StackedChart } from '../../types';
import { buildDirectionsArray, createDatasetWithPattern } from '../../utils';
import { StackedBarChart } from '../StackedBarChart';
import {
  CHART_ROW_HEIGHT_PX,
  DEFAULT_MIN_BAR_LENGTH,
} from '../StackedBarChart/constants';
import {
  StyledChartContentContainer,
  StyledChartInner,
  StyledInteractiveWrapper,
} from './ChartContent.styles';

const CHART_ROW_HEIGHT = `${CHART_ROW_HEIGHT_PX}px`;

interface ChartContentProps {
  media: KpiContent;
  sponsorship: KpiContent;
  nwm: KpiContent;
  index: number;
  item: string;
  kpiFilters: string;
  borderRadius: BorderRadius[][];
  hoverable?: boolean;
  isGlobalZone?: boolean;
  pinnedLabel?: string | null;
  onCountryClick?: (country: string) => void;
  dataTestId?: string;
}

export const ChartContent: React.FC<ChartContentProps> = ({
  media,
  sponsorship,
  nwm,
  index,
  item,
  kpiFilters,
  borderRadius,
  hoverable = false,
  isGlobalZone = false,
  pinnedLabel = null,
  onCountryClick,
  dataTestId,
}) => {
  const mediaDataset = media.datasets[index];
  const sponsorshipDataset = sponsorship.datasets[index];
  const nwmDataset = nwm.datasets[index];

  const datasets: StackedBarData[] = [
    createDatasetWithPattern({
      ...nwmDataset,
      directions: nwmDataset?.data
        ? buildDirectionsArray(nwmDataset.data, nwmDataset.formattedData)
        : [],
    }),
    createDatasetWithPattern(sponsorshipDataset),
    createDatasetWithPattern(mediaDataset),
  ];

  const isRowEmpty = (rowIndex: number): boolean =>
    [mediaDataset, sponsorshipDataset, nwmDataset].every(
      (dataset) =>
        (dataset?.data?.[rowIndex] as unknown) === '' ||
        dataset?.data?.[rowIndex] == null,
    );

  const totalAllocationValue = media.total_allocation.value[index] || [];

  const emptyIndices = new Set<number>(
    [0, 1].filter((rowIndex) => isRowEmpty(rowIndex)),
  );

  const labels = [kpiFilters, 'AC'];

  const chartData: StackedChart = {
    labels,
    datasets,
    emptyIndices,
    total_allocation: {
      unit: media.total_allocation.unit,
      value: totalAllocationValue,
    },
  };

  const isClickableCountry =
    isGlobalZone && item !== pinnedLabel && Boolean(onCountryClick);

  const showHover = hoverable;

  const handleClick = useCallback(() => {
    if (isClickableCountry) {
      onCountryClick?.(item);
    }
  }, [isClickableCountry, item, onCountryClick]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!isClickableCountry) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick, isClickableCountry],
  );

  // "-" and "$0.0" are valid BFF responses meaning "row exists but has zero allocation";
  // we render the empty-bar overlay for those cases rather than hiding the entire chart.
  const hasAnyTotal = totalAllocationValue.some(
    (value) => value !== undefined && value !== null && value !== '',
  );

  if (emptyIndices.size === 2 && !hasAnyTotal) {
    return null;
  }

  const captionData = media.caption_country_flag[item];
  if (!captionData) return null;

  const content = (
    <StyledChartContentContainer data-testid={dataTestId}>
      <CaptionWithFlag
        flag={captionData.flag}
        label={captionData.label}
        flagSize={32}
        boldLabel
        dataTestId={dataTestId}
      />
      <StyledChartInner
        style={{ height: CHART_ROW_HEIGHT }}
        data-testid={dataTestId ? `${dataTestId}-chart-wrapper` : undefined}
      >
        <StackedBarChart
          roundTo={100}
          chart={chartData}
          borderRadius={borderRadius}
          minBarLength={DEFAULT_MIN_BAR_LENGTH}
          backgroundColor={[BACKGROUND_COLORS_AC, BACKGROUND_COLORS_BU]}
          dataTestId={dataTestId}
        />
      </StyledChartInner>
    </StyledChartContentContainer>
  );

  if (!showHover && !isClickableCountry) {
    return <div key={item}>{content}</div>;
  }

  return (
    <StyledInteractiveWrapper
      key={item}
      $clickable={isClickableCountry}
      role={isClickableCountry ? 'button' : undefined}
      tabIndex={isClickableCountry ? 0 : undefined}
      onClick={isClickableCountry ? handleClick : undefined}
      onKeyDown={isClickableCountry ? handleKeyDown : undefined}
      data-testid={dataTestId ? `${dataTestId}-interactive-wrapper` : undefined}
    >
      {content}
    </StyledInteractiveWrapper>
  );
};
