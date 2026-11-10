import styled from '@emotion/styled';

import type { Chart } from '../../../types';
import { PlotlyChart } from '../../atoms/PlotlyChart';

interface ChartSectionProps {
  charts: Chart[];
}

const Container = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ChartSection = ({ charts }: ChartSectionProps) => (
  <Container data-charts>
    {charts.map((chart) => (
      <PlotlyChart key={chart.chart_id} figureJson={chart.figure_json} />
    ))}
  </Container>
);
