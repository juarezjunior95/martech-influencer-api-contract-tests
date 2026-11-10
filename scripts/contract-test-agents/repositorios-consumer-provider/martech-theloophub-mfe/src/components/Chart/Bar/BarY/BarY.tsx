import React, { useCallback, useRef } from 'react';

import { VariationDataProps } from 'pages/components/ChartWithCaption/types';

import {
  BarContainer,
  BarLabel,
  BarWrapper,
  StyledBarYContainer,
} from './BarY.styles';
import { getBackgroundColor, valueFits } from './utils';

interface Props {
  chartData: {
    data: number[];
    label: string[];
    backgroundColor: string | string[];
    barThickness?: number;
    unitMeasure?: string;
    variationData?: VariationDataProps[];
  };
  scale?: number;
  dataTestId?: string;
  formatValueFn?: (value: number) => string;
}

const DEFAULT_BAR_THICKNESS = 40;

export const BarY: React.FC<Props> = ({
  chartData,
  scale = 100,
  dataTestId,
  formatValueFn,
}) => {
  const {
    backgroundColor,
    unitMeasure,
    barThickness,
    data: chartDataValues = [],
  } = chartData;

  const containerRef = useRef<HTMLDivElement>(null);

  const getBarWidth = useCallback(
    (value: number): number => {
      const percentageWidth = (value / scale) * 100;

      return percentageWidth;
    },
    [scale],
  );

  return (
    <StyledBarYContainer ref={containerRef} data-testid={dataTestId}>
      {chartDataValues.map((value, index) => {
        const barWidth = getBarWidth(value);
        const formattedValue = formatValueFn ? formatValueFn(value) : value;
        const labelText = `${formattedValue}${unitMeasure ?? ''}`;
        const fits = valueFits(barWidth, value, unitMeasure);
        const bgColor = getBackgroundColor(index, backgroundColor);

        return (
          <BarWrapper
            key={`bar-${value}-${index}`}
            data-testid={dataTestId ? `${dataTestId}-bar-${index}` : undefined}
          >
            <BarContainer
              style={{
                width: `${barWidth}%`,
                height: `${barThickness || DEFAULT_BAR_THICKNESS}px`,
                backgroundColor: bgColor,
              }}
            >
              {fits && <BarLabel position="inside">{labelText}</BarLabel>}
            </BarContainer>
            {!fits && <BarLabel position="outside">{labelText}</BarLabel>}
          </BarWrapper>
        );
      })}
    </StyledBarYContainer>
  );
};
