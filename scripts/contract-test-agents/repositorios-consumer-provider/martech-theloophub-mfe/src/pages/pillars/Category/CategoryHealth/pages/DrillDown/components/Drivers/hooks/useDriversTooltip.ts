import { useMemo } from 'react';

import {
  CHART_COLORS,
  PROXIMITY_THRESHOLD_PIXELS,
  TOOLTIP_CONFIG,
} from '../drivers.constants';
import { TooltipContext } from '../drivers.types';

interface UseDriversTooltipParams {
  populationLabel: string;
  iclLabel: string;
  populationFormattedValues: string[];
  iclFormattedValues: string[];
  populationValues: number[];
  iclValues: number[];
}

interface SeriesData {
  label: string;
  values: string[];
  color: string;
}

interface TooltipPosition {
  xPos: number;
  yPos: number;
  isLastColumns: boolean;
}

const getOrCreateTooltipElement = (parentNode: HTMLElement): HTMLDivElement => {
  let el = parentNode.querySelector(
    '[data-drivers-tooltip]',
  ) as HTMLDivElement | null;

  if (!el) {
    el = document.createElement('div');
    el.dataset.driversTooltip = '';
    parentNode.appendChild(el);
  }

  return el;
};

const resetTooltipElement = (el: HTMLDivElement): void => {
  el.innerHTML = '';
  el.style.display = 'none';
};

const areValuesProximate = (
  popY: number | undefined,
  iclY: number | undefined,
): boolean => {
  if (popY == null || iclY == null) return false;
  return Math.abs(popY - iclY) <= PROXIMITY_THRESHOLD_PIXELS;
};

const calculateTooltipPosition = (
  chart: TooltipContext['chart'],
  tooltip: TooltipContext['tooltip'],
  popY: number,
  iclY: number,
  dataIndex: number,
): TooltipPosition => {
  const canvasRect = chart.canvas.getBoundingClientRect();
  const totalLabels = chart.data.labels?.length ?? 0;

  return {
    xPos: canvasRect.left + tooltip.caretX,
    yPos: canvasRect.top + (popY + iclY) / 2,
    isLastColumns:
      dataIndex >= totalLabels - TOOLTIP_CONFIG.lastColumnsThreshold,
  };
};

const applyTooltipStyles = (
  div: HTMLDivElement,
  position: TooltipPosition,
): void => {
  const { xPos, yPos, isLastColumns } = position;

  Object.assign(div.style, {
    position: 'fixed',
    backgroundColor: TOOLTIP_CONFIG.background,
    color: TOOLTIP_CONFIG.textColor,
    fontSize: TOOLTIP_CONFIG.fontSize,
    fontFamily: TOOLTIP_CONFIG.fontFamily,
    padding: TOOLTIP_CONFIG.padding,
    borderRadius: TOOLTIP_CONFIG.borderRadius,
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
    zIndex: TOOLTIP_CONFIG.zIndex,
    transform: isLastColumns
      ? TOOLTIP_CONFIG.transformLeft
      : TOOLTIP_CONFIG.transformRight,
    left: `${xPos + (isLastColumns ? -TOOLTIP_CONFIG.offsetX : TOOLTIP_CONFIG.offsetX)}px`,
    top: `${yPos}px`,
  });
};

const createSeriesListItem = (
  series: SeriesData,
  dataIndex: number,
): HTMLLIElement => {
  const li = document.createElement('li');
  Object.assign(li.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });

  const bullet = document.createElement('span');
  Object.assign(bullet.style, {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: series.color,
    flexShrink: '0',
  });

  li.appendChild(bullet);
  li.appendChild(
    document.createTextNode(
      `${series.label}: ${series.values[dataIndex] ?? ''}`,
    ),
  );

  return li;
};

const createTooltipContent = (
  seriesData: SeriesData[],
  dataIndex: number,
): HTMLDivElement => {
  const ul = document.createElement('ul');
  Object.assign(ul.style, {
    listStyle: 'none',
    margin: '0',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  });

  seriesData.forEach((series) => {
    ul.appendChild(createSeriesListItem(series, dataIndex));
  });

  const div = document.createElement('div');
  div.appendChild(ul);

  return div;
};

export const useDriversTooltip = ({
  populationLabel,
  iclLabel,
  populationFormattedValues,
  iclFormattedValues,
  populationValues,
  iclValues,
}: UseDriversTooltipParams) => {
  return useMemo(() => {
    const seriesData: SeriesData[] = [
      {
        label: populationLabel,
        values: populationFormattedValues,
        color: CHART_COLORS.population.background,
      },
      {
        label: iclLabel,
        values: iclFormattedValues,
        color: CHART_COLORS.icl.background,
      },
    ];

    return (context: TooltipContext) => {
      const { chart, tooltip } = context;
      const el = getOrCreateTooltipElement(
        chart.canvas.parentNode as HTMLElement,
      );
      resetTooltipElement(el);

      if (tooltip.opacity === 0 || !tooltip.dataPoints?.length) return;

      const dataIndex = tooltip.dataPoints[0]?.dataIndex;
      if (dataIndex == null) return;

      const popY = chart.scales.y?.getPixelForValue(
        populationValues[dataIndex],
      );
      const iclY = chart.scales.y1?.getPixelForValue(iclValues[dataIndex]);

      if (!areValuesProximate(popY, iclY)) return;
      if (popY == null || iclY == null) return;

      const position = calculateTooltipPosition(
        chart,
        tooltip,
        popY,
        iclY,
        dataIndex,
      );

      const tooltipContent = createTooltipContent(seriesData, dataIndex);
      applyTooltipStyles(tooltipContent, position);

      el.style.display = 'block';
      el.appendChild(tooltipContent);
    };
  }, [
    populationLabel,
    iclLabel,
    populationFormattedValues,
    iclFormattedValues,
    populationValues,
    iclValues,
  ]);
};
