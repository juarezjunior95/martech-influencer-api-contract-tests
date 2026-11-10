import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { ChartHeader } from 'components/ChartHeader';
import {
  StyledChipLabel,
  StyledChipRoot,
} from 'components/ChartHeader/ChartHeader.styles';
import { ChartLegend } from 'components/ChartLegend';

import { StrategicInnovationHealthData } from '../../types';
import { PortfolioHealthBigNumbers } from '../PortfolioHealthBigNumbers';
import {
  StyledBigNumbersContainer,
  StyledHealthContainer,
  StyledLegendContainer,
  StyledStrategicInnovationPortfolioContainer,
} from './StrategicInnovationPortfolio.styles';

interface StrategicInnovationPortfolioProps {
  data?: StrategicInnovationHealthData;
  dataTestId?: string;
}

export const STRATEGIC_INNOVATION_LEGEND_CONFIG = {
  shape: 'rectangle' as const,
  size: 'large' as const,
  decoration: 'none' as const,
  border: true,
  fontWeight: 'medium' as const,
};

const LEGEND_KEYS = ['innovation', 'mature'] as const;
const LEGEND_COLORS = ['#D3E3EE', '#EDDAB1'] as const;

export const StrategicInnovationPortfolio: React.FC<
  StrategicInnovationPortfolioProps
> = ({ data, dataTestId }) => {
  const { formatMessage } = useIntl();

  const legendItems = useMemo(
    () =>
      LEGEND_KEYS.map((key, index) => ({
        label: formatMessage({
          id: `Innovation.Innovation.Overview.StrategicInnovationPillars.Legend.${key}`,
        }),
        color: LEGEND_COLORS[index],
        ...STRATEGIC_INNOVATION_LEGEND_CONFIG,
      })),
    [formatMessage],
  );
  const bigNumbersData = data?.bigNumbers ?? [];

  return (
    <StyledStrategicInnovationPortfolioContainer data-testid={dataTestId}>
      <StyledHealthContainer
        data-testid={dataTestId ? `${dataTestId}-health` : undefined}
      >
        <ChartHeader
          dataTestId={dataTestId ? `${dataTestId}-header` : undefined}
          title={formatMessage({
            id: `Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.title`,
          })}
          info={formatMessage({
            id: `Innovation.Innovation.Overview.StrategicInnovationPillars.portfolio.health.tooltip`,
          })}
          config={{
            inline: 'horizontal',
            type: 'small',
            periodPosition: 'top-right',
          }}
        />

        <StyledChipRoot
          disabled
          data-testid={dataTestId ? `${dataTestId}-period` : undefined}
        >
          <StyledChipLabel
            data-testid={dataTestId ? `${dataTestId}-period-label` : undefined}
          >
            {data?.period}
          </StyledChipLabel>
        </StyledChipRoot>
      </StyledHealthContainer>
      <StyledBigNumbersContainer
        data-testid={
          dataTestId ? `${dataTestId}-big-numbers-container` : undefined
        }
      >
        <PortfolioHealthBigNumbers
          data={bigNumbersData}
          dataTestId={dataTestId ? `${dataTestId}-big-numbers` : undefined}
        />
      </StyledBigNumbersContainer>
      <StyledLegendContainer
        data-testid={dataTestId ? `${dataTestId}-legend-container` : undefined}
      >
        <ChartLegend
          items={legendItems}
          dataTestId={dataTestId ? `${dataTestId}-legend` : undefined}
        />
      </StyledLegendContainer>
    </StyledStrategicInnovationPortfolioContainer>
  );
};
