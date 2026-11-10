import { ChartContext } from '../ConnectorPlugin';

interface DrawRoundedRectOptions {
  ctx: ChartContext;
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  label: string;
  textColor: string;
  backgroundColor: string;
  prefix?: string;
}

export function drawRoundedRect({
  ctx,
  x,
  y,
  width,
  height,
  radius,
  label,
  textColor,
  backgroundColor,
  prefix,
}: DrawRoundedRectOptions) {
  ctx.beginPath();
  ctx.setLineDash([0, 0]);
  ctx.strokeStyle = backgroundColor;

  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);

  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);

  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);

  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);

  ctx.closePath();
  ctx.fillStyle = backgroundColor;
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.textBaseline = 'middle';

  const centerX = x + width / 2;
  const centerY = y + height / 2;

  if (prefix) {
    const prefixText = prefix;
    const restText = label;
    ctx.font = 'bold 12px Work Sans';
    const prefixWidth = ctx.measureText(prefixText).width;
    ctx.font = '12px Work Sans';
    const restWidth = ctx.measureText(restText).width;
    const totalWidth = prefixWidth + restWidth;
    const startX = centerX - totalWidth / 2;
    ctx.font = 'bold 12px Work Sans';
    ctx.textAlign = 'left';
    ctx.fillText(prefixText, startX, centerY);
    ctx.font = '12px Work Sans';
    ctx.fillText(restText, startX + prefixWidth, centerY);
  } else {
    ctx.font = '12px Work Sans';
    ctx.textAlign = 'center';
    ctx.fillText(label, centerX, centerY);
  }
}
