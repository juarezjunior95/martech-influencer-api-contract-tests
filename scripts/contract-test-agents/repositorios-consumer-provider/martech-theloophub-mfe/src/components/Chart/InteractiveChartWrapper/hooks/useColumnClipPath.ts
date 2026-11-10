import React, { useCallback, useEffect, useRef, useState } from 'react';

interface GridPadding {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface UseColumnClipPathProps {
  labelsLength: number;
  gridPadding: GridPadding;
  isHorizontal: boolean;
}

interface UseColumnClipPathResult {
  containerRef: React.RefObject<HTMLDivElement>;
  canvasHeight: number | null;
  getColumnLiftStyle: (index: number) => React.CSSProperties;
}

export const useColumnClipPath = ({
  labelsLength,
  gridPadding,
  isHorizontal,
}: UseColumnClipPathProps): UseColumnClipPathResult => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);

        const canvas = containerRef.current.querySelector('canvas');
        if (canvas) {
          setCanvasHeight(canvas.offsetHeight);
        }
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
      const canvas = containerRef.current.querySelector('canvas');
      if (canvas) {
        resizeObserver.observe(canvas);
      }
    }

    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      resizeObserver.disconnect();
    };
  }, []);

  const getColumnLiftStyle = useCallback(
    (index: number): React.CSSProperties => {
      const totalItems = labelsLength;

      if (isHorizontal) {
        if (!containerHeight) {
          const columnTopPercent = (index / totalItems) * 100;
          const columnHeightPercent = (1 / totalItems) * 100;
          const columnCenterPercent =
            columnTopPercent + columnHeightPercent / 2;
          const clipHeightPercent = columnHeightPercent;
          const clipTopPercent = columnCenterPercent - clipHeightPercent / 2;
          const clipBottomPercent = 100 - (clipTopPercent + clipHeightPercent);

          return {
            '--clip-top': `${clipTopPercent}%`,
            '--clip-bottom': `${clipBottomPercent}%`,
          } as React.CSSProperties;
        }

        const totalPadding = gridPadding.top + gridPadding.bottom;
        const chartAreaHeight = containerHeight - totalPadding;
        const paddingTopPercent = (gridPadding.top / containerHeight) * 100;
        const chartAreaPercent = (chartAreaHeight / containerHeight) * 100;

        const columnTopInChartArea = (index / totalItems) * chartAreaPercent;
        const columnHeightInChartArea = (1 / totalItems) * chartAreaPercent;

        const columnTopPercent = paddingTopPercent + columnTopInChartArea;
        const columnHeightPercent = columnHeightInChartArea;
        const columnCenterPercent = columnTopPercent + columnHeightPercent / 2;

        const clipHeightPercent = columnHeightPercent;
        const clipTopPercent = columnCenterPercent - clipHeightPercent / 2;
        const clipBottomPercent = 100 - (clipTopPercent + clipHeightPercent);

        return {
          '--clip-top': `${clipTopPercent}%`,
          '--clip-bottom': `${clipBottomPercent}%`,
        } as React.CSSProperties;
      }

      const canvasHeightPercent =
        containerHeight && canvasHeight
          ? (canvasHeight / containerHeight) * 100
          : 85;

      if (!containerWidth) {
        const columnLeftPercent = (index / totalItems) * 100;
        const columnWidthPercent = (1 / totalItems) * 100;
        const columnCenterPercent = columnLeftPercent + columnWidthPercent / 2;
        const clipWidthPercent = columnWidthPercent;
        const clipLeftPercent = columnCenterPercent - clipWidthPercent / 2;
        const clipRightPercent = 100 - (clipLeftPercent + clipWidthPercent);

        return {
          '--clip-left': `${clipLeftPercent}%`,
          '--clip-right': `${clipRightPercent}%`,
          '--chart-height-percent': `${canvasHeightPercent}%`,
        } as React.CSSProperties;
      }

      const totalPadding = gridPadding.left + gridPadding.right;
      const chartAreaWidth = containerWidth - totalPadding;
      const paddingLeftPercent = (gridPadding.left / containerWidth) * 100;
      const chartAreaPercent = (chartAreaWidth / containerWidth) * 100;

      const columnLeftInChartArea = (index / totalItems) * chartAreaPercent;
      const columnWidthInChartArea = (1 / totalItems) * chartAreaPercent;

      const columnLeftPercent = paddingLeftPercent + columnLeftInChartArea;
      const columnWidthPercent = columnWidthInChartArea;
      const columnCenterPercent = columnLeftPercent + columnWidthPercent / 2;

      const clipWidthPercent = columnWidthPercent;
      const clipLeftPercent = columnCenterPercent - clipWidthPercent / 2;
      const clipRightPercent = 100 - (clipLeftPercent + clipWidthPercent);

      return {
        '--clip-left': `${clipLeftPercent}%`,
        '--clip-right': `${clipRightPercent}%`,
        '--chart-height-percent': `${canvasHeightPercent}%`,
      } as React.CSSProperties;
    },
    [
      labelsLength,
      gridPadding,
      containerWidth,
      containerHeight,
      canvasHeight,
      isHorizontal,
    ],
  );

  return {
    containerRef,
    canvasHeight,
    getColumnLiftStyle,
  };
};
