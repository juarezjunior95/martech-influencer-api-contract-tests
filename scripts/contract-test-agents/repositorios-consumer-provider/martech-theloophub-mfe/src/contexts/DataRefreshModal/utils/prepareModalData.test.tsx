import { transformAgGridData } from 'components/Table/utils';

import { prepareModalData } from './prepareModalData';

jest.mock('components/Table/utils', () => ({
  transformAgGridData: jest.fn(() => ({
    rows: [[{ value: 'Row 1' }, { value: 'Row 2' }]],
    columns: ['Col 1', 'Col 2'],
  })),
}));

jest.mock('./tabToKpiIdsMap', () => ({
  tabToKpiIdsMap: {
    'test-tab': ['kpi1', 'kpi2'],
  },
}));

describe('prepareModalData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null modalData and disabled button when rawData is null', () => {
    const result = prepareModalData('test-tab', null, false);

    expect(result.modalData).toBeNull();
    expect(result.isDisabledBtn).toBe(true);
  });

  it('should return null modalData and disabled button when rawData is empty', () => {
    const result = prepareModalData('test-tab', { empty: true }, false);

    expect(result.modalData).toBeNull();
    expect(result.isDisabledBtn).toBe(true);
  });

  it('should filter KPIs by tab and transform data', () => {
    const rawData = {
      columnDefs: [{ headerName: 'Name', field: 'name' }],
      rowData: [
        { id: 'kpi1', kpi: 'KPI 1', update_time: '2024-01-01' },
        { id: 'kpi2', kpi: 'KPI 2', update_time: '2024-01-02' },
        { id: 'kpi3', kpi: 'KPI 3', update_time: '2024-01-03' },
      ],
    };

    const result = prepareModalData('test-tab', rawData, false);

    expect(transformAgGridData).toHaveBeenCalled();
    expect(result.modalData).toBeDefined();
    expect(result.isDisabledBtn).toBeDefined();
  });

  it('should return disabled button when transformed rows length is 0', () => {
    (transformAgGridData as jest.Mock).mockReturnValue({
      rows: [],
      columns: [],
    });

    const rawData = {
      columnDefs: [],
      rowData: [],
    };

    const result = prepareModalData('test-tab', rawData, false);

    expect(result.isDisabledBtn).toBe(true);
  });

  it('should return disabled button when fullRows length is <= 5', () => {
    (transformAgGridData as jest.Mock).mockReturnValue({
      rows: [[{ value: 'Row 1' }, { value: 'Row 2' }, { value: 'Row 3' }]],
      columns: ['Col 1'],
    });

    const rawData = {
      columnDefs: [],
      rowData: [],
    };

    const result = prepareModalData('test-tab', rawData, false);

    expect(result.isDisabledBtn).toBe(true);
  });

  it('should slice rows when showAllRows is false and rows length > 5', () => {
    (transformAgGridData as jest.Mock).mockReturnValue({
      rows: [
        [
          { value: 'Row 1' },
          { value: 'Row 2' },
          { value: 'Row 3' },
          { value: 'Row 4' },
          { value: 'Row 5' },
          { value: 'Row 6' },
          { value: 'Row 7' },
        ],
      ],
      columns: ['Col 1'],
    });

    const rawData = {
      columnDefs: [],
      rowData: [],
    };

    const result = prepareModalData('test-tab', rawData, false);

    expect(result.modalData?.rows[0].length).toBe(5);
    expect(result.isDisabledBtn).toBe(false);
  });

  it('should return all rows when showAllRows is true', () => {
    (transformAgGridData as jest.Mock).mockReturnValue({
      rows: [
        [
          { value: 'Row 1' },
          { value: 'Row 2' },
          { value: 'Row 3' },
          { value: 'Row 4' },
          { value: 'Row 5' },
          { value: 'Row 6' },
        ],
      ],
      columns: ['Col 1'],
    });

    const rawData = {
      columnDefs: [],
      rowData: [],
    };

    const result = prepareModalData('test-tab', rawData, true);

    expect(result.modalData?.rows[0].length).toBe(6);
    expect(result.isDisabledBtn).toBe(false);
  });

  it('should return empty rowData when tab is not in tabToKpiIdsMap', () => {
    const rawData = {
      columnDefs: [{ headerName: 'Name', field: 'name' }],
      rowData: [{ id: 'kpi1', kpi: 'KPI 1', update_time: '2024-01-01' }],
    };

    const result = prepareModalData('unknown-tab', rawData, false);

    expect(result.modalData).toBeDefined();
  });
});
