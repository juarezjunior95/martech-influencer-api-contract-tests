import { Chart, Plugin, TooltipModel } from 'chart.js';

import {
  buildDashedLineIndicatorBackground,
  getTooltipHostId,
  isLineDatasetDashed,
  LINE_POINT_TOOLTIP_HOST_ATTR,
  resolveLineDatasetColor,
} from '../linePointTooltip.utils';
import { formatLinePointTooltipItemValue } from '../linePointTooltip.valueFormat';
import type { LinePointTooltipHandlerOptions } from '../types';

function sortDataPointsByTooltipLabelOrder<T extends { datasetIndex: number }>(
  chart: Chart<'line'>,
  points: T[],
  tooltipLabels: Record<string, string> | undefined,
): T[] {
  if (!tooltipLabels || Object.keys(tooltipLabels).length === 0) return points;

  const order = Object.keys(tooltipLabels);
  const base = order.length;

  return [...points].sort((a, b) => {
    const la = String(chart.data.datasets[a.datasetIndex].label ?? '');
    const lb = String(chart.data.datasets[b.datasetIndex].label ?? '');
    const ia = order.indexOf(la);
    const ib = order.indexOf(lb);
    const ra = ia >= 0 ? ia : base + a.datasetIndex;
    const rb = ib >= 0 ? ib : base + b.datasetIndex;
    return ra - rb || a.datasetIndex - b.datasetIndex;
  });
}

const TOOLTIP_BG = '#000000';
const FONT_FAMILY = "'Work Sans', monospace";
const ARROW_SIZE = 6;

export function destroyLinePointTooltipHost(chart: Chart<'line'>): void {
  const id = getTooltipHostId(chart.id);
  document
    .querySelector<HTMLDivElement>(`[${LINE_POINT_TOOLTIP_HOST_ATTR}="${id}"]`)
    ?.remove();
}

function getOrCreateExternalTooltipHost(chart: Chart<'line'>): HTMLDivElement {
  const id = getTooltipHostId(chart.id);
  let host = document.querySelector<HTMLDivElement>(
    `[${LINE_POINT_TOOLTIP_HOST_ATTR}="${id}"]`,
  );

  if (!host) {
    host = document.createElement('div');
    host.setAttribute(LINE_POINT_TOOLTIP_HOST_ATTR, id);
    Object.assign(host.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      pointerEvents: 'none',
      zIndex: '1000',
    });
    document.body.appendChild(host);
  }

  return host;
}

function getLinePointTooltipValueText(
  point: {
    datasetIndex: number;
    dataIndex: number;
    formattedValue: string;
    raw?: unknown;
  },
  formattedData: string[][] | undefined,
  useFormattedData: boolean,
  tooltipLabels: Record<string, string> | undefined,
): string {
  if (
    useFormattedData &&
    formattedData?.[point.datasetIndex]?.[point.dataIndex] !== undefined
  ) {
    return String(formattedData[point.datasetIndex][point.dataIndex]);
  }

  if (!tooltipLabels || Object.keys(tooltipLabels).length === 0) {
    return point.formattedValue;
  }

  return formatLinePointTooltipItemValue(point);
}

/**
 * Chart.js external tooltip: black card, one row per series (dataset colors), dashed pill when `borderDash` is set.
 */
