import React from 'react';

import { render, screen } from '@testing-library/react';
import type { TableDataType } from 'components/TableComponent';

import { AudienceTargetingError } from '../../../../constants';
import { PARTICIPATION_BREAKDOWN_BRAND_PALETTE } from './constants';
import { ParticipationBreakdown } from './ParticipationBreakdown';

const mockTableData = {
  header: [{ id: 'segment', title: '' }],
  rows: [
    [
      {
        segment: { value: 'Male' },
      },
    ],
  ],
} as TableDataType;

const mockDataTable = jest.fn();

jest.mock('react-intl', () => ({
  useIntl: () => ({
    formatMessage: ({ id }: { id: string }) =>
      id ===
      'Consumer.AudienceTargeting.Definition.ParticipationBreakdown.title'
        ? 'Participation Breakdown'
        : id,
  }),
}));

jest.mock('components', () => ({
  Alert: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'alert'} />
  ),
  ResponsiveBasicContainer: ({
    children,
    dataTestId,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
  }) => <div data-testid={dataTestId ?? 'basic-container'}>{children}</div>,
  Skeleton: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'skeleton'} role="progressbar" />
  ),
}));

jest.mock('hooks', () => ({
  usePageFilterApplied: () => ({
    applied: { audience_targeting_brands_comp: 'comp-1' },
  }),
  usePageFilterData: () => ({
    dataFilters: {},
  }),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: () => ({
      getOptions: () => [],
    }),
  },
}));

jest.mock('components/TableComponent', () => ({
  DataTable: (props: { dataTestId?: string; data?: TableDataType }) => {
    mockDataTable(props);
    return <div data-testid={props.dataTestId ?? 'data-table'} />;
  },
}));

jest.mock('./ParticipationBreakdown.styles', () => ({
  PARTICIPATION_BREAKDOWN_CONTENT_HEIGHT: '600px',
  PARTICIPATION_BREAKDOWN_TABLE_TEST_ID: 'participation-breakdown-inner-table',
  StyledOverviewContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="styled-overview-container">{children}</div>
  ),
}));

jest.mock('../../../../components', () => ({
  NoDataAvailable: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId ?? 'no-data-available'} />
  ),
  TooltipContent: () => null,
}));

const defaultProps = {
  data: mockTableData,
  highlightedItems: ['Female'] as (string | number)[],
  error: null,
};

describe('ParticipationBreakdown', () => {
  beforeEach(() => {
    mockDataTable.mockClear();
  });

  it('renders DataTable when data is provided and not loading', () => {
    render(
      <ParticipationBreakdown
        {...defaultProps}
        dataTestId="participation-breakdown"
      />,
    );

    expect(
      screen.getByTestId('participation-breakdown-inner-table'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('participation-breakdown-table-loading-skeleton'),
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('no-data-available')).not.toBeInTheDocument();
  });

  it('renders Skeleton when loading is true', () => {
    render(
      <ParticipationBreakdown
        {...defaultProps}
        dataTestId="participation-breakdown"
        isLoading
      />,
    );

    expect(
      screen.getByTestId('participation-breakdown-table-loading-skeleton'),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('participation-breakdown-table'),
    ).not.toBeInTheDocument();
  });

  it('renders NoDataAvailable when data is null and not loading', () => {
    render(
      <ParticipationBreakdown
        data={null}
        highlightedItems={[]}
        error={null}
        dataTestId="participation-breakdown"
      />,
    );

    expect(screen.getByTestId('participation-breakdown')).toBeInTheDocument();
    expect(
      screen.queryByTestId('participation-breakdown-table'),
    ).not.toBeInTheDocument();
  });

  it('renders DataTable when generic error is provided and data exists', () => {
    render(
      <ParticipationBreakdown
        {...defaultProps}
        error={new Error('BFF error')}
        dataTestId="participation-breakdown"
      />,
    );

    expect(screen.getByTestId('participation-breakdown')).toBeInTheDocument();
    expect(
      screen.getByTestId('participation-breakdown-inner-table'),
    ).toBeInTheDocument();
  });

  it('uses fallback data-testids when dataTestId is omitted', () => {
    render(
      <ParticipationBreakdown
        data={null}
        highlightedItems={[]}
        isLoading
        error={null}
      />,
    );

    expect(
      screen.getByTestId('loading-skeleton-participation-breakdown'),
    ).toBeInTheDocument();
  });

  it('renders NoDataAvailable without dataTestId when data is null', () => {
    render(
      <ParticipationBreakdown data={null} highlightedItems={[]} error={null} />,
    );

    expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
  });

  it('renders competitor alert and keeps table visible when competitor has no data', () => {
    render(
      <ParticipationBreakdown
        {...defaultProps}
        dataTestId="participation-breakdown"
        error={new Error(AudienceTargetingError.CompetitorWithoutData)}
      />,
    );

    expect(
      screen.getByTestId('participation-breakdown-competitor-without-data'),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('participation-breakdown-inner-table'),
    ).toBeInTheDocument();
  });

  it('forwards table data with brand colors applied to brand columns', () => {
    const dataWithBrandColumns: TableDataType = {
      header: [
        { id: 'segment', title: '' },
        {
          id: 'beer',
          title: 'Beer',
          children: [{ id: 'beer_volume', title: 'Volume' }],
        },
      ],
      rows: [[{ segment: { value: 'Male' } }]],
    };

    render(
      <ParticipationBreakdown
        data={dataWithBrandColumns}
        highlightedItems={[]}
        error={null}
        dataTestId="participation-breakdown"
      />,
    );

    const lastCall = mockDataTable.mock.calls.at(-1)?.[0] as {
      data: TableDataType;
    };
    expect(lastCall.data.header[1].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[0],
    );
    expect(lastCall.data.header[0].color).toBeUndefined();
  });

  it('propagates brand color to Volume sub-column and centers Index sub-column alignment', () => {
    const dataWithSubColumns: TableDataType = {
      header: [
        { id: 'segment', title: '' },
        {
          id: 'beer',
          title: 'Beer',
          children: [
            { id: 'beer_volume', title: 'Volume' },
            { id: 'beer_index', title: 'Index' },
          ],
        },
      ],
      rows: [[{ segment: { value: 'Male' } }]],
    };

    render(
      <ParticipationBreakdown
        data={dataWithSubColumns}
        highlightedItems={[]}
        error={null}
        dataTestId="participation-breakdown"
      />,
    );

    const lastCall = mockDataTable.mock.calls.at(-1)?.[0] as {
      data: TableDataType;
    };
    const brandHeader = lastCall.data.header[1];
    expect(brandHeader.children?.[0].color).toBe(
      PARTICIPATION_BREAKDOWN_BRAND_PALETTE[0],
    );
    expect(brandHeader.children?.[0].align).toBe('right');
    expect(brandHeader.children?.[1].color).toBeUndefined();
    expect(brandHeader.children?.[1].align).toBe('center');
  });
});
