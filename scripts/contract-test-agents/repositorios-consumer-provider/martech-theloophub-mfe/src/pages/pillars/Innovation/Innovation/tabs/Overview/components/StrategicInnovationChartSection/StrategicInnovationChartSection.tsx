import { useMemo } from 'react';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, NoDataYet } from 'components';
import { ConnectorPlugin } from 'components/Chart/plugins/ConnectorPlugin';
import { BaseChartDatasets } from 'components/Chart/types';
import { ComparisonLine } from 'components/ComparisonLine/ComparisonLine';

import { StrategicInnovationChartSectionData } from '../../types';
import { BigNumbers } from '../BigNumbers/BigNumbers';
import {
  StyledStrategicInnovationBarContainer,
  StyledStrategicInnovationBigNumberContainer,
  StyledStrategicInnovationChartContent,
  StyledStrategicInnovationChartSection,
  StyledStrategicInnovationComparisonLineContainer,
} from './StrategicInnovationChartSection.styles';
import {
  getBorderConfig,
  getChartOptions,
  getDatalabelsConfig,
} from './utils/utils';

interface StrategicInnovationChartSectionProps {
  data: StrategicInnovationChartSectionData;
  id: string;
  dataTestId?: string;
}

export const StrategicInnovationChartSection = ({
  data,
  id,
  dataTestId,
}: StrategicInnovationChartSectionProps) => {
  const isPortfolio = id === 'portfolio';
  const { chart, bigNumber } = data;

  const bigNumbersData = useMemo(() => [bigNumber], [bigNumber]);

  const formattedDatasets = useMemo(
    (): BaseChartDatasets<'bar'> | undefined =>
      chart?.datasets?.map((dataset, index) => ({
        ...dataset,
        ...getBorderConfig(isPortfolio, index),
        datalabels: getDatalabelsConfig(isPortfolio, index, chart?.datasetsSum),
      })) as BaseChartDatasets<'bar'>,
    [chart?.datasets, isPortfolio, chart?.datasetsSum],
  );

  const chartOptions = useMemo(
    () => getChartOptions(chart?.connector),
    [chart?.connector],
  );

  const chartPlugins = useMemo(() => [ChartDataLabels, ConnectorPlugin], []);

  const comparisonLineData = useMemo(
    () => (chart?.comparisonLine ? [chart?.comparisonLine] : null),
    [chart?.comparisonLine],
  );

  const chartContent = () => {
    if (!chart?.datasets || chart.datasets.length === 0) {
      return (
        <NoDataYet
          data-testid={dataTestId ? `empty-state-${dataTestId}` : undefined}
        />
      );
    }
    return (
      <>
        <StyledStrategicInnovationBarContainer
          data-testid={dataTestId ? `${dataTestId}-bar-container` : undefined}
        >
          <Bar
            data-testid={dataTestId ? `chart-${dataTestId}` : undefined}
            labels={chart?.labels}
            datasets={formattedDatasets}
            plugins={chartPlugins}
            options={chartOptions}
            size="medium"
            indexAxis="x"
            fractionDigits={{ yAxis: 1 }}
            connector={chart?.connector}
          />
        </StyledStrategicInnovationBarContainer>
        <StyledStrategicInnovationComparisonLineContainer
          data-testid={
            dataTestId ? `${dataTestId}-comparison-line-container` : undefined
          }
        >
          {comparisonLineData && (
            <ComparisonLine
              data-testid={
                dataTestId ? `${dataTestId}-comparison-line` : undefined
              }
              data={comparisonLineData}
              gridColumnsLength={comparisonLineData[0].data.length}
              gridConfig={{ paddingLeft: 4, paddingRight: 4 }}
              borderConfig={{ marginLeft: 10, marginRight: 10 }}
              innerBorderConfig={{ marginLeft: 30, marginRight: 0 }}
            />
          )}
        </StyledStrategicInnovationComparisonLineContainer>
      </>
    );
  };

  return (
    <StyledStrategicInnovationChartSection
      data-testid={dataTestId ? `chart-section-${dataTestId}` : undefined}
    >
      <StyledStrategicInnovationBigNumberContainer
        data-testid={
          dataTestId ? `${dataTestId}-big-number-container` : undefined
        }
      >
        <BigNumbers
          data={bigNumbersData}
          asCard={false}
          dataTestId={dataTestId ? `${dataTestId}-big-numbers` : undefined}
          periodPosition="top-right"
        />
      </StyledStrategicInnovationBigNumberContainer>
      <StyledStrategicInnovationChartContent
        data-testid={dataTestId ? `${dataTestId}-chart-content` : undefined}
      >
        {chartContent()}
      </StyledStrategicInnovationChartContent>
    </StyledStrategicInnovationChartSection>
  );
};
