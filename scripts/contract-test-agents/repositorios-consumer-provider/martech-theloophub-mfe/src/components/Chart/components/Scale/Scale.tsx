import { useMemo } from 'react';

import { Chart as ChartJS } from 'chart.js';

import {
  StyledScale,
  StyledScaleContainer,
  StyledScaleItem,
  StyledScaleItemLine,
} from './Scale.styles';

interface ScaleProps {
  chart: ChartJS<'bar'>;
  top?: string;
  left?: string;
  height?: number;
  hasVariation?: boolean;
  dataTestId?: string;
}

interface ChartTick {
  label?: string;
  value: number;
}
const offset = {
  HEIGHT_OFFSET: 113,
  HEIGHT_OFFSET_WITH_VARIATION: 165,
};

export const Scale = ({
  chart,
  top,
  left,
  height,
  hasVariation,
  dataTestId,
}: ScaleProps) => {
  const yTicks = useMemo(() => {
    if (!chart?.scales?.y?.ticks) return [];
    return (chart.scales.y.ticks as ChartTick[]).map(
      (tick) => tick.label ?? tick.value,
    );
  }, [chart]);

  return (
    <StyledScaleContainer
      style={{
        height: `${height + (hasVariation ? offset.HEIGHT_OFFSET_WITH_VARIATION : offset.HEIGHT_OFFSET)}px`,
      }}
      data-testid={dataTestId}
    >
      <StyledScale style={{ left, height: `${height}px`, top }}>
        {yTicks.map((tick, i) => (
          <StyledScaleItem
            key={`${tick}-${i}`}
            data-testid={dataTestId ? `${dataTestId}-tick-${i}` : undefined}
          >
            <span style={{ flex: 1 }}>{tick}</span>
            <StyledScaleItemLine />
          </StyledScaleItem>
        ))}
      </StyledScale>
    </StyledScaleContainer>
  );
};
