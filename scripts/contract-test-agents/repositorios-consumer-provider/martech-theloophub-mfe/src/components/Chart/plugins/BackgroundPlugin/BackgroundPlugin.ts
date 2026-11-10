import { Plugin } from 'chart.js';

type BackgroundSection = {
  from: number;
  to: number;
  color: string;
  hoverColor?: string;
};

type BackgroundPluginOptions = {
  sections: BackgroundSection[];
  useColumnDivision?: boolean;
  columnWidth?: number;
  getHoveredColumn?: () => number;
};

export function createBackgroundPlugin(
  options: BackgroundPluginOptions,
): Plugin<'bubble' | 'bar' | 'line'> {
  return {
    id: 'backgroundMultiSplit',
    beforeDraw(chart) {
      const {
        ctx,
        chartArea: { left, right },
        scales: { y, x },
      } = chart;

      const {
        sections,
        useColumnDivision = false,
        columnWidth,
        getHoveredColumn,
      } = options;

      const totalColumns =
        useColumnDivision && columnWidth ? Math.floor(x.max / columnWidth) : 1;

      const hovered = getHoveredColumn?.();

      for (let colIndex = 0; colIndex < totalColumns; colIndex++) {
        const colLeft = useColumnDivision
          ? x.getPixelForValue(colIndex * columnWidth)
          : left;
        const colRight = useColumnDivision
          ? x.getPixelForValue((colIndex + 1) * columnWidth)
          : right;

        const isHovered = useColumnDivision && colIndex === hovered;

        sections.forEach((section) => {
          const sectionTop = y.getPixelForValue(section.to);
          const sectionBottom = y.getPixelForValue(section.from);

          ctx.save();
          ctx.fillStyle = isHovered
            ? (section.hoverColor ?? section.color)
            : section.color;
          ctx.fillRect(
            colLeft,
            sectionTop,
            colRight - colLeft,
            sectionBottom - sectionTop,
          );
          ctx.restore();
        });
      }

      ctx.save();
      ctx.strokeStyle = 'rgba(126, 124, 124, 0.1)';
      ctx.lineWidth = 0.5;

      for (let i = 1; i < sections.length; i++) {
        const separatorY = y.getPixelForValue(sections[i].from);
        ctx.beginPath();
        ctx.moveTo(left, separatorY);
        ctx.lineTo(right, separatorY);
        ctx.stroke();
      }

      ctx.restore();
    },
  };
}
