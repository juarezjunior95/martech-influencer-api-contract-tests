import { render, screen } from '@testing-library/react';

import { BipTable } from './BipTable';

jest.mock('components', () => ({
  Table: ({
    data,
    columnDefsConfig,
    style,
    rowHeight,
  }: {
    data: unknown;
    columnDefsConfig: unknown;
    style: unknown;
    rowHeight: number;
  }) => (
    <div
      data-testid="table"
      data-has-data={!!data}
      data-has-config={!!columnDefsConfig}
      data-has-style={!!style}
      data-row-height={rowHeight}
    />
  ),
}));

jest.mock('./BipTable.styles', () => ({
  StyledBipTableContainer: 'styled-bip-table-container',
}));

describe('BipTable', () => {
  it('forwards data, config and styling to the underlying Table with rowHeight=36', () => {
    const data = { header: [], rows: [] } as any;
    const config = { questions: { headerName: 'Questions' } } as any;

    render(<BipTable data={data} config={config} />);

    const table = screen.getByTestId('table');
    expect(table).toHaveAttribute('data-has-data', 'true');
    expect(table).toHaveAttribute('data-has-config', 'true');
    expect(table).toHaveAttribute('data-has-style', 'true');
    expect(table).toHaveAttribute('data-row-height', '36');
  });
});
