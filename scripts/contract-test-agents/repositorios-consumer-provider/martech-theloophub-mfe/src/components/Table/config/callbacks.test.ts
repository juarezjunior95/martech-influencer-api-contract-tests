import { ROW_HEIGHT_EMPTY } from '../constants';
import {
  cellStyle,
  colSpan,
  getRowClass,
  getRowHeight,
  onColumnResized,
  rowSpan,
  tooltipValueGetter,
} from './callbacks';

jest.mock('utils/getColor', () => ({
  getVariationColor: (key: string) => {
    if (key === 'up') return '#00FF00';
    if (key === 'neutral') return '#NEUTRAL';
    return '#FF0000';
  },
}));

describe('callbacks', () => {
  describe('getRowHeight', () => {
    it('should return ROW_HEIGHT_EMPTY when data.isEmpty is true', () => {
      const params: any = { data: { isEmpty: true } };
      const result = getRowHeight(params, 48, null as any);

      expect(result).toBe(ROW_HEIGHT_EMPTY);
    });

    it('should return callbackRowHeight result when provided', () => {
      const params: any = { data: {} };
      const callback = jest.fn(() => 100);
      const result = getRowHeight(params, 48, callback);

      expect(result).toBe(100);
      expect(callback).toHaveBeenCalledWith(params);
    });

    it('should return default rowHeight when no callback', () => {
      const params: any = { data: {} };
      const result = getRowHeight(params, 60, null as any);

      expect(result).toBe(60);
    });
  });

  describe('getRowClass', () => {
    it('should return ag-row-empty when data.isEmpty is true', () => {
      const params = { data: { isEmpty: true } };
      const result = getRowClass(params);

      expect(result).toBe('ag-row-empty');
    });

    it('should return empty string when data.isEmpty is false', () => {
      const params = { data: { isEmpty: false } };
      const result = getRowClass(params);

      expect(result).toBe('');
    });

    it('should return empty string when data is undefined', () => {
      const params = { data: undefined };
      const result = getRowClass(params);

      expect(result).toBe('');
    });
  });

  describe('rowSpan', () => {
    it('should return 1 when merge is undefined', () => {
      const params: any = {
        colDef: { field: 'test', headerComponentParams: {} },
        data: { test: 'value' },
        api: { forEachNode: jest.fn() },
      };

      const result = rowSpan(params);

      expect(result).toBe(1);
    });

    it('should return 1 when merge is false', () => {
      const params: any = {
        colDef: { field: 'test', headerComponentParams: { merge: false } },
        data: { test: 'value' },
        api: { forEachNode: jest.fn() },
      };

      const result = rowSpan(params);

      expect(result).toBe(1);
    });

    it('should calculate span when merge is true', () => {
      const nodes = [
        { data: { test: 'value1' } },
        { data: { test: 'value1' } },
        { data: { test: 'value2' } },
      ];

      const params: any = {
        colDef: { field: 'test', headerComponentParams: { merge: true } },
        data: { test: 'value1' },
        api: {
          forEachNode: (callback: any) => nodes.forEach(callback),
        },
      };

      const result = rowSpan(params);

      expect(result).toBe(2);
    });
  });

  describe('cellStyle', () => {
    it('should return color when variationDirection is provided', () => {
      const params: any = {
        node: { data: { test_config: { variationDirection: 'up' } } },
        colDef: { field: 'test' },
      };

      const result = cellStyle(params);

      expect(result).toEqual({ color: '#00FF00' });
    });

    it('should prefer variationColor over variationDirection', () => {
      const params: any = {
        node: {
          data: {
            test_config: {
              variationColor: 'neutral',
              variationDirection: 'up',
            },
          },
        },
        colDef: { field: 'test' },
      };

      expect(cellStyle(params)).toEqual({ color: '#NEUTRAL' });
    });

    it('should return empty styles when no variationDirection', () => {
      const params: any = {
        node: { data: { test_config: {} } },
        colDef: { field: 'test' },
      };

      const result = cellStyle(params);

      expect(result).toEqual({});
    });

    it('should return empty styles when config is undefined', () => {
      const params: any = {
        node: { data: {} },
        colDef: { field: 'test' },
      };

      const result = cellStyle(params);

      expect(result).toEqual({});
    });
  });

  describe('colSpan', () => {
    it('should return 1 when colSpan is undefined', () => {
      const params: any = {
        data: { test_config: {} },
        colDef: { field: 'test' },
      };

      const result = colSpan(params);

      expect(result).toBe(1);
    });

    it('should return 1 when colSpan is falsy', () => {
      const params: any = {
        data: { test_config: { colSpan: 0 } },
        colDef: { field: 'test' },
      };

      const result = colSpan(params);

      expect(result).toBe(1);
    });

    it('should return colSpan value when provided', () => {
      const params: any = {
        data: { test_config: { colSpan: 3 } },
        colDef: { field: 'test' },
      };

      const result = colSpan(params);

      expect(result).toBe(3);
    });
  });

  describe('tooltipValueGetter', () => {
    it('should return tooltip value when provided', () => {
      const params = {
        data: { test_config: { tooltip: 'Test tooltip' } },
        colDef: { field: 'test' },
      };

      const result = tooltipValueGetter(params);

      expect(result).toBe('Test tooltip');
    });

    it('should return empty string when tooltip is undefined', () => {
      const params = {
        data: { test_config: {} },
        colDef: { field: 'test' },
      };

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });

    it('should return empty string when tooltip is falsy', () => {
      const params = {
        data: { test_config: { tooltip: '' } },
        colDef: { field: 'test' },
      };

      const result = tooltipValueGetter(params);

      expect(result).toBe('');
    });
  });

  describe('onColumnResized', () => {
    it('should set CSS custom properties for cells', () => {
      const mockCell = {
        style: {
          width: '100px',
          left: '50px',
          setProperty: jest.fn(),
        },
      };

      const containerRef: any = {
        current: {
          querySelectorAll: jest.fn(() => [mockCell]),
        },
      };

      const event: any = {};

      onColumnResized(event, containerRef);

      expect(mockCell.style.setProperty).toHaveBeenCalledWith(
        '--width',
        '100px',
      );
      expect(mockCell.style.setProperty).toHaveBeenCalledWith('--left', '50px');
    });

    it('should handle cells without inline styles', () => {
      const mockCell = {
        style: {
          width: null,
          left: null,
          setProperty: jest.fn(),
        },
      };

      const containerRef: any = {
        current: {
          querySelectorAll: jest.fn(() => [mockCell]),
        },
      };

      const event: any = {};

      onColumnResized(event, containerRef);

      expect(mockCell.style.setProperty).not.toHaveBeenCalled();
    });
  });
});
