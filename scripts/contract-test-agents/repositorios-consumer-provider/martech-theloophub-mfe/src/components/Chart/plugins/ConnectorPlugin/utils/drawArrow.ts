import { theme } from 'theme';

import { ChartContext } from '../ConnectorPlugin';

interface DrawArrowOptions {
  ctx: ChartContext;
  firstBar: any;
  lastBar: any;
  axisLineY: number;
  midY: number;
  arcRadius: number;
  offset: number;
}

export const drawArrow = ({
  ctx,
  firstBar,
  lastBar,
  axisLineY,
  midY,
  arcRadius,
  offset,
}: DrawArrowOptions) => {
  ctx.setLineDash([6, 2]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = theme.colors.charts.border.neutrals[30];

  const firstBarX = firstBar.x;
  const lastBarX = lastBar.x;

  const firstBarTop = Math.min(firstBar.y, firstBar.base, axisLineY);
  const lastBarTop = Math.min(lastBar.y, lastBar.base, axisLineY);

  ctx.beginPath();
  const moveFromY = firstBarTop - 25;
  ctx.moveTo(firstBarX, moveFromY);
  if (firstBarTop - midY > 50) {
    ctx.lineTo(firstBarX, midY);
  }

  ctx.arc(
    firstBarX + arcRadius,
    midY - offset - 12,
    arcRadius,
    Math.PI,
    1.5 * Math.PI,
  );
  ctx.lineTo(lastBarX - arcRadius, midY - offset - arcRadius - 12);
  ctx.arc(
    lastBarX - arcRadius,
    midY - offset - 12,
    arcRadius,
    1.5 * Math.PI,
    0,
  );

  const centerY = midY - offset;
  const radius = arcRadius;
  const angleEnd = 0;

  const finalY = centerY + Math.sin(angleEnd) * radius;

  const lineToY = lastBarTop - 35;
  if (finalY < lastBarTop - 35) {
    ctx.lineTo(lastBarX, lineToY);
  }
  ctx.stroke();
  const base = lastBarTop - 30;
  const yBase = base < finalY ? finalY + 10 : base;
  ctx.beginPath();
  ctx.moveTo(lastBarX, yBase);
  ctx.lineTo(lastBarX - 6, yBase - 10);
  ctx.lineTo(lastBarX + 6, yBase - 10);
  ctx.closePath();
  ctx.fillStyle = theme.colors.charts.border.neutrals[30];
  ctx.fill();
};
