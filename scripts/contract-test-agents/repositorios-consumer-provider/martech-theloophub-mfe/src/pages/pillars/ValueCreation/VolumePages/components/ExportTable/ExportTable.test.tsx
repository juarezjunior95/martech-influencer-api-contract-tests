import { render, screen } from '@testing-library/react';

import { ExportTable } from './ExportTable';

jest.mock('components', () => ({
  Table: ({
    data,
    columnDefsConfig,
    headerHeight,
    groupHeaderHeight,
    getRowHeight,
    style,
    dataTestId,
  }: any) => (
    <div
      data-testid={dataTestId ?? 'table-component'}
      data-header-height={headerHeight}
      data-group-header-height={groupHeaderHeight}
      data-row-height={getRowHeight ? getRowHeight() : undefined}
    >
      <div data-testid="table-data">{JSON.stringify(data)}</div>
      <div data-testid="table-config">{JSON.stringify(columnDefsConfig)}</div>
      <div data-testid="table-style">{JSON.stringify(style)}</div>
    </div>
  ),
}));

jest.mock('./config', () => ({
  tableConfigs: {
    portfolio: { minWidth: 148 },
    priorities: { minWidth: 148 },
    growth_levers: { minWidth: 148 },
    brands: { minWidth: 148 },
    mtd: {},
    l3m: {},
    ytd: {},
  },
}));

jest.mock('./ExportTable.styles', () => ({
  StyledExportTable: { border: '1px solid #1414141f' },
}));