export function createLinePointTooltipExternal(
  handlerOptions: LinePointTooltipHandlerOptions = {},
) {
  const {
    formattedData,
    useFormattedData = true,
    tooltipLabels,
  } = handlerOptions;

  return function linePointTooltipExternal(context: {
    chart: Chart<'line'>;
    tooltip: TooltipModel<'line'>;
  }): void {
    const { chart, tooltip } = context;

    if (tooltip.opacity === 0 || tooltip.dataPoints.length === 0) {
      const host = document.querySelector<HTMLDivElement>(
        `[${LINE_POINT_TOOLTIP_HOST_ATTR}="${getTooltipHostId(chart.id)}"]`,
      );
      if (host) {
        host.innerHTML = '';
        host.style.opacity = '0';
      }
      return;
    }

    const host = getOrCreateExternalTooltipHost(chart);
    host.innerHTML = '';

    const rect = chart.canvas.getBoundingClientRect();
    const anchorX = rect.left + tooltip.caretX;
    const anchorY = rect.top + tooltip.caretY;

    const wrapper = document.createElement('div');
    Object.assign(wrapper.style, {
      position: 'absolute',
      left: `${anchorX}px`,
      top: `${anchorY}px`,
      transform: 'translate(-50%, calc(-100% - 10px))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      opacity: '1',
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: TOOLTIP_BG,
      borderRadius: '6px',
      padding: '8px',
      minWidth: '120px',
      boxSizing: 'border-box',
    });

    const rowsFragment = document.createDocumentFragment();

    const points = sortDataPointsByTooltipLabelOrder(
      chart,
      tooltip.dataPoints,
      tooltipLabels,
    );

    points.forEach((point) => {
      const meta = chart.getDatasetMeta(point.datasetIndex);
      if (meta.hidden) {
        return;
      }

      const dataset = point.dataset;
      const color = resolveLineDatasetColor(dataset);
      const dashed = isLineDatasetDashed(dataset);

      const row = document.createElement('div');
      Object.assign(row.style, {
        display: 'grid',
        gridTemplateColumns: '28px 36px 1fr',
        alignItems: 'center',
        columnGap: '8px',
        marginBottom: '6px',
        fontFamily: FONT_FAMILY,
        fontSize: '16px',
        color,
      });

      const indicator = document.createElement('span');
      Object.assign(indicator.style, {
        display: 'block',
        width: '24px',
        height: '12px',
        borderRadius: '4px',
        boxSizing: 'border-box',
        background: dashed ? buildDashedLineIndicatorBackground(color) : color,
        boxShadow: 'inset 0 0 0 3px rgba(0, 0, 0, 0.13)',
      });

      const dsLabel = String(dataset.label ?? '');
      const labelEl = document.createElement('span');
      labelEl.textContent = tooltipLabels?.[dsLabel] ?? dsLabel;
      Object.assign(labelEl.style, { color, whiteSpace: 'nowrap' });

      const valueEl = document.createElement('span');
      valueEl.textContent = getLinePointTooltipValueText(
        { ...point, raw: (point as { raw?: unknown }).raw },
        formattedData,
        useFormattedData,
        tooltipLabels,
      );
      Object.assign(valueEl.style, {
        color,
        textAlign: 'right',
        whiteSpace: 'nowrap',
      });

      row.appendChild(indicator);
      row.appendChild(labelEl);
      row.appendChild(valueEl);
      rowsFragment.appendChild(row);
    });

    if (rowsFragment.childNodes.length === 0) {
      host.innerHTML = '';
      host.style.opacity = '0';
      return;
    }

    const lastRow = rowsFragment.lastChild as HTMLElement | null;
    if (lastRow) {
      lastRow.style.marginBottom = '0';
    }

    box.appendChild(rowsFragment);

    const arrow = document.createElement('div');
    Object.assign(arrow.style, {
      width: '0',
      height: '0',
      borderLeft: `${ARROW_SIZE}px solid transparent`,
      borderRight: `${ARROW_SIZE}px solid transparent`,
      borderTop: `${ARROW_SIZE}px solid ${TOOLTIP_BG}`,
      marginTop: '-1px',
    });

    wrapper.appendChild(box);
    wrapper.appendChild(arrow);
    host.appendChild(wrapper);
    host.style.opacity = '1';
  };
}

export function createLinePointTooltipCleanupPlugin(): Plugin<'line'> {
  return {
    id: 'linePointTooltipCleanup',
    afterDestroy(chart) {
      destroyLinePointTooltipHost(chart);
    },
  };
}
