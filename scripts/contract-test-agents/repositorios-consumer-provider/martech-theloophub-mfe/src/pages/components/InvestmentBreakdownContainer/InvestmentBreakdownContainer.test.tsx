import React from 'react';

import { render, screen } from '@testing-library/react';
import { Legend, NoResultsState, Skeleton } from 'components';
import { TableDataType } from 'components/Table/types';
import { WithEmpty } from 'utils/dataEmpty';

jest.mock('contexts', () => ({
  useScopedModal: jest.fn(() => ({ open: mockOpenModal })),
  useModalContext: jest.fn(() => ({
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isOpen: false,
  })),
}));

jest.mock('components/Filter', () => ({
  FILTER_MODAL_NAME: 'filter-modal',
}));

jest.mock('contexts/Modal/ModalContext', () => ({
  useModalContext: jest.fn(() => ({
    openModal: jest.fn(),
    closeModal: jest.fn(),
    isOpen: false,
  })),
  useScopedModal: jest.fn(() => ({ open: jest.fn() })),
}));

import { InvestmentBreakdownContainer } from './InvestmentBreakdownContainer';

const mockOpenModal = jest.fn();
const mockUseFilters = jest.fn(() => ({
  isActiveGlobalZone: false,
  openModal: mockOpenModal,
}));

jest.mock('hooks', () => ({
  useFilters: () => mockUseFilters(),
  useCurrentPage: () => ({ currentPage: 'test-page' }),
  usePageFilterApplied: () => ({
    isGlobalZone: mockUseFilters().isActiveGlobalZone,
  }),
}));

jest.mock('components', () => ({
  Legend: jest.fn(({ dataTestId }) => (
    <div data-testid={dataTestId || 'legend'}>Legend Component</div>
  )),
  NoDataYet: jest.fn(() => <div data-testid="no-data-yet">No Data Yet</div>),
  NoResultsState: jest.fn(({ dataTestId }) => (
    <div data-testid={dataTestId || 'no-results-state'}>No Results State</div>
  )),
  Skeleton: jest.fn(({ 'data-testid': testId }) => (
    <div data-testid={testId || 'skeleton'}>Loading...</div>
  )),
}));

jest.mock(
  './components/InvestmentBreakdownTable/InvestmentBreakdownTable',
  () => ({
    InvestmentBreakdownTable: jest.fn(({ dataTestId }) => (
      <div data-testid={dataTestId || 'investment-breakdown-table'}>
        Investment Breakdown Table
      </div>
    )),
  }),
);

jest.mock('../../constants', () => ({
  LEGEND_CONFIG: [
    { label: 'Megabrands', color: '#E5B611', fontWeight: 'bold' },
    { label: 'Expansion', color: '#C2346A', fontWeight: 'bold' },
    { label: 'Sustain', color: '#2F74AA', fontWeight: 'bold' },
    { label: 'Tail', color: '#4E579F', fontWeight: 'bold' },
  ],
}));

