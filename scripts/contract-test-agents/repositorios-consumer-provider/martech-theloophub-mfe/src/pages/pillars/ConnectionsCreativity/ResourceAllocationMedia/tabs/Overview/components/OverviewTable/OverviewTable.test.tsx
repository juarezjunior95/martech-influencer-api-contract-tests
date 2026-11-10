import { render, screen } from '@testing-library/react';
import { TableDataType } from 'components/Table/types';

import { OverviewTable } from './OverviewTable';

jest.mock('components', () => ({
  Table: (props: any) => (
    <div
      data-testid={props.dataTestId ?? 'table-component'}
      data-mock-data={JSON.stringify(props.data)}
    ></div>
  ),
}));

describe('OverviewTable', () => {
  it('renders Table component and passes data correctly', () => {
    const mockData = { header: [], rows: [] } as unknown as TableDataType;

    render(<OverviewTable data={mockData} />);

    const tableMock = screen.getByTestId('table-component');
    const receivedProps = JSON.parse(tableMock.getAttribute('data-mock-data'));

    expect(receivedProps).toEqual(mockData);
  });

  it('renders with custom dataTestId', () => {
    const data = {} as TableDataType;
    render(<OverviewTable data={data} dataTestId="test-overview-table" />);

    screen.getByTestId('test-overview-table');
    expect(screen.queryByTestId('table-component')).not.toBeInTheDocument();
  });

  it('renders with default dataTestId when not provided', () => {
    const data = {} as TableDataType;
    render(<OverviewTable data={data} />);

    screen.getByTestId('table-component');
    expect(screen.queryByTestId('test-overview-table')).not.toBeInTheDocument();
  });
});
