import { transformAgGridData } from './transformAgGridData';

// Polyfill for structuredClone in test environment
if (!globalThis.structuredClone) {
  globalThis.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

jest.mock('utils/getColor', () => ({
  getVariationColor: (direction: string) => direction,
}));

describe('transformAgGridData', () => {
  it('should return empty data when originalData.empty is true', () => {
    const originalData = { empty: true };

    const result = transformAgGridData(originalData);

    expect(result.empty).toBe(true);
    expect(result.header).toEqual([]);
    expect(result.rows).toEqual([]);
  });

  it('should transform columnDefs to headers', () => {
    const originalData = {
      columnDefs: [{ field: 'name', headerName: 'Name' }],
      rowData: [],
    };

    const result = transformAgGridData(originalData);

    expect(result.header).toHaveLength(1);
    expect(result.header[0].id).toBe('name');
    expect(result.header[0].title).toBe('Name');
  });

  it('should transform rowData to grouped rows', () => {
    const originalData = {
      columnDefs: [{ field: 'name', headerName: 'Name' }],
      rowData: [{ name: 'John' }],
    };

    const result = transformAgGridData(originalData);

    expect(result.rows).toBeDefined();
    expect(result.rows.length).toBeGreaterThan(0);
  });

  it('should handle nested column children', () => {
    const originalData = {
      columnDefs: [
        {
          headerName: 'Group',
          children: [{ field: 'name', headerName: 'Name' }],
        },
      ],
      rowData: [],
    };

    const result = transformAgGridData(originalData);

    expect(result.header[0].children).toBeDefined();
  });

  it('should handle empty rowData', () => {
    const originalData = {
      columnDefs: [{ field: 'name', headerName: 'Name' }],
      rowData: [],
    };

    const result = transformAgGridData(originalData);

    expect(result.rows).toEqual([]);
  });

  it('should group rows separated by empty objects', () => {
    const originalData = {
      columnDefs: [{ field: 'name', headerName: 'Name' }],
      rowData: [{ name: 'John' }, {}, { name: 'Jane' }],
    };

    const result = transformAgGridData(originalData);

    expect(result.rows).toBeDefined();
  });

  it('should map sourceTooltip into source tooltip config', () => {
    const originalData = {
      columnDefs: [{ field: 'source', headerName: 'Source' }],
      rowData: [
        {
          source: 'Mix of Providers',
          sourceTooltip:
            'Consumption per capita: IHS & World Bank\nBeer price: Euromonitor, Nielsen',
        },
      ],
    };

    const result = transformAgGridData(originalData);
    const firstRow = result.rows[0][0] as Record<string, any>;

    expect(firstRow.source).toMatchObject({
      value: 'Mix of Providers',
      tooltip:
        'Consumption per capita: IHS & World Bank\nBeer price: Euromonitor, Nielsen',
    });
    expect(firstRow.sourceTooltip).toBeUndefined();
  });
});
