import React, { useCallback, useEffect, useMemo, useState } from 'react';

import type { Chart } from 'chart.js';

import { useChartInteraction, useColumnClipPath } from './hooks';
import {
  StyledBoldLegendWrapper,
  StyledChartContainer,
  StyledColumnLiftWrapper,
  StyledColumnMaskOverlay,
  StyledColumnSelectedOverlay,
  StyledCursorTooltip,
  StyledInteractiveColumn,
  StyledInteractiveWrapper,
} from './InteractiveChartWrapper.styles';
import { ClickabilityConfig, InteractiveChartWrapperProps } from './types';

type GlobalWithChartHoveredDebug = typeof globalThis & {
  __chartHoveredIndex?: number | null;
};

type CanvasWithChartJsInstance = HTMLCanvasElement & {
  chart?: Chart;
};

export const InteractiveChartWrapper: React.FC<
  InteractiveChartWrapperProps
> = ({
  children,
  labels,
  disableOverlay = false,
  disableLegendDimming = true,
  fillHeight = false,
  indexAxis = 'x',
  onItemHover,
  onItemSelect,
  chartOptions,
  renderLegend,
  clickability,
  showTooltip = false,
  dataTestId,
}) => {
  const isHorizontal = indexAxis === 'y';

  const isIndexClickable = useCallback(
    (index: number): boolean => {
      const config: ClickabilityConfig = clickability || {};

      if (config.disabledIndexes?.includes(index)) {
        return false;
      }

      if (config.clickableIndexes !== undefined) {
        return config.clickableIndexes.includes(index);
      }

      return config.enabled ?? false;
    },
    [clickability],
  );

  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
  } | null>(null);

  const {
    hoveredIndex,
    selectedIndex,
    handleHover,
    handleClick,
    getItemHoverState,
  } = useChartInteraction({
    onItemHover,
    onItemSelect,
    disableLegendDimming,
  });

  const handleColumnMouseEnter = useCallback(
    (index: number, event: React.MouseEvent) => {
      const clickable = isIndexClickable(index);

      if (clickable) {
        handleHover(index);
        if (showTooltip) {
          setTooltip({
            x: event.clientX,
            y: event.clientY,
            label: Array.isArray(labels[index])
              ? labels[index][0]
              : labels[index],
          });
        }
      }
    },
    [handleHover, isIndexClickable, labels, showTooltip],
  );

  const handleColumnMouseMove = useCallback((event: React.MouseEvent) => {
    setTooltip((prev) =>
      prev ? { ...prev, x: event.clientX, y: event.clientY } : null,
    );
  }, []);

  const handleColumnMouseLeave = useCallback(
    (index: number) => {
      const clickable = isIndexClickable(index);
      if (clickable) handleHover(null);
      setTooltip(null);
    },
    [handleHover, isIndexClickable],
  );

  const gridPadding = useMemo(() => {
    const layoutPadding = chartOptions?.layout?.padding;
    const defaultPadding = 16;

    const numericPadding =
      typeof layoutPadding === 'number' ? layoutPadding : null;
    const objectPadding =
      typeof layoutPadding === 'object' ? layoutPadding : null;

    return {
      left: numericPadding ?? objectPadding?.left ?? defaultPadding,
      right: numericPadding ?? objectPadding?.right ?? defaultPadding,
      top: numericPadding ?? objectPadding?.top ?? defaultPadding,
      bottom: numericPadding ?? objectPadding?.bottom ?? defaultPadding,
    };
  }, [chartOptions]);

  const { containerRef, canvasHeight, getColumnLiftStyle } = useColumnClipPath({
    labelsLength: labels.length,
    gridPadding,
    isHorizontal,
  });

  const getColumnStyle = useCallback(
    (index: number): React.CSSProperties => {
      const totalItems = labels.length;

      if (isHorizontal) {
        return {
          top: `calc(${gridPadding.top}px + (100% - ${gridPadding.top}px - ${gridPadding.bottom}px) * ${index} / ${totalItems})`,
          height: `calc((100% - ${gridPadding.top}px - ${gridPadding.bottom}px) / ${totalItems})`,
          left: `${gridPadding.left}px`,
          right: `calc(${gridPadding.right}px - 16px)`,
        };
      }

      return {
        top: 0,
        bottom: -8,
        left: `calc(${gridPadding.left}px + (100% - ${gridPadding.left}px - ${gridPadding.right}px) * ${index} / ${totalItems})`,
        width: `calc((100% - ${gridPadding.left}px - ${gridPadding.right}px) / ${totalItems})`,
      };
    },
    [labels.length, gridPadding, isHorizontal],
  );

  const shouldRenderOverlays = !disableOverlay && labels.length > 0;

  const renderInteractiveColumns = () => {
    if (!shouldRenderOverlays) return null;

    return labels.map((label, index) => {
      const style = getColumnStyle(index);
      const clickable = isIndexClickable(index);

      return (
        <StyledInteractiveColumn
          key={`interactive-${label}-${index}`}
          style={{
            ...style,
            cursor: clickable ? 'pointer' : 'default',
          }}
          onMouseEnter={(e) => handleColumnMouseEnter(index, e)}
          onMouseMove={handleColumnMouseMove}
          onMouseLeave={() => handleColumnMouseLeave(index)}
          onClick={() => clickable && handleClick(index)}
          data-testid={dataTestId ? `${dataTestId}-column-${index}` : undefined}
          data-clickable={clickable}
        />
      );
    });
  };

  const interactionContext = {
    getItemHoverState,
    hoveredIndex,
    selectedIndex,
  };

  (globalThis as GlobalWithChartHoveredDebug).__chartHoveredIndex =
    hoveredIndex;

  useEffect(() => {
    const chartContainer = document.querySelector(
      '[data-testid="interactive-chart-container"]',
    );
    if (!chartContainer) return;

    const canvas = chartContainer.querySelector('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) return;

    const chartInstance = (canvas as CanvasWithChartJsInstance).chart;
    if (chartInstance) {
      chartInstance.update('none');
    }
  }, [hoveredIndex]);

  return (
    <StyledInteractiveWrapper
      ref={containerRef}
      fillHeight={fillHeight}
      data-testid="interactive-chart-wrapper"
    >
      {renderInteractiveColumns()}
      <StyledChartContainer
        fillHeight={fillHeight}
        data-testid={dataTestId ? `${dataTestId}-container` : undefined}
      >
        {children}
      </StyledChartContainer>

      <StyledColumnSelectedOverlay
        key={`selected-overlay-${selectedIndex}`}
        style={
          typeof selectedIndex === 'number'
            ? getColumnStyle(selectedIndex)
            : undefined
        }
        show={typeof selectedIndex === 'number'}
        data-testid="column-selected-overlay"
      />

      <StyledColumnMaskOverlay
        key={`mask-overlay-${hoveredIndex}`}
        style={
          typeof hoveredIndex === 'number'
            ? getColumnStyle(hoveredIndex)
            : undefined
        }
        show={typeof hoveredIndex === 'number'}
        data-testid="column-mask-overlay"
      />

      <StyledColumnLiftWrapper
        key={`lift-${hoveredIndex}`}
        style={
          typeof hoveredIndex === 'number'
            ? getColumnLiftStyle(hoveredIndex)
            : undefined
        }
        show={typeof hoveredIndex === 'number'}
        isHorizontal={isHorizontal}
        data-testid="column-lift-wrapper"
      >
        <div style={{ height: canvasHeight ?? 'auto' }}>{children}</div>
        <StyledBoldLegendWrapper>
          {renderLegend?.(interactionContext)}
        </StyledBoldLegendWrapper>
      </StyledColumnLiftWrapper>
      {renderLegend?.(interactionContext)}
      {tooltip && (
        <StyledCursorTooltip
          style={{ left: tooltip.x, top: tooltip.y }}
          data-testid={dataTestId ? `${dataTestId}-tooltip` : undefined}
        >
          {tooltip.label}
        </StyledCursorTooltip>
      )}
    </StyledInteractiveWrapper>
  );
};
