import React from 'react';

import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip } from 'components/CustomTooltip';

import {
  StyledComparisonLine,
  StyledComparisonLineBadge,
  StyledComparisonLineContainer,
  StyledComparisonLineTitle,
  StyledComparisonLineTitleContainer,
  StyledComparisonLineValue,
  StyledTooltipInfoIcon,
} from './ComparisonLine.styles';

export interface ComparisonValue {
  value: string | number;
  measure?: string;
  color?: string;
  trend?: 'positive' | 'negative';
  variant?: 'text' | 'badge';
  badgeColor?: 'positive' | 'neutral' | 'negative';
}

export interface ComparisonLineData {
  title: string;
  data: ComparisonValue[];
  tooltip?: {
    title: string;
    text: string;
  };
}

interface ComparisonLineProps {
  data: ComparisonLineData[];
  gridColumnsLength: number;
  gridConfig?: {
    paddingLeft?: number;
    paddingRight?: number;
  };
  borderConfig?: {
    marginLeft?: number;
    marginRight?: number;
  };
  innerBorderConfig?: {
    marginLeft?: number;
    marginRight?: number;
  };
  rowConfig?: {
    height?: number;
    alignItems?: 'center' | 'flex-start' | 'flex-end';
  };
  gap?: number;
  size?: 'default' | 'small' | 'medium' | 'large';
  trendColors?: { positive: string; negative: string; neutral: string };
  dataTestId?: string;
}

const defaultColorsByTrend = {
  positive: '#007800',
  negative: '#B91C1C',
  neutral: '#67665F',
};

const getValueColor = (
  value: ComparisonValue,
  colors: typeof defaultColorsByTrend,
): string | undefined => {
  if (value.trend) return colors[value.trend];
  if (value.color === defaultColorsByTrend.positive) return colors.positive;
  if (value.color === defaultColorsByTrend.negative) return colors.negative;
  if (value.color === defaultColorsByTrend.neutral) return colors.neutral;
  return value.color;
};

export const ComparisonLine: React.FC<ComparisonLineProps> = ({
  data,
  gridColumnsLength,
  gridConfig,
  borderConfig,
  innerBorderConfig,
  size = 'default',
  gap,
  rowConfig,
  trendColors = defaultColorsByTrend,
  dataTestId,
}) => {
  const defaultGridConfig = {
    paddingLeft: 8,
    paddingRight: 8,
  };
  const defaultBorderConfig = {
    marginLeft: 0,
    marginRight: 0,
  };
  const defaultInnerBorderConfig = {
    marginLeft: 0,
    marginRight: 0,
  };
  const defaultRowConfig = {};

  const appliedGridConfig = { ...defaultGridConfig, ...gridConfig };
  const appliedBorderConfig = { ...defaultBorderConfig, ...borderConfig };
  const appliedInnerBorderConfig = {
    ...defaultInnerBorderConfig,
    ...innerBorderConfig,
  };
  const appliedRowConfig = { ...defaultRowConfig, ...rowConfig };

  const renderTitle = (title?: string) => {
    if (!title) {
      return <span style={{ fontSize: 10 }}>-</span>;
    }

    const [first, ...rest] = title.split(' ');
    const second = rest.join(' ');

    return (
      <>
        <span style={{ fontSize: 10 }}>{first}</span>
        {second && (
          <>
            {' '}
            <span style={{ fontSize: 12, marginLeft: 4 }}>{second}</span>
          </>
        )}
      </>
    );
  };

  return (
    <StyledComparisonLineContainer
      striped={data.length > 3}
      data-testid={dataTestId}
    >
      {data.map((line, index) => (
        <StyledComparisonLine
          key={`${line.title}-${index}`}
          style={{
            ...appliedGridConfig,
            ...appliedBorderConfig,
            ...appliedRowConfig,
          }}
          data-testid={dataTestId ? `${dataTestId}-row-${index}` : undefined}
        >
          <StyledComparisonLineTitleContainer
            data-testid={
              dataTestId
                ? `${dataTestId}-row-${index}-title-container`
                : undefined
            }
          >
            <StyledComparisonLineTitle
              data-testid={
                dataTestId ? `${dataTestId}-row-${index}-title` : undefined
              }
            >
              {renderTitle(line.title)}
              {line.tooltip && (
                <CustomTooltip
                  title={line.tooltip.title}
                  text={line.tooltip.text}
                >
                  <StyledTooltipInfoIcon>
                    <Icon icon={Info} size="small" />
                  </StyledTooltipInfoIcon>
                </CustomTooltip>
              )}
            </StyledComparisonLineTitle>
          </StyledComparisonLineTitleContainer>
          <div
            style={{
              width: '100%',
              display: 'grid',
              gridTemplateColumns: `repeat(${gridColumnsLength}, 1fr)`,
              gap: (() => {
                if (gap) {
                  return `${gap}px`;
                }
                return size === 'small' ? '16px' : '8px';
              })(),
              flexDirection: 'row',
              textAlign: 'center',
              ...appliedInnerBorderConfig,
            }}
            data-testid={
              dataTestId ? `${dataTestId}-row-${index}-values` : undefined
            }
          >
            {line?.data?.map((value, i) =>
              value.variant === 'badge' ? (
                <StyledComparisonLineBadge
                  key={`${line.title}-${value.value}-${i}`}
                  badgeColor={value.badgeColor || 'neutral'}
                  data-testid={
                    dataTestId
                      ? `${dataTestId}-row-${index}-value-${i}`
                      : undefined
                  }
                >
                  {value.value}
                  {value.measure}
                </StyledComparisonLineBadge>
              ) : (
                <StyledComparisonLineValue
                  size={size}
                  key={`${line.title}-${value.value}-${i}`}
                  style={{
                    color: getValueColor(value, trendColors),
                  }}
                  data-testid={
                    dataTestId
                      ? `${dataTestId}-row-${index}-value-${i}`
                      : undefined
                  }
                >
                  {value.value}
                  {value.measure}
                </StyledComparisonLineValue>
              ),
            )}
          </div>
        </StyledComparisonLine>
      ))}
    </StyledComparisonLineContainer>
  );
};
