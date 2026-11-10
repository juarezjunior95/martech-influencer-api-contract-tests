import dataFoundations from './dataFoundations';
import dataPrimitives from './dataPrimitives';
import { specificProperty } from './specificProperty';

export const colors = {
  ...dataFoundations,
  ...dataPrimitives,
  specificProperty,
};
