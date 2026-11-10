import type { Chart } from '../types';

interface LegacyChartData {
  columns: string[];
  data: unknown[][];
}

interface LegacyChartResults {
  chart_type: string;
  chart_title: string;
  x_axis_cols: string[];
  y_axis_cols: string[];
  y2_axis_cols?: string[];
  y_axis_name?: string;
  y2_axis_name?: string;
  chart_alternatives?: string[];
  chart_data: LegacyChartData;
}

interface AnalysisResultEntry {
  source?: string;
  chart_results?: {
    chart_results?: LegacyChartResults;
  } | null;
}

interface ToolHistoryEntry {
  tool?: string;
  outcome?: {
    result?: AnalysisResultEntry[];
  } | null;
}

function toPlotlyType(chartType: string): string {
  switch (chartType) {
    case 'line':
      return 'scatter';
    case 'vbar':
    case 'hbar':
      return 'bar';
    default:
      return 'bar';
  }
}

function buildPlotlyFigure(legacy: LegacyChartResults): object {
  const { chart_type, chart_title, x_axis_cols, y_axis_cols, chart_data } =
    legacy;

  const colIndex = (name: string) => chart_data.columns.indexOf(name);
  const xCol = x_axis_cols[0];
  const xIdx = colIndex(xCol);

  if (xIdx === -1) return { data: [], layout: {} };

  const xData = chart_data.data.map((row) => row[xIdx]);
  const isHorizontal = chart_type === 'hbar';
  const plotlyType = toPlotlyType(chart_type);

  const traces = y_axis_cols.map((yCol) => {
    const yIdx = colIndex(yCol);
    const yData = yIdx >= 0 ? chart_data.data.map((row) => row[yIdx]) : [];

    const trace: Record<string, unknown> = {
      type: plotlyType,
      name: yCol,
    };

    if (isHorizontal) {
      trace.x = yData;
      trace.y = xData;
      trace.orientation = 'h';
    } else {
      trace.x = xData;
      trace.y = yData;
    }

    if (chart_type === 'line') {
      trace.mode = 'lines+markers';
    }

    return trace;
  });

  const layout: Record<string, unknown> = {
    title: { text: chart_title },
    xaxis: {
      title: {
        text: isHorizontal ? legacy.y_axis_name || '' : xCol,
      },
    },
    yaxis: {
      title: {
        text: isHorizontal ? xCol : legacy.y_axis_name || '',
      },
    },
  };

  return { data: traces, layout };
}

export function extractLegacyCharts(toolExecutionHistory: unknown): Chart[] {
  if (!Array.isArray(toolExecutionHistory)) return [];

  const charts: Chart[] = [];

  for (const entry of toolExecutionHistory as ToolHistoryEntry[]) {
    if (entry.tool !== 'analysis_tool') continue;

    const results = entry.outcome?.result;
    if (!Array.isArray(results)) continue;

    for (const section of results) {
      const legacy = section.chart_results?.chart_results;
      if (!legacy?.chart_data?.data?.length) continue;

      const figure = buildPlotlyFigure(legacy);

      charts.push({
        chart_id: `legacy-${charts.length}-${Date.now()}`,
        title: legacy.chart_title,
        figure_json: JSON.stringify(figure),
        timestamp: String(Date.now()),
      });
    }
  }

  return charts;
}
