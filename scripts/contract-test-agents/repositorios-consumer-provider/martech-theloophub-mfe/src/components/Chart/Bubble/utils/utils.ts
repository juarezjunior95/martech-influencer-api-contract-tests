import { COLUMN_WIDTH, getHoveredColumn } from '../constants';
import { BubbleChartData, BubblePoint } from '../types';

export function generateDatasets(data: BubbleChartData) {
  const borderColor =
    data.backgroundChart?.borderColorBubbleHover || 'transparent';

  const spacing = 0.015 * data.datasets.length;

  return data.datasets.map((column, columnIndex) => {
    const isHovered = columnIndex === getHoveredColumn();
    const yGroups: Record<number, BubblePoint[]> = {};
    column.bubbles.forEach((bubble) => {
      if (!yGroups[bubble.y]) yGroups[bubble.y] = [];
      yGroups[bubble.y].push(bubble);
    });

    const bubbleIndexMap = new Map<BubblePoint, number>();
    for (const group of Object.values(yGroups)) {
      group.forEach((bubble, index) => {
        bubbleIndexMap.set(bubble, index);
      });
    }

    return {
      label: data.info.label,
      data: column.bubbles.map((bubble: BubblePoint) => {
        const centerX = columnIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2;
        const group = yGroups[bubble.y];
        const count = group.length;
        const index = bubbleIndexMap.get(bubble) ?? 0;
        const offset = (index - (count - 1) / 2) * spacing;
        const x = centerX + offset;

        return {
          ...bubble,
          x,
          r: bubble.r,
          pointStyle: bubble.pointStyle,
        };
      }),
      pointStyle: (ctx) => {
        const index = ctx.dataIndex;
        const point = ctx.dataset.data[index];
        return point?.pointStyle || 'circle';
      },
      backgroundColor: column.bubbles.map((bubble) => bubble.backgroundColor),
      borderColor: column.bubbles.map(() =>
        isHovered ? borderColor : 'transparent',
      ),
      borderWidth: column.bubbles.map(() => (isHovered ? 2 : 0)),
      hoverBorderColor: '#ffffff',
      hoverBorderWidth: 2,
      hoverRadius: 1,
    };
  });
}