describe('InvestmentBreakdownContainer', () => {
  const mockTableData: WithEmpty<TableDataType> = {
    header: [
      { id: 'brands', title: 'Brands' },
      { id: 'investment', title: 'Investment' },
    ],
    rows: [
      [
        {
          brands: { value: 'Brand A' },
          investment: { value: '100' },
        },
      ],
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFilters.mockReturnValue({
      isActiveGlobalZone: false,
      openModal: mockOpenModal,
    });
  });

  describe('Global Zone State', () => {
    it('should render NoResultsState when isActiveGlobalZone is true', () => {
      mockUseFilters.mockReturnValue({
        isActiveGlobalZone: true,
        openModal: mockOpenModal,
      });

      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={false} />,
      );

      expect(screen.getByTestId('no-results-state')).toBeInTheDocument();
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.queryByTestId('no-data-yet')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('investment-breakdown-table'),
      ).not.toBeInTheDocument();
    });

    it('should pass correct props to NoResultsState', () => {
      mockUseFilters.mockReturnValue({
        isActiveGlobalZone: true,
        openModal: mockOpenModal,
      });

      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={false} />,
      );

      expect(NoResultsState).toHaveBeenCalled();
      const props = (NoResultsState as jest.Mock).mock.calls[0][0];
      expect(props.type).toBe('investmentBreakdown');
      expect(typeof props.openModal).toBe('function');
      expect(props.headerTitleId).toBe(
        'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.noCountrySelectedTitle',
      );
      expect(props.descriptionId).toBe(
        'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.noCountrySelectedDescription',
      );
      expect(props.buttonTextId).toBe(
        'ConnectionsCreativity.ResourceAllocationMedia.InvestmentBreakdownTab.selectACountry',
      );
    });
  });

  describe('Loading State', () => {
    it('should render Skeleton when loading is true', () => {
      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('no-results-state')).not.toBeInTheDocument();
      expect(screen.queryByTestId('no-data-yet')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('investment-breakdown-table'),
      ).not.toBeInTheDocument();
    });

    it('should pass correct props to Skeleton', () => {
      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={true} />,
      );

      expect(Skeleton).toHaveBeenCalledWith(
        expect.objectContaining({
          height: '590px',
          width: '1280px',
          length: 1,
        }),
        expect.anything(),
      );
    });
  });

  describe('Empty Data State', () => {
    it('should render NoDataYet when data is null', () => {
      render(
        <InvestmentBreakdownContainer
          data={null as unknown as WithEmpty<TableDataType>}
          loading={false}
        />,
      );

      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.queryByTestId('no-results-state')).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('investment-breakdown-table'),
      ).not.toBeInTheDocument();
    });

    it('should render NoDataYet when data is undefined', () => {
      render(
        <InvestmentBreakdownContainer
          data={undefined as unknown as WithEmpty<TableDataType>}
          loading={false}
        />,
      );

      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    });

    it('should render NoDataYet when data.empty is true', () => {
      const emptyData: WithEmpty<TableDataType> = {
        ...mockTableData,
        empty: true,
      };

      render(<InvestmentBreakdownContainer data={emptyData} loading={false} />);

      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
      expect(
        screen.queryByTestId('investment-breakdown-table'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Data Rendering', () => {
    it('should render InvestmentBreakdownTable when data is available', () => {
      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={false} />,
      );

      expect(
        screen.getByTestId('investment-breakdown-table'),
      ).toBeInTheDocument();
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.queryByTestId('no-data-yet')).not.toBeInTheDocument();
      expect(screen.queryByTestId('no-results-state')).not.toBeInTheDocument();
    });

    it('should render Legend by default when data is available', () => {
      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={false} />,
      );

      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('should render Legend when legend prop is true', () => {
      render(
        <InvestmentBreakdownContainer
          data={mockTableData}
          loading={false}
          legend={true}
        />,
      );

      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('should not render Legend when legend prop is false', () => {
      render(
        <InvestmentBreakdownContainer
          data={mockTableData}
          loading={false}
          legend={false}
        />,
      );

      expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
      expect(
        screen.getByTestId('investment-breakdown-table'),
      ).toBeInTheDocument();
    });

    it('should pass correct props to Legend', () => {
      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={false} />,
      );

      expect(Legend).toHaveBeenCalledWith(
        expect.objectContaining({
          legendPosition: 'left',
          caption: expect.arrayContaining([
            expect.objectContaining({
              label: 'Megabrands',
              pointStyle: 'roundedThicker',
            }),
            expect.objectContaining({
              label: 'Expansion',
              pointStyle: 'roundedThicker',
            }),
            expect.objectContaining({
              label: 'Sustain',
              pointStyle: 'roundedThicker',
            }),
            expect.objectContaining({
              label: 'Tail',
              pointStyle: 'roundedThicker',
            }),
          ]),
        }),
        expect.anything(),
      );
    });
  });

  describe('State Priority', () => {
    it('should prioritize isActiveGlobalZone over loading state', () => {
      mockUseFilters.mockReturnValue({
        isActiveGlobalZone: true,
        openModal: mockOpenModal,
      });

      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={true} />,
      );

      expect(screen.getByTestId('no-results-state')).toBeInTheDocument();
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
    });

    it('should prioritize isActiveGlobalZone over empty data state', () => {
      mockUseFilters.mockReturnValue({
        isActiveGlobalZone: true,
        openModal: mockOpenModal,
      });

      const emptyData: WithEmpty<TableDataType> = {
        ...mockTableData,
        empty: true,
      };

      render(<InvestmentBreakdownContainer data={emptyData} loading={false} />);

      expect(screen.getByTestId('no-results-state')).toBeInTheDocument();
      expect(screen.queryByTestId('no-data-yet')).not.toBeInTheDocument();
    });

    it('should prioritize loading over empty data state', () => {
      const emptyData: WithEmpty<TableDataType> = {
        ...mockTableData,
        empty: true,
      };

      render(<InvestmentBreakdownContainer data={emptyData} loading={true} />);

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('no-data-yet')).not.toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should transition from loading to data state', () => {
      const { rerender } = render(
        <InvestmentBreakdownContainer data={mockTableData} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
      expect(
        screen.queryByTestId('investment-breakdown-table'),
      ).not.toBeInTheDocument();

      rerender(
        <InvestmentBreakdownContainer data={mockTableData} loading={false} />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(
        screen.getByTestId('investment-breakdown-table'),
      ).toBeInTheDocument();
    });

    it('should transition from loading to empty state', () => {
      const emptyData: WithEmpty<TableDataType> = {
        ...mockTableData,
        empty: true,
      };

      const { rerender } = render(
        <InvestmentBreakdownContainer data={emptyData} loading={true} />,
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();

      rerender(
        <InvestmentBreakdownContainer data={emptyData} loading={false} />,
      );

      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      expect(screen.getByTestId('no-data-yet')).toBeInTheDocument();
    });
  });

  describe('dataTestId', () => {
    it('should pass dataTestId to NoResultsState when in global zone', () => {
      mockUseFilters.mockReturnValue({
        isActiveGlobalZone: true,
        openModal: mockOpenModal,
      });

      render(
        <InvestmentBreakdownContainer
          data={mockTableData}
          loading={false}
          dataTestId="investment"
        />,
      );

      expect(screen.getByTestId('investment-no-results')).toBeInTheDocument();
    });

    it('should pass dataTestId to Skeleton when loading', () => {
      render(
        <InvestmentBreakdownContainer
          data={mockTableData}
          loading={true}
          dataTestId="investment"
        />,
      );

      expect(screen.getByTestId('skeleton-investment')).toBeInTheDocument();
    });

    it('should apply dataTestId to NoDataYet container', () => {
      const emptyData: WithEmpty<TableDataType> = {
        ...mockTableData,
        empty: true,
      };

      render(
        <InvestmentBreakdownContainer
          data={emptyData}
          loading={false}
          dataTestId="investment"
        />,
      );

      expect(screen.getByTestId('no-data-investment')).toBeInTheDocument();
    });

    it('should pass dataTestId to Legend when rendered', () => {
      render(
        <InvestmentBreakdownContainer
          data={mockTableData}
          loading={false}
          dataTestId="investment"
        />,
      );

      expect(screen.getByTestId('investment-legend')).toBeInTheDocument();
    });

    it('should pass dataTestId to InvestmentBreakdownTable when rendered', () => {
      render(
        <InvestmentBreakdownContainer
          data={mockTableData}
          loading={false}
          dataTestId="investment"
        />,
      );

      expect(screen.getByTestId('investment-table')).toBeInTheDocument();
    });

    it('should render without dataTestId when not provided', () => {
      render(
        <InvestmentBreakdownContainer data={mockTableData} loading={false} />,
      );

      expect(screen.getByTestId('legend')).toBeInTheDocument();
      expect(
        screen.getByTestId('investment-breakdown-table'),
      ).toBeInTheDocument();
      expect(screen.queryByTestId('investment-legend')).not.toBeInTheDocument();
      expect(screen.queryByTestId('investment-table')).not.toBeInTheDocument();
    });
  });
});
