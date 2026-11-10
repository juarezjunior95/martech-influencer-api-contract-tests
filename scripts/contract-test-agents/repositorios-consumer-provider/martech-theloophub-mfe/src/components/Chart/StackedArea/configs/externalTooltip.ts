import { Chart, TooltipModel } from 'chart.js';

const TOOLTIP_ID = 'stacked-area-tooltip';

const TOOLTIP_STYLE = {
  BACKGROUND: 'rgba(20, 20, 20, 1)',
  TEXT_COLOR: '#fff',
  BORDER_RADIUS: '4px',
  PADDING: '8px 12px',
  FONT_SIZE: '12px',
  FONT_FAMILY: "'Work Sans', sans-serif",
  TRANSITION: 'opacity 0.15s ease',
} as const;

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

function escapeHtml(str: string): string {
  return str.replaceAll(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

function toCssColor(value: unknown): string {
  return typeof value === 'string' ? value : 'transparent';
}

interface ExternalTooltipContext {
  chart: Chart;
  tooltip: TooltipModel<'bar'>;
}

function getOrCreateTooltipElement(): HTMLDivElement {
  let el = document.getElementById(TOOLTIP_ID) as HTMLDivElement | null;

  if (!el) {
    el = document.createElement('div');
    el.id = TOOLTIP_ID;
    Object.assign(el.style, {
      position: 'absolute',
      background: TOOLTIP_STYLE.BACKGROUND,
      color: TOOLTIP_STYLE.TEXT_COLOR,
      borderRadius: TOOLTIP_STYLE.BORDER_RADIUS,
      padding: TOOLTIP_STYLE.PADDING,
      fontSize: TOOLTIP_STYLE.FONT_SIZE,
      fontFamily: TOOLTIP_STYLE.FONT_FAMILY,
      pointerEvents: 'none',
      zIndex: '9999',
      transition: TOOLTIP_STYLE.TRANSITION,
    });
    document.body.appendChild(el);
  }

  return el;
}

interface DatasetInfo {
  label: string;
  backgroundColor: string;
  originalValue: number;
}

function buildUnifiedTooltipContent(
  title: string,
  items: DatasetInfo[],
): string {
  let html = '';

  if (title) {
    html += `<div style="font-weight:600;margin-bottom:4px">${escapeHtml(title)}</div>`;
  }

  items.forEach((item) => {
    const colorBox = `<span style="display:inline-block;width:10px;height:10px;margin-right:6px;border-radius:2px;background:${item.backgroundColor}"></span>`;
    const text = `${escapeHtml(item.label)}: ${item.originalValue}%`;
    html += `<div style="display:flex;align-items:center;white-space:nowrap;line-height:1.6">${colorBox}${text}</div>`;
  });

  return html;
}

interface StackedAreaDataset {
  label?: string;
  backgroundColor?: string | string[];
  originalValues?: number[];
}

function getColumnDataFromChart(
  chart: Chart,
  dataIndex: number,
): DatasetInfo[] {
  const datasets = chart.data.datasets;
  const items: DatasetInfo[] = [];

  for (let i = datasets.length - 1; i >= 0; i--) {
    const dataset = datasets[i] as StackedAreaDataset;
    const originalValue = dataset.originalValues?.[dataIndex];

    if (originalValue == null) continue;

    items.push({
      label: dataset.label || `Series ${i + 1}`,
      backgroundColor:
        typeof dataset.backgroundColor === 'string'
          ? dataset.backgroundColor
          : '#000',
      originalValue,
    });
  }

  return items;
}

export function stackedAreaExternalTooltip(
  context: ExternalTooltipContext,
): void {
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltipElement();

  if (tooltip.opacity === 0 || !tooltip.dataPoints?.length) {
    tooltipEl.style.opacity = '0';
    return;
  }

  const dataIndex = tooltip.dataPoints[0].dataIndex;
  const title = tooltip.title?.[0] ?? '';
  const items = getColumnDataFromChart(chart, dataIndex);

  if (items.length > 0) {
    tooltipEl.innerHTML = buildUnifiedTooltipContent(title, items);
  }

  const canvasRect = chart.canvas.getBoundingClientRect();
  tooltipEl.style.opacity = '1';
  tooltipEl.style.left = `${canvasRect.left + window.scrollX + tooltip.caretX}px`;
  tooltipEl.style.top = `${canvasRect.top + window.scrollY + tooltip.caretY}px`;
}

export function removeStackedAreaTooltip(): void {
  document.getElementById(TOOLTIP_ID)?.remove();
}
