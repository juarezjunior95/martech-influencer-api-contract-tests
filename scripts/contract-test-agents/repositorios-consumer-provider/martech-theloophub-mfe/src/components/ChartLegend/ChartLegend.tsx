import React from 'react';

import StripedBackground from 'assets/stripedBackground.svg';

import {
  StyledChartLegendContainer,
  StyledChartLegendItem,
  StyledChartLegendLabel,
  StyledChartLegendLayer,
  StyledChartLegendShape,
} from './ChartLegend.styles';

export type ChartLegendShape =
  'rectangle' | 'circle' | 'square' | 'thinPill' | 'pill';

type ChartLegendItemBase = {
  label: string | React.ReactNode;
  shape: ChartLegendShape;
  color: string;
  size: 'small' | 'medium' | 'large';
  strike?: boolean;
  border?: boolean;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  onClick?: () => void;
};

type ChartLegendItemWithLayer = ChartLegendItemBase & {
  decoration: 'layer';
  layerColor: string;
};

type ChartLegendItemWithoutLayer = ChartLegendItemBase & {
  decoration: 'none' | 'dash';
  layerColor?: never;
};

// União dos tipos
export type ChartLegendItem =
  ChartLegendItemWithLayer | ChartLegendItemWithoutLayer;

interface ChartLegendProps {
  orientation?: 'vertical' | 'horizontal';
  items: ChartLegendItem[];
  dataTestId?: string;
}

export const ChartLegend = ({
  items,
  orientation = 'horizontal',
  dataTestId,
}: ChartLegendProps) => {
  return (
    <StyledChartLegendContainer
      orientation={orientation}
      data-testid={dataTestId}
    >
      {items.map((item, index) => (
        <StyledChartLegendItem
          key={String(item.label) + index}
          className="legend-item"
          onClick={item?.onClick}
          clickeable={!!item?.onClick}
          data-testid={dataTestId ? `${dataTestId}-item-${index}` : undefined}
        >
          <StyledChartLegendShape
            type={item.shape}
            className={item.size}
            style={{
              background: item.color,
              backgroundImage:
                item.decoration === 'dash' && `url(${StripedBackground})`,
              border:
                (item.decoration === 'layer' || item.border) &&
                '1px solid #14141424',
            }}
            data-testid={
              dataTestId ? `${dataTestId}-item-${index}-shape` : undefined
            }
          >
            {item.decoration === 'layer' && (
              <StyledChartLegendLayer
                className={item.size}
                style={{
                  background: item.layerColor,
                }}
              />
            )}
          </StyledChartLegendShape>
          <StyledChartLegendLabel
            size={item.size}
            strike={item.strike}
            fontWeight={item.fontWeight}
            data-testid={
              dataTestId ? `${dataTestId}-item-${index}-label` : undefined
            }
          >
            {item.label}
          </StyledChartLegendLabel>
        </StyledChartLegendItem>
      ))}
    </StyledChartLegendContainer>
  );
};
