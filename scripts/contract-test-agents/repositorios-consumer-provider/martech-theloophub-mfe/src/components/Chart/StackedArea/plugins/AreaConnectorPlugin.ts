import { Chart } from 'chart.js';

import {
  CONNECTOR_EDGE_OVERLAP_PX,
  ZERO_BAR_GAP_PX,
  ZERO_BAR_MIN_HEIGHT_PX,
  ZERO_BAR_TOTAL_HEIGHT,
  ZERO_CONNECTOR_COLOR,
} from '../constants';
import { getVerticalBorderWidths } from '../utils/borderHelpers';
import {
  countVisualZeroBarsBelow,
  isPreStartZero,
  isVisualZeroBar,
} from '../utils/zeroBarHelpers';

interface BarElementRect {
  x: number;
  y: number;
  base: number;
  width: number;
}

interface ConnectorVerticalBoundsParams {
  datasets: unknown[];
  datasetIndex: number;
  barIndex: number;
  bar: BarElementRect;
  gapTop: number;
  gapBottom: number;
  isZero: boolean;
  isPreStart: boolean;
}

interface ConnectorPolygonCoords {
  x1: number;
  x2: number;
  yTopStart: number;
  yTopEnd: number;
  yBaseEnd: number;
  yBaseStart: number;
}

function shouldSkipConnectorSegment(
  dataset: unknown,
  index: number,
  currentData: unknown,
  nextData: unknown,
): boolean {
  const current = currentData as { disabled?: boolean } | null | undefined;
  const next = nextData as { disabled?: boolean } | null | undefined;
  if (current?.disabled || next?.disabled) return true;
  return isPreStartZero(dataset, index) && isPreStartZero(dataset, index + 1);
}

function shouldSkipByCollapsedNonZeroBars(
  currentHeight: number,
  currentIsZero: boolean,
  nextHeight: number,
  nextIsZero: boolean,
): boolean {
  return currentHeight < 1 && !currentIsZero && nextHeight < 1 && !nextIsZero;
}

function computeConnectorVerticalBounds(
  params: ConnectorVerticalBoundsParams,
): { yTop: number; yBase: number } {
  const {
    datasets,
    datasetIndex,
    barIndex,
    bar,
    gapTop,
    gapBottom,
    isZero,
    isPreStart,
  } = params;

  let yTop: number;
  let yBase: number;

  if (isZero) {
    const offset =
      countVisualZeroBarsBelow(datasets, datasetIndex, barIndex) *
      ZERO_BAR_TOTAL_HEIGHT;
    yTop = bar.base - offset - ZERO_BAR_GAP_PX - ZERO_BAR_MIN_HEIGHT_PX;
    yBase = bar.base - offset - ZERO_BAR_GAP_PX;
  } else {
    yTop = bar.y + gapTop;
    const totalZerosBelow = countVisualZeroBarsBelow(
      datasets,
      datasetIndex,
      barIndex,
    );
    yBase =
      totalZerosBelow > 0
        ? bar.base - totalZerosBelow * ZERO_BAR_TOTAL_HEIGHT
        : bar.base - gapBottom;
  }

  if (isPreStart) {
    return { yTop: bar.base, yBase: bar.base };
  }

  return { yTop, yBase };
}

function fillConnectorPolygon(
  ctx: CanvasRenderingContext2D,
  coords: ConnectorPolygonCoords,
  fillStyle: string,
): void {
  const { x1, x2, yTopStart, yTopEnd, yBaseEnd, yBaseStart } = coords;
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.beginPath();
  ctx.moveTo(x1, yTopStart);
  ctx.lineTo(x2, yTopEnd);
  ctx.lineTo(x2, yBaseEnd);
  ctx.lineTo(x1, yBaseStart);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function createAreaConnectorPlugin(connectorColors: string[]) {
  return {
    id: 'areaConnector',

    beforeDatasetsDraw(chart: Chart<'bar'>) {
      const ctx = chart.ctx;
      const datasets = chart.data.datasets;

      datasets.forEach((dataset, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (meta.data.length < 2) return;

        const isTopLayer = datasetIndex === datasets.length - 1;
        const isBottomLayer = datasetIndex === 0;

        const { top: datasetTopBorder, bottom: datasetBottomBorder } =
          getVerticalBorderWidths(dataset);

        const gapTop = isTopLayer ? 0 : datasetTopBorder;
        const gapBottom = isBottomLayer ? 0 : datasetBottomBorder;
        const segmentIndex = datasets.length - 1 - datasetIndex;
        const color = connectorColors[segmentIndex] ?? '#000';

        for (let i = 0; i < meta.data.length - 1; i++) {
          const currentBar = meta.data[i] as unknown as BarElementRect;
          const nextBar = meta.data[i + 1] as unknown as BarElementRect;

          if (
            shouldSkipConnectorSegment(
              dataset,
              i,
              dataset.data[i],
              dataset.data[i + 1],
            )
          ) {
            continue;
          }

          const currentHeight = Math.abs(currentBar.base - currentBar.y);
          const nextHeight = Math.abs(nextBar.base - nextBar.y);
          const currentIsZero = isVisualZeroBar(dataset, i);
          const nextIsZero = isVisualZeroBar(dataset, i + 1);

          const currentIsPreStart = isPreStartZero(dataset, i);
          const nextIsPreStart = isPreStartZero(dataset, i + 1);

          if (
            shouldSkipByCollapsedNonZeroBars(
              currentHeight,
              currentIsZero,
              nextHeight,
              nextIsZero,
            )
          ) {
            continue;
          }

          const currentRightEdge = currentBar.x + currentBar.width / 2;
          const nextLeftEdge = nextBar.x - nextBar.width / 2;

          const x1 = currentRightEdge - CONNECTOR_EDGE_OVERLAP_PX;
          const x2 = nextLeftEdge + CONNECTOR_EDGE_OVERLAP_PX;

          const { yTop: yTopI, yBase: yBaseI } = computeConnectorVerticalBounds(
            {
              datasets,
              datasetIndex,
              barIndex: i,
              bar: currentBar,
              gapTop,
              gapBottom,
              isZero: currentIsZero,
              isPreStart: currentIsPreStart,
            },
          );

          const { yTop: yTopI1, yBase: yBaseI1 } =
            computeConnectorVerticalBounds({
              datasets,
              datasetIndex,
              barIndex: i + 1,
              bar: nextBar,
              gapTop,
              gapBottom,
              isZero: nextIsZero,
              isPreStart: nextIsPreStart,
            });

          const fillStyle =
            currentIsZero && nextIsZero ? ZERO_CONNECTOR_COLOR : String(color);

          fillConnectorPolygon(
            ctx,
            {
              x1,
              x2,
              yTopStart: yTopI,
              yTopEnd: yTopI1,
              yBaseEnd: yBaseI1,
              yBaseStart: yBaseI,
            },
            fillStyle,
          );
        }
      });
    },
  };
}
