import { IntlFormatters } from 'react-intl';

import { Legend } from 'components';
import { MediaKpisCards } from 'pages/components/ConnectionsCreativity';

import {
  StyledChartsContainer,
  StyledLegendContainer,
} from '../../../Overview/Overview.styles';
import { ResourceAllocationOverview } from '../../types';
import { getChartLegends } from '../../utils';
import { getChartLegend } from '../../utils/ChartsView.utils';

interface ChartsViewProps {
  data: ResourceAllocationOverview;
  formatMessage: IntlFormatters['formatMessage'];
  dataTestId?: string;
}

export const ChartsView = ({
  data,
  formatMessage,
  dataTestId,
}: ChartsViewProps) => {
  const legends = getChartLegends(data);
  return (
    <>
      <StyledChartsContainer
        data-testid={dataTestId ? `${dataTestId}-container` : undefined}
      >
        <MediaKpisCards
          dataTestId={dataTestId ? `${dataTestId}-kpis` : undefined}
          data={data}
          formatMessage={formatMessage}
        />
      </StyledChartsContainer>
      <StyledLegendContainer
        data-testid={dataTestId ? `${dataTestId}-legend-container` : undefined}
      >
        <Legend
          dataTestId={dataTestId ? `${dataTestId}-legend` : undefined}
          legendPosition="left"
          caption={
            legends.map((legend) => ({
              ...getChartLegend(legend),
            })) as { label: string; color: string }[]
          }
        />
      </StyledLegendContainer>
    </>
  );
};
