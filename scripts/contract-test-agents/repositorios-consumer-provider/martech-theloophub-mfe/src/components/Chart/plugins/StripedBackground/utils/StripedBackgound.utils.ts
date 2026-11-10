import { DatasetPattern, StripedPatternParams } from 'models/ChartData';

const MIN_SIZE_VALUE = 0.1;

const STRIPE_RENDER_OFFSET = 5;

const PATTERN_SIZE_MULTIPLIER = 2;

export const DEFAULT_CONFIG: Required<StripedPatternParams> = {
  color: 'red',
  angle: 45,
  thickness: 2,
  spacing: 5,
};

function validateNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || value < min || value > max) {
    return Math.max(min, Math.min(max, value || min));
  }
  return value;
}

function validateDimension(value: number): number {
  return validateNumber(value, MIN_SIZE_VALUE, Number.MAX_SAFE_INTEGER);
}

export function drawPaddedRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  padding: number,
): void {
  const validatedWidth = validateDimension(width);
  const validatedHeight = validateDimension(height);
  const validatedRadius = validateNumber(
    radius,
    0,
    Math.min(validatedWidth, validatedHeight) / 2,
  );
  const validatedPadding = validateNumber(
    padding,
    0,
    Math.min(validatedWidth, validatedHeight) / 4,
  );

  const innerDimensions = calculateInnerDimensions(
    x,
    y,
    validatedWidth,
    validatedHeight,
    validatedRadius,
    validatedPadding,
  );

  if (innerDimensions.width <= 0 || innerDimensions.height <= 0) {
    return;
  }

  drawRoundedRectPath(ctx, innerDimensions);
}

function calculateInnerDimensions(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  padding: number,
) {
  return {
    x: x + padding,
    y: y + padding,
    width: width - 2 * padding,
    height: height - 2 * padding,
    radius: Math.max(0, radius - padding),
  };
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
  },
): void {
  const { x, y, width, height, radius } = dimensions;

  ctx.beginPath();

  ctx.moveTo(x + radius, y);

  ctx.lineTo(x + width - radius, y);

  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

  ctx.lineTo(x + width, y + height - radius);

  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

  ctx.lineTo(x + radius, y + height);

  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

  ctx.lineTo(x, y + radius);

  ctx.quadraticCurveTo(x, y, x + radius, y);

  ctx.closePath();
}

export function createStripedPattern(
  ctx: CanvasRenderingContext2D,
  params: StripedPatternParams = {},
): CanvasPattern | null {
  const validatedConfig = validatePatternConfig(params);

  const patternSize = calculateOptimalPatternSize(ctx);

  const patternCanvas = createPatternCanvas(patternSize);
  if (!patternCanvas) return null;

  drawStripePattern(patternCanvas, validatedConfig, patternSize);

  return ctx.createPattern(patternCanvas.canvas, 'repeat');
}

function validatePatternConfig(
  params: StripedPatternParams,
): Required<StripedPatternParams> {
  return {
    color: params.color || DEFAULT_CONFIG.color,
    angle: validateNumber(params.angle, -360, 360),
    thickness: validateNumber(params.thickness, 0.5, 50),
    spacing: validateNumber(params.spacing, 0.5, 100),
  };
}

function calculateOptimalPatternSize(ctx: CanvasRenderingContext2D): {
  height: number;
  width: number;
} {
  return { height: ctx.canvas.offsetHeight, width: ctx.canvas.offsetWidth };
}

function createPatternCanvas(sizes: {
  width: number;
  height: number;
}): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } | null {
  const canvas = document.createElement('canvas');
  canvas.width = sizes.width;
  canvas.height = sizes.height;

  const context = canvas.getContext('2d');
  if (!context) {
    return null;
  }

  return { canvas, context };
}

function drawStripePattern(
  patternCanvas: {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
  },
  params: Required<StripedPatternParams>,
  patternSize: { width: number; height: number },
): void {
  const { context: pctx } = patternCanvas;
  const { color, angle, thickness, spacing } = params;

  pctx.fillStyle = color;
  pctx.lineCap = 'round';
  pctx.lineJoin = 'round';

  const angleRad = (angle * Math.PI) / 180;
  const totalSpacing = thickness + spacing;

  const size = Math.max(patternSize.width, patternSize.height);

  const drawRange = size * PATTERN_SIZE_MULTIPLIER;
  const startPosition = -size;

  for (let i = startPosition; i < drawRange; i += totalSpacing) {
    drawSingleStripe(pctx, i, angleRad, thickness, drawRange);
  }
}

function drawSingleStripe(
  ctx: CanvasRenderingContext2D,
  position: number,
  angleRad: number,
  thickness: number,
  height: number,
): void {
  ctx.save();

  ctx.translate(position, 0);
  ctx.rotate(angleRad);

  ctx.fillRect(0, -STRIPE_RENDER_OFFSET, thickness, height);

  ctx.restore();
}

export function shouldApplyStripedPattern(
  pattern: DatasetPattern,
  barIndex: number,
) {
  return pattern?.type === 'striped' && pattern?.flags?.includes(barIndex);
}
