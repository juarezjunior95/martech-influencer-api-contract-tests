import { useEffect, useRef, useState } from 'react';

import styled from '@emotion/styled';

interface PlotlyChartProps {
  figureJson: string;
  height?: number;
}

const CHART_COLORS = [
  '#4E79A7',
  '#F28E2B',
  '#59A14F',
  '#E15759',
  '#76B7B2',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
];

const Card = styled.div`
  border: 1px solid var(--ai-chat-color-bd-secondary, rgba(0, 0, 0, 0.16));
  border-radius: 10px;
  background: var(--ai-chat-color-bg-default-subtle, #fafafa);
  overflow: hidden;
`;

const ChartTitle = styled.div`
  padding: 12px 14px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--ai-chat-color-fg-dark, #222222);
  line-height: 1.3;
`;

const ChartArea = styled.div`
  width: 100%;
  min-height: 100px;
  padding: 0 4px 4px;
`;

const ErrorMessage = styled.div`
  padding: 12px;
  font-size: 13px;
  color: var(--ai-chat-color-fg-secondary, #5c5c5c);
  background: var(--ai-chat-color-bg-secondary, #f3f3f3);
  border-radius: 8px;
`;

function extractTitle(layout: Record<string, unknown> | undefined): string {
  if (!layout?.title) return '';
  if (typeof layout.title === 'string') return layout.title;
  const titleObj = layout.title as Record<string, unknown>;
  return (titleObj?.text as string) || '';
}

function buildLayout(
  figureLayout: Record<string, unknown>,
  height: number,
): Record<string, unknown> {
  const clean = { ...figureLayout };
  delete clean.title;

  const xaxis = (clean.xaxis ?? {}) as Record<string, unknown>;
  const yaxis = (clean.yaxis ?? {}) as Record<string, unknown>;
  const legend = (clean.legend ?? {}) as Record<string, unknown>;

  return {
    ...clean,
    height,
    autosize: true,
    margin: { l: 48, r: 12, t: 12, b: 44 },
    font: {
      family:
        'var(--ai-chat-font-family, "Inter", "Helvetica Neue", sans-serif)',
      size: 11,
      color: '#666',
    },
    paper_bgcolor: 'transparent',
    plot_bgcolor: 'transparent',
    colorway: CHART_COLORS,
    legend: {
      ...legend,
      orientation: 'h',
      x: 0,
      y: -0.2,
      xanchor: 'left',
      font: { size: 11, color: '#666' },
    },
    xaxis: {
      ...xaxis,
      gridcolor: '#f0f0f0',
      linecolor: '#e0e0e0',
      tickfont: { size: 11, color: '#888' },
    },
    yaxis: {
      ...yaxis,
      gridcolor: '#f0f0f0',
      linecolor: '#e0e0e0',
      tickfont: { size: 11, color: '#888' },
    },
  };
}

export const PlotlyChart = ({ figureJson, height = 300 }: PlotlyChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    let mounted = true;
    const node = chartRef.current;
    if (!node) return;

    const renderChart = async () => {
      try {
        const Plotly = (await import('plotly.js-dist-min')).default;
        if (!mounted || !chartRef.current) return;

        const figure = JSON.parse(figureJson);
        const figureLayout = (figure.layout as Record<string, unknown>) ?? {};

        const chartTitle = extractTitle(figureLayout);
        if (mounted) setTitle(chartTitle);

        const data = figure.data ?? [];
        const layout = buildLayout(figureLayout, height);
        const config = {
          responsive: true,
          displayModeBar: false,
          staticPlot: false,
        };

        await Plotly.newPlot(chartRef.current, data, layout, config);
      } catch (err) {
        console.error('PlotlyChart: failed to render', err);
        if (mounted) setError(true);
      }
    };

    renderChart();

    return () => {
      mounted = false;
      if (node) {
        import('plotly.js-dist-min')
          .then((mod) => {
            mod.default.purge(node);
          })
          .catch(() => undefined);
      }
    };
  }, [figureJson, height]);

  if (error) {
    return <ErrorMessage>Unable to render chart.</ErrorMessage>;
  }

  return (
    <Card>
      {title && <ChartTitle>{title}</ChartTitle>}
      <ChartArea ref={chartRef} />
    </Card>
  );
};
