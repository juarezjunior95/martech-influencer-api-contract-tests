import { ScriptableScaleContext } from 'chart.js';

import { DataLabelContext } from '../types';
import {
  getBarBorderRadius,
  getBarPadding,
  getBorderRadius,
  getFontConfig,
} from './layoutUtils';

jest.mock('../constants', () => ({
  BORDER_RADIUS: 4,
}));

const tickContext = (label: string | number): ScriptableScaleContext =>
  ({
    chart: {} as ScriptableScaleContext['chart'],
    scale: {} as ScriptableScaleContext['scale'],
    index: 0,
    tick: { label } as ScriptableScaleContext['tick'],
  }) as ScriptableScaleContext;

describe('layoutUtils', () => {
  describe('getBorderRadius', () => {
    it('returns top border radius for positive x-axis value', () => {
      expect(getBorderRadius(10, 'x')).toEqual({
        topLeft: 4,
        topRight: 4,
        bottomLeft: 0,
        bottomRight: 0,
      });
    });

    it('returns bottom border radius for negative x-axis value', () => {
      expect(getBorderRadius(-5, 'x')).toEqual({
        topLeft: 0,
        topRight: 0,
        bottomLeft: 4,
        bottomRight: 4,
      });
    });

    it('returns right border radius for positive y-axis value', () => {
      expect(getBorderRadius(10, 'y')).toEqual({
        topRight: 4,
        bottomRight: 4,
        topLeft: 0,
        bottomLeft: 0,
      });
    });

    it('returns left border radius for negative y-axis value', () => {
      expect(getBorderRadius(-5, 'y')).toEqual({
        topRight: 0,
        bottomRight: 0,
        topLeft: 4,
        bottomLeft: 4,
      });
    });

    it('treats zero as positive', () => {
      expect(getBorderRadius(0, 'x').topLeft).toBe(4);
    });
  });

  describe('getBarBorderRadius', () => {
    it('returns undefined when labelBackgroundColor is null', () => {
      expect(getBarBorderRadius(null)).toBeUndefined();
    });

    it('returns 4 for truthy string', () => {
      expect(getBarBorderRadius('#fff')).toBe(4);
    });

    it('returns callback that yields 4 when label function returns truthy', () => {
      const borderRadius = getBarBorderRadius(() => 'bg');
      expect(
        (borderRadius as (c: DataLabelContext) => number | undefined)(
          {} as DataLabelContext,
        ),
      ).toBe(4);
    });

    it('returns callback that yields undefined when label function returns falsy', () => {
      const borderRadius = getBarBorderRadius(() => null);
      expect(
        (borderRadius as (c: DataLabelContext) => number | undefined)(
          {} as DataLabelContext,
        ),
      ).toBeUndefined();
    });
  });

  describe('getBarPadding', () => {
    const defaultPadding = { top: 2, bottom: 2, left: 4, right: 4 };

    it('returns undefined when labelBackgroundColor is falsy', () => {
      expect(getBarPadding(null)).toBeUndefined();
    });

    it('returns default padding for truthy string', () => {
      expect(getBarPadding('#fff')).toEqual(defaultPadding);
    });

    it('returns callback that yields padding when label function returns truthy', () => {
      const padding = getBarPadding(() => 'bg');
      expect(
        (padding as (c: DataLabelContext) => typeof defaultPadding | undefined)(
          {} as DataLabelContext,
        ),
      ).toEqual(defaultPadding);
    });

    it('returns callback that yields undefined when label function returns falsy', () => {
      const padding = getBarPadding(() => null);
      expect(
        (padding as (c: DataLabelContext) => typeof defaultPadding | undefined)(
          {} as DataLabelContext,
        ),
      ).toBeUndefined();
    });
  });

  describe('getFontConfig', () => {
    it('uses smaller font size for xsmall', () => {
      expect(getFontConfig(tickContext('A'), 'xsmall', []).size).toBe(10);
    });

    it('uses default font size for non-xsmall', () => {
      expect(getFontConfig(tickContext('A'), 'medium', []).size).toBe(12);
    });

    it('sets weight bold when tick label is in highlightLabels', () => {
      expect(getFontConfig(tickContext('Q1'), 'medium', ['Q1']).weight).toBe(
        'bold',
      );
    });

    it('sets weight normal when tick label is not highlighted', () => {
      expect(getFontConfig(tickContext('Q2'), 'medium', ['Q1']).weight).toBe(
        'normal',
      );
    });

    it('coerces tick label to string for highlight comparison', () => {
      expect(getFontConfig(tickContext(2024), 'medium', ['2024']).weight).toBe(
        'bold',
      );
    });
  });
});