describe('ExportTable Component', () => {
  const mockData = {
    header: [
      { id: 'portfolio', title: 'Portfolio' },
      { id: 'mtd', title: 'MTD' },
    ],
    rows: [
      [
        { portfolio: { value: 'Row 1' }, mtd: { value: '100' } },
        { portfolio: { value: 'Row 2' }, mtd: { value: '200' } },
      ],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render Table component with data', () => {
      render(<ExportTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toBeInTheDocument();
    });

    it('should pass data prop to Table component', () => {
      render(<ExportTable data={mockData} />);

      const tableData = screen.getByTestId('table-data');
      expect(tableData).toHaveTextContent(JSON.stringify(mockData));
    });

    it('should pass columnDefsConfig to Table component', () => {
      render(<ExportTable data={mockData} />);

      const tableConfig = screen.getByTestId('table-config');
      expect(tableConfig).toBeInTheDocument();
      expect(tableConfig.textContent).toContain('portfolio');
    });

    it('should pass style to Table component', () => {
      render(<ExportTable data={mockData} />);

      const tableStyle = screen.getByTestId('table-style');
      expect(tableStyle).toBeInTheDocument();
      expect(tableStyle.textContent).toContain('border');
    });
  });

  describe('Default Props', () => {
    it('should use default headerHeight of 45', () => {
      render(<ExportTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '45');
    });

    it('should use default rowHeight of 48', () => {
      render(<ExportTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-row-height', '48');
    });

    it('should set groupHeaderHeight to 45', () => {
      render(<ExportTable data={mockData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-group-header-height', '45');
    });
  });

  describe('Custom Props', () => {
    it('should accept custom headerHeight', () => {
      render(<ExportTable data={mockData} headerHeight={40} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '40');
    });

    it('should accept custom rowHeight', () => {
      render(<ExportTable data={mockData} rowHeight={30} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-row-height', '30');
    });

    it('should accept both custom headerHeight and rowHeight', () => {
      render(<ExportTable data={mockData} headerHeight={50} rowHeight={35} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '50');
      expect(table).toHaveAttribute('data-row-height', '35');
    });

    it('should handle headerHeight of 0', () => {
      render(<ExportTable data={mockData} headerHeight={0} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '0');
    });

    it('should handle rowHeight of 0', () => {
      render(<ExportTable data={mockData} rowHeight={0} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-row-height', '0');
    });
  });

  describe('Data Handling', () => {
    it('should render with empty rows', () => {
      const emptyData = {
        header: [{ id: 'col1', title: 'Column 1' }],
        rows: [],
      };

      render(<ExportTable data={emptyData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toBeInTheDocument();
      const tableData = screen.getByTestId('table-data');
      expect(tableData).toHaveTextContent(JSON.stringify(emptyData));
    });

    it('should render with multiple headers', () => {
      const multiHeaderData = {
        header: [
          { id: 'portfolio', title: 'Portfolio' },
          { id: 'priorities', title: 'Priorities' },
          { id: 'mtd', title: 'MTD' },
          { id: 'ytd', title: 'YTD' },
        ],
        rows: [
          [
            {
              portfolio: { value: 'Data1' },
              priorities: { value: 'Data2' },
              mtd: { value: '100' },
              ytd: { value: '200' },
            },
          ],
        ],
      };

      render(<ExportTable data={multiHeaderData} />);

      const tableData = screen.getByTestId('table-data');
      expect(tableData).toHaveTextContent(JSON.stringify(multiHeaderData));
    });

    it('should render with complex row data', () => {
      const complexData = {
        header: [
          { id: 'portfolio', title: 'Portfolio', subtitle: 'Subtitle' },
          { id: 'mtd', title: 'MTD', tooltip: true },
        ],
        rows: [
          [
            {
              portfolio: {
                value: 'Portfolio 1',
                prefix: '$',
                unitMeasure: 'USD',
              },
              mtd: { value: 100, variation: 10, variationDirection: 'up' },
            },
          ],
        ],
      };

      render(<ExportTable data={complexData} />);

      const tableData = screen.getByTestId('table-data');
      expect(tableData).toHaveTextContent(JSON.stringify(complexData));
    });

    it('should render with nested row groups', () => {
      const nestedData = {
        header: [
          { id: 'portfolio', title: 'Portfolio' },
          { id: 'mtd', title: 'MTD' },
        ],
        rows: [
          [
            { portfolio: { value: 'Group 1' }, mtd: { value: '100' } },
            { portfolio: { value: 'Group 1 Child' }, mtd: { value: '50' } },
          ],
          [
            { portfolio: { value: 'Group 2' }, mtd: { value: '200' } },
            { portfolio: { value: 'Group 2 Child' }, mtd: { value: '150' } },
          ],
        ],
      };

      render(<ExportTable data={nestedData} />);

      const tableData = screen.getByTestId('table-data');
      expect(tableData).toHaveTextContent(JSON.stringify(nestedData));
    });
  });

  describe('Edge Cases', () => {
    it('should render with very large headerHeight', () => {
      render(<ExportTable data={mockData} headerHeight={1000} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '1000');
    });

    it('should render with very large rowHeight', () => {
      render(<ExportTable data={mockData} rowHeight={500} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-row-height', '500');
    });

    it('should render with minimal data structure', () => {
      const minimalData = {
        header: [],
        rows: [],
      };

      render(<ExportTable data={minimalData} />);

      const table = screen.getByTestId('table-component');
      expect(table).toBeInTheDocument();
    });

    it('should render with single header and single row', () => {
      const singleData = {
        header: [{ id: 'col1', title: 'Column 1' }],
        rows: [[{ col1: { value: 'Single Value' } }]],
      };

      render(<ExportTable data={singleData} />);

      const tableData = screen.getByTestId('table-data');
      expect(tableData).toHaveTextContent(JSON.stringify(singleData));
    });
  });

  describe('Component Integration', () => {
    it('should pass all required props to Table component', () => {
      render(<ExportTable data={mockData} headerHeight={40} rowHeight={30} />);

      const table = screen.getByTestId('table-component');
      expect(table).toHaveAttribute('data-header-height', '40');
      expect(table).toHaveAttribute('data-group-header-height', '40');
      expect(table).toHaveAttribute('data-row-height', '30');

      const tableData = screen.getByTestId('table-data');
      const tableConfig = screen.getByTestId('table-config');
      const tableStyle = screen.getByTestId('table-style');

      expect(tableData).toBeInTheDocument();
      expect(tableConfig).toBeInTheDocument();
      expect(tableStyle).toBeInTheDocument();
    });

    it('should use tableConfigs from config file', () => {
      render(<ExportTable data={mockData} />);

      const tableConfig = screen.getByTestId('table-config');
      const configData = JSON.parse(tableConfig.textContent || '{}');

      expect(configData).toHaveProperty('portfolio');
      expect(configData).toHaveProperty('priorities');
      expect(configData).toHaveProperty('growth_levers');
      expect(configData).toHaveProperty('brands');
      expect(configData).toHaveProperty('mtd');
      expect(configData).toHaveProperty('l3m');
      expect(configData).toHaveProperty('ytd');
    });

    it('should use StyledExportTable from styles file', () => {
      render(<ExportTable data={mockData} />);

      const tableStyle = screen.getByTestId('table-style');
      const styleData = JSON.parse(tableStyle.textContent || '{}');

      expect(styleData).toHaveProperty('border');
      expect(styleData.border).toBe('1px solid #1414141f');
    });
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid when dataTestId is provided', () => {
      render(<ExportTable data={mockData} dataTestId="custom" />);

      expect(screen.getByTestId('table-custom')).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<ExportTable data={mockData} />);

      expect(screen.queryByTestId('table-custom')).not.toBeInTheDocument();
    });
  });
});
