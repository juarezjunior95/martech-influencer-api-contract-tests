import { render, screen } from '@testing-library/react';

jest.mock('components', () => ({
  Table: ({ data, columnDefsConfig, style, rowHeight, gridOptions }: any) => (
    <div
      data-testid="table"
      data-row-height={rowHeight}
      data-has-style={!!style}
      data-has-config={!!columnDefsConfig}
      data-has-grid-options={!!gridOptions}
    >
      Table - {JSON.stringify(data)}
    </div>
  ),
}));

jest.mock('./config', () => ({
  modalKpiTableConfig: {
    kpis: { headerName: 'KPIs', width: 209 },
    update: { headerName: 'Update Time', width: 209 },
    source: { headerName: 'Source' },
    id: { hide: true },
  },
  modalGridOptions: {
    components: { customAgGridTooltip: () => null },
  },
}));

jest.mock('./ModalTable.styles', () => ({
  StyledModalTableContainer: { background: 'white' },
}));

import { ModalTable } from './ModalTable';

describe('ModalTable', () => {
  const mockData = {
    rows: [
      [
        { id: 1, kpis: 'Test KPI 1', update: '2024-01-01', source: 'Source 1' },
        { id: 2, kpis: 'Test KPI 2', update: '2024-01-02', source: 'Source 2' },
      ],
    ],
  };

  it('should render Table component', () => {
    render(<ModalTable data={mockData as any} />);

    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  it('should pass data to Table', () => {
    render(<ModalTable data={mockData as any} />);

    const table = screen.getByTestId('table');
    expect(table.textContent).toContain('Test KPI 1');
  });

  it('should pass rowHeight of 40 to Table', () => {
    render(<ModalTable data={mockData as any} />);

    const table = screen.getByTestId('table');
    expect(table).toHaveAttribute('data-row-height', '40');
  });

  it('should pass columnDefsConfig to Table', () => {
    render(<ModalTable data={mockData as any} />);

    const table = screen.getByTestId('table');
    expect(table).toHaveAttribute('data-has-config', 'true');
  });

  it('should pass style to Table', () => {
    render(<ModalTable data={mockData as any} />);

    const table = screen.getByTestId('table');
    expect(table).toHaveAttribute('data-has-style', 'true');
  });

  it('should pass gridOptions to Table', () => {
    render(<ModalTable data={mockData as any} />);

    const table = screen.getByTestId('table');
    expect(table).toHaveAttribute('data-has-grid-options', 'true');
  });
});
