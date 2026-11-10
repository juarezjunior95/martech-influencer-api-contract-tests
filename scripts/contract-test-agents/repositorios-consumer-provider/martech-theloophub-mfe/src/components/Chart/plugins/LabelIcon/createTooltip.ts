type IconPosition = {
  x: number;
  y: number;
  size: number;
  index: number;
  tooltipText?: string;
};

let tooltip: HTMLDivElement | null = null;

const createTooltipElement = () => {
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 8px;
      border-radius: 8px;
      font-size: 12px;
      font-family: 'Work Sans', sans-serif;
      pointer-events: none;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.2s;
      white-space: nowrap;
    `;

    document.body.appendChild(tooltip);
  }
  return tooltip;
};

export const createTooltip = (
  iconPos: IconPosition,
  canvas: HTMLCanvasElement,
  text,
) => {
  const tooltipEl = createTooltipElement();

  tooltipEl.textContent = text;

  const arrow = document.createElement('div');
  arrow.style.cssText = `
    position: absolute;
    top: -3px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid rgba(0, 0, 0, 0.8);
    z-index: 1001;
  `;
  tooltipEl.appendChild(arrow);

  const rect = canvas.getBoundingClientRect();
  const canvasX = rect.left + window.scrollX;
  const canvasY = rect.top + window.scrollY;

  tooltipEl.style.opacity = '1';
  tooltipEl.style.visibility = 'hidden';
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const tooltipWidth = tooltipRect.width;

  const tooltipX = canvasX + iconPos.x - tooltipWidth / 2;
  const tooltipY = canvasY + iconPos.y + iconPos.size + 8;

  tooltipEl.style.left = `${tooltipX}px`;
  tooltipEl.style.top = `${tooltipY}px`;
  tooltipEl.style.visibility = 'visible';
  tooltipEl.style.opacity = '1';
};

export const hideTooltip = () => {
  if (tooltip) {
    tooltip.style.opacity = '0';
  }
};

export const removeTooltip = () => {
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
};
