import { AXIS_HEADROOM_MULTIPLIER } from '../drivers.constants';

interface AxisBounds {
  populationMax: number;
  iclMax: number;
}

export const getAxisBounds = (
  populationValues?: number[],
  iclValues?: number[],
): AxisBounds => {
  if (!populationValues?.length || !iclValues?.length) {
    return { populationMax: 0, iclMax: 0 };
  }

  const popMax = Math.max(...populationValues);
  const iclMax = Math.max(...iclValues);

  return {
    populationMax: popMax * AXIS_HEADROOM_MULTIPLIER,
    iclMax: iclMax * AXIS_HEADROOM_MULTIPLIER,
  };
};
