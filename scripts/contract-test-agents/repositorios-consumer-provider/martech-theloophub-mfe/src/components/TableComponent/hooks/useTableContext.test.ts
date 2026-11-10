import { renderHook } from '@testing-library/react-hooks';

import { TableHeaderType } from '../types';
import { useTableContext } from './useTableContext';

describe('useTableContext', () => {
  const header: TableHeaderType[] = [
    { id: 'name', title: 'Name' },
    {
      id: 'metrics',
      title: 'Metrics',
      children: [
        { id: 'volume', title: 'Volume' },
        { id: 'revenue', title: 'Revenue' },
      ],
    },
  ];

  const flatHeaders: TableHeaderType[] = [
    { id: 'name', title: 'Name' },
    { id: 'volume', title: 'Volume' },
    { id: 'revenue', title: 'Revenue' },
  ];

  describe('findHeaderGroup', () => {
    it('should find header group for child column', () => {
      const { result } = renderHook(() =>
        useTableContext({ header, flatHeaders }),
      );

      const group = result.current.findHeaderGroup('volume');

      expect(group).not.toBeNull();
      expect(group?.id).toBe('metrics');
      expect(group?.title).toBe('Metrics');
    });

    it('should return null for top-level column', () => {
      const { result } = renderHook(() =>
        useTableContext({ header, flatHeaders }),
      );

      const group = result.current.findHeaderGroup('name');

      expect(group).toBeNull();
    });

    it('should return null for non-existent column', () => {
      const { result } = renderHook(() =>
        useTableContext({ header, flatHeaders }),
      );

      const group = result.current.findHeaderGroup('unknown');

      expect(group).toBeNull();
    });
  });

  describe('getRowLabelColumn', () => {
    it('should return first column', () => {
      const { result } = renderHook(() =>
        useTableContext({ header, flatHeaders }),
      );

      const rowLabel = result.current.getRowLabelColumn();

      expect(rowLabel.id).toBe('name');
      expect(rowLabel.title).toBe('Name');
    });

    it('should return default values for empty headers', () => {
      const { result } = renderHook(() =>
        useTableContext({ header: [], flatHeaders: [] }),
      );

      const rowLabel = result.current.getRowLabelColumn();

      expect(rowLabel.id).toBe('column-0');
      expect(rowLabel.title).toBe('');
    });
  });

  describe('buildCellContext', () => {
    it('should build complete context', () => {
      const { result } = renderHook(() =>
        useTableContext({ header, flatHeaders }),
      );

      const cell = {
        value: 1000,
        cellId: 'cell-123',
        clickUrl: 'https://example.com',
      };

      const rowData = {
        name: { value: 'Brazil' },
        volume: { value: 1000 },
        revenue: { value: 5000 },
      };

      const context = result.current.buildCellContext(
        cell,
        'volume',
        'Volume',
        rowData,
        0,
        0,
      );

      expect(context.cellId).toBe('cell-123');
      expect(context.clickUrl).toBe('https://example.com');
      expect(context.rowLabel).toBe('Brazil');
      expect(context.rowLabelColumnId).toBe('name');
      expect(context.rowLabelColumnTitle).toBe('Name');
      expect(context.columnLabel).toBe('Volume');
      expect(context.columnId).toBe('volume');
      expect(context.headerGroupLabel).toBe('Metrics');
      expect(context.headerGroupId).toBe('metrics');
      expect(context.cellValue).toBe(1000);
      expect(context.rowIndex).toBe(0);
      expect(context.groupIndex).toBe(0);
    });

    it('should handle missing optional fields', () => {
      const { result } = renderHook(() =>
        useTableContext({ header, flatHeaders }),
      );

      const cell = { value: 'Test' };
      const rowData = { name: { value: 'Brazil' } };

      const context = result.current.buildCellContext(
        cell,
        'name',
        'Name',
        rowData,
        1,
        2,
      );

      expect(context.cellId).toBeUndefined();
      expect(context.clickUrl).toBeUndefined();
      expect(context.headerGroupLabel).toBeUndefined();
      expect(context.headerGroupId).toBeUndefined();
    });
  });
});
