import React from 'react';

import { render, screen } from '@testing-library/react';

import { ParticipationBreakdownByCohortSlide } from './ParticipationBreakdownByCohortSlide';

const mockPosBookTableSpy = jest.fn();

jest.mock('pages/components', () => ({
  POSBookTable: (props: {
    loading: boolean;
    dataTestId?: string;
    isExport?: boolean;
    rowHeight?: number;
  }) => {
    mockPosBookTableSpy(props);
    return (
      <div data-testid={props.dataTestId ?? 'pos-book-table'}>
        <span data-testid="pos-loading">{String(props.loading)}</span>
      </div>
    );
  },
}));

jest.mock('./ParticipationBreakdownByCohortSlide.styles', () => ({
  StyledParticipationBreakdownSlideRoot: ({
    children,
    ...rest
  }: {
    children: React.ReactNode;
    'data-testid'?: string;
  }) => <div data-testid={rest['data-testid'] ?? 'slide-root'}>{children}</div>,
  StyledParticipationBreakdownTablePanel: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <div data-testid="table-panel">{children}</div>,
}));

const emptyTableData = {
  header: [],
  rows: [],
};

const mockConfig = {
  columnDefs: [],
} as never;

describe('ParticipationBreakdownByCohortSlide', () => {
  it('renders POSBookTable inside panel', () => {
    render(
      <ParticipationBreakdownByCohortSlide
        loading={false}
        data={emptyTableData}
        config={mockConfig}
        dataTestId="cohort-slide"
      />,
    );

    expect(screen.getByTestId('cohort-slide')).toBeInTheDocument();
    expect(screen.getByTestId('table-panel')).toBeInTheDocument();
    expect(
      screen.getByTestId('cohort-slide-pos-book-table'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pos-loading')).toHaveTextContent('false');
  });

  it('passes loading to POSBookTable', () => {
    render(
      <ParticipationBreakdownByCohortSlide
        loading
        data={emptyTableData}
        config={mockConfig}
        dataTestId="cohort-slide"
      />,
    );

    expect(
      screen.getByTestId('cohort-slide-pos-book-table'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('pos-loading')).toHaveTextContent('true');
  });

  it('forwards default isExport=true and rowHeight=56 and falls back to "pos-book-table" testid when dataTestId is omitted', () => {
    render(
      <ParticipationBreakdownByCohortSlide
        loading={false}
        data={emptyTableData}
        config={mockConfig}
      />,
    );

    expect(mockPosBookTableSpy).toHaveBeenCalledWith(
      expect.objectContaining({ isExport: true, rowHeight: 56 }),
    );
    expect(screen.getByTestId('pos-book-table')).toBeInTheDocument();
  });
});
