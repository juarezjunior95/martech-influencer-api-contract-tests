import { useMemo } from 'react';

import TrendingDown from 'assets/icons/TrendingDown.svg';
import TrendingUp from 'assets/icons/TrendingUp.svg';
import { ChartLegend } from 'components';
import { DEFAULT_CHART_COLORS } from 'pages/constants';
import { LegendItem } from 'pages/pillars/ValueCreation/VolumePages/types';
import {
  StyledSectionHeaderContainer,
  StyledTag,
  StyledTagLabel,
} from 'pages/pillars/ValueCreation/VolumePages/VolumePages.styles';
import { sanitizeDataTestId } from 'utils/sanitizeDataTestId';

export interface SectionHeaderProps {
  period?: string;
  legends?: LegendItem[];
  dataTestId?: string;
  legendColorConfig?: Record<string, string>;
  legendShape?: 'rectangle' | 'circle' | 'square' | 'thinPill' | 'pill';
  legendSize?: 'small' | 'medium' | 'large';
}

const icons = {
  TrendingUp,
  TrendingDown,
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  period,
  legends,
  dataTestId,
  legendColorConfig,
  legendShape,
  legendSize,
}) => {
  const legendsWithColorOverrides = useMemo(() => {
    return legends?.map((legend) => ({
      ...legend,
      color: legendColorConfig?.[legend.label] || legend.color,
    }));
  }, [legends, legendColorConfig]);

  return (
    <StyledSectionHeaderContainer
      style={{ alignItems: 'center' }}
      data-testid={dataTestId ? `section-header-${dataTestId}` : undefined}
      noPadding={true}
    >
      {period ? (
        <StyledTag
          data-testid={
            dataTestId ? `section-header-${dataTestId}-period` : undefined
          }
        >
          {period}
        </StyledTag>
      ) : null}
      {legends && (
        <div style={{ marginLeft: 'auto' }}>
          <ChartLegend
            dataTestId={
              dataTestId ? `section-header-${dataTestId}-legend` : undefined
            }
            items={legendsWithColorOverrides.map((legend) => {
              return {
                label: (
                  <StyledTagLabel
                    data-testid={
                      dataTestId
                        ? `section-header-${dataTestId}-legend-label`
                        : undefined
                    }
                  >
                    {legend.label}{' '}
                    {icons?.[legend.icon] && (
                      <img
                        src={icons[legend.icon]}
                        alt={legend.icon}
                        data-testid={
                          dataTestId
                            ? `section-header-${dataTestId}-legend-icon-${sanitizeDataTestId(legend.icon)}`
                            : undefined
                        }
                      />
                    )}
                  </StyledTagLabel>
                ),
                shape: legendShape || legend.shape || 'square',
                color: legend.color || DEFAULT_CHART_COLORS[legend.icon],
                size: legendSize || 'large',
                decoration: 'none',
              };
            })}
          />
        </div>
      )}
    </StyledSectionHeaderContainer>
  );
};
