import { theme } from '@hexa-ui/theme';

import { getHoveredColumn } from '../constants';

const TOOLTIP_CONFIG = {
  PROXIMITY_THRESHOLD: 115,
  ITEM_HEIGHT: 20,
  PADDING: 16,
  MIN_GAP: 8,
  ARROW_MARGIN: 10,
} as const;

const TOOLTIP_COLOR = 'rgba(20, 20, 20, 1)';

interface TooltipPoint {
  x: number;
  y: number;
  tooltip: string;
  pointStyle?: string;
  backgroundColor?: string;
}

interface TooltipGroup {
  points: TooltipPoint[];
}

interface TooltipPosition {
  group: TooltipGroup;
  top: number;
  height: number;
  left: number;
  pointsY: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateTooltipHeight(itemCount: number): number {
  return itemCount * TOOLTIP_CONFIG.ITEM_HEIGHT + TOOLTIP_CONFIG.PADDING;
}

function resolveVerticalCollisions(positions: TooltipPosition[]): void {
  for (let i = 1; i < positions.length; i++) {
    const previousTooltip = positions[i - 1];
    const currentTooltip = positions[i];
    const previousBottom = previousTooltip.top + previousTooltip.height;

    const hasCollision =
      currentTooltip.top < previousBottom + TOOLTIP_CONFIG.MIN_GAP;
    if (hasCollision) {
      currentTooltip.top = previousBottom + TOOLTIP_CONFIG.MIN_GAP;
    }
  }
}

export function customExternalTooltip(context: any) {
  const { chart } = context;
  let container = document.getElementById('chart-tooltips') as HTMLDivElement;

  if (!container) {
    container = document.createElement('div');
    container.id = 'chart-tooltips';
    Object.assign(container.style, {
      position: 'absolute',
      pointerEvents: 'none',
      top: '0',
      left: '0',
      zIndex: '1000',
    });
    chart.canvas.parentNode.appendChild(container);
  }

  container.innerHTML = '';

  const hoveredColumn = getHoveredColumn();
  if (hoveredColumn === null) return;

  const dataset = chart.data.datasets[hoveredColumn];
  const meta = chart.getDatasetMeta(hoveredColumn);

  const groups: TooltipGroup[] = [];

  dataset.data.forEach((point: any, idx: number) => {
    const pos = meta.data[idx].getProps(['x', 'y'], true);
    if (!point?.tooltip) return;

    let groupFound = false;
    for (const group of groups) {
      for (const gPoint of group.points) {
        const dy = Math.abs(gPoint.y - pos.y);
        if (dy <= TOOLTIP_CONFIG.PROXIMITY_THRESHOLD) {
          group.points.push({
            x: pos.x,
            y: pos.y,
            tooltip: point.tooltip,
            pointStyle: point.pointStyle,
            backgroundColor: point.backgroundColor,
          });
          groupFound = true;
          break;
        }
      }
      if (groupFound) break;
    }

    if (!groupFound) {
      groups.push({
        points: [
          {
            x: pos.x,
            y: pos.y,
            tooltip: point.tooltip,
            pointStyle: point.pointStyle,
            backgroundColor: point.backgroundColor,
          },
        ],
      });
    }
  });

  const totalColumns = chart.data.datasets.length;
  const isLastTwoColumns = hoveredColumn >= totalColumns - 3;

  const tooltipPositions: TooltipPosition[] = groups.map((group) => {
    const avgX =
      group.points.reduce((sum, p) => sum + p.x, 0) / group.points.length;
    const avgY =
      group.points.reduce((sum, p) => sum + p.y, 0) / group.points.length;
    const height = calculateTooltipHeight(group.points.length);

    return {
      group,
      top: avgY - height / 2,
      height,
      left: avgX,
      pointsY: avgY,
    };
  });

  tooltipPositions.sort((a, b) => a.top - b.top);
  resolveVerticalCollisions(tooltipPositions);

  tooltipPositions.forEach(({ group, top, left, pointsY, height }) => {
    const sortedPoints = [...group.points].sort((a, b) => a.y - b.y);

    const arrowOffset = pointsY - top;
    const clampedArrowOffset = clamp(
      arrowOffset,
      TOOLTIP_CONFIG.ARROW_MARGIN,
      height - TOOLTIP_CONFIG.ARROW_MARGIN,
    );

    const div = document.createElement('div');

    Object.assign(div.style, {
      width: 'fit-content',
      backgroundColor: TOOLTIP_COLOR,
      color: 'rgba(255, 255, 255, 1)',
      fontSize: '0.875rem',
      fontWeight: '400',
      padding: '0.5rem',
      position: 'absolute',
      lineHeight: '1rem',
      fontFamily: theme.fonts.paragraph,
      pointerEvents: 'none',
      borderRadius: '0.5rem',
      transform: isLastTwoColumns ? 'translate(-115%, 0)' : 'translate(10%, 0)',
      left: isLastTwoColumns ? `${left - 5}px` : `${left + 5}px`,
      top: `${top}px`,
    });

    const ul = document.createElement('ul');
    Object.assign(ul.style, {
      listStyle: 'none',
      margin: '0',
      padding: '0',
    });

    sortedPoints.forEach((p) => {
      const li = document.createElement('li');
      const isTriangle = p.pointStyle === 'triangle';
      const isDiamond = p.pointStyle === 'rectRot';

      let bulletNode: HTMLElement | SVGSVGElement;

      if (isTriangle) {
        const svg = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg',
        );
        svg.setAttribute('width', '8');
        svg.setAttribute('height', '8');
        svg.setAttribute('viewBox', '0 0 10 10');
        Object.assign(svg.style, {
          marginRight: '5px',
          verticalAlign: 'middle',
          flexShrink: '0',
          display: 'inline-block',
        });
        const polygon = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'polygon',
        );
        polygon.setAttribute('points', '5,0.5 9.5,9.5 0.5,9.5');
        polygon.setAttribute('fill', p.backgroundColor || '#000');
        polygon.setAttribute('stroke', 'rgba(255,255,255,1)');
        polygon.setAttribute('stroke-width', '1.5');
        svg.appendChild(polygon);
        bulletNode = svg;
      } else {
        const bullet = document.createElement('span');
        Object.assign(bullet.style, {
          display: 'inline-block',
          width: '0.5rem',
          height: '0.5rem',
          marginRight: '5px',
          borderRadius: isDiamond ? 0 : '50%',
          backgroundColor: p.backgroundColor || '#000',
          verticalAlign: 'middle',
          flexShrink: '0',
          transform: isDiamond ? 'rotate(-45deg)' : 'rotate(0)',
          border: '1px solid rgba(255, 255, 255, 1)',
        });
        bulletNode = bullet;
      }

      li.appendChild(bulletNode);
      li.appendChild(document.createTextNode(p.tooltip));
      Object.assign(li.style, {
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
      });

      ul.appendChild(li);
    });

    div.appendChild(ul);

    const arrow = document.createElement('div');
    if (isLastTwoColumns) {
      Object.assign(arrow.style, {
        position: 'absolute',
        top: `${clampedArrowOffset}px`,
        right: '-5px',
        width: '0',
        height: '0',
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
        borderLeft: `7px solid ${TOOLTIP_COLOR}`,
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
      });
    } else {
      Object.assign(arrow.style, {
        position: 'absolute',
        top: `${clampedArrowOffset}px`,
        left: '-5px',
        width: '0',
        height: '0',
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
        borderRight: `7px solid ${TOOLTIP_COLOR}`,
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
      });
    }

    div.appendChild(arrow);
    container.appendChild(div);
  });
}
