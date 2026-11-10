export const COLUMN_WIDTH = 2;
export const TOOLTIP_CONTAINER_ID = 'chart-tooltips';
const MOUSELEAVE_COOLDOWN_MS = 100;

let hoveredColumn: number | null = null;
let lastMouseLeaveTime = 0;

export function getHoveredColumn(): number | null {
  return hoveredColumn;
}

export function setHoveredColumn(value: number | null): void {
  hoveredColumn = value;
}

export function isInCooldown(): boolean {
  return Date.now() - lastMouseLeaveTime < MOUSELEAVE_COOLDOWN_MS;
}

export function clearTooltip(): void {
  lastMouseLeaveTime = Date.now();
  setHoveredColumn(null);
  const container = document.getElementById(TOOLTIP_CONTAINER_ID);
  if (container) {
    container.innerHTML = '';
  }
}
