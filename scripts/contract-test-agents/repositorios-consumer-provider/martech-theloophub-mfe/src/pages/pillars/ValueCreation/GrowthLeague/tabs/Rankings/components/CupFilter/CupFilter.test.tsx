import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as hooksModule from 'hooks';

import { createMockUseSubFiltersReturn } from '../../../../__mocks__/mockFactories';
import { CupFilter } from './CupFilter';

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({
    value,
    options,
    onValueChange,
    'data-testid': dataTestId,
  }: {
    value: string;
    options: { label: string; value: string }[];
    onValueChange: (value: string) => void;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId ?? 'segmented-control'} data-value={value}>
      {options?.map((opt) => (
        <button
          key={opt.value}
          data-testid={`segment-${opt.value}`}
          onClick={() => onValueChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('components', () => ({
  Select: ({
    id,
    value,
    onValueChange,
    options,
  }: {
    id: string;
    value: string;
    onValueChange: (op: { label: string; value: string }) => void;
    options: { label: string; value: string }[];
  }) => (
    <select
      data-testid={id}
      value={value}
      onChange={(e) => {
        const selected = options?.find((o) => o.value === e.target.value);
        if (selected) onValueChange(selected);
      }}
    >
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}));

jest.mock(
  'components/SubFilter/components/FilterSkeleton/FilterSkeleton',
  () => ({
    FilterSkeleton: ({
      'data-testid': dataTestId,
    }: {
      'data-testid'?: string;
    }) => <div data-testid={dataTestId ?? 'filter-skeleton'}>Loading...</div>,
  }),
);

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(),
  useSubFilters: jest.fn(),
}));

const mockUseGoogleAnalytics = jest.mocked(hooksModule.useGoogleAnalytics);
const mockUseSubFilters = hooksModule.useSubFilters as jest.Mock;

describe('CupFilter', () => {
  const mockTrackGA = jest.fn();
  const mockSetSubFilterValue = jest.fn();
  const mockLoadSubFilterData = jest.fn();

  const defaultSubFiltersReturn = createMockUseSubFiltersReturn({
    activeSubFilters: {},
    subFiltersData: {
      'gl-competitions': {
        values: [
          { label: 'Mega Brands Cup', value: 'megabrands_cup' },
          {
            label: 'BEES Dashboards',
            value: 'bees_cup',
            divisions: [
              { label: 'Index', value: 'index' },
              { label: 'Maturity', value: 'maturity' },
            ],
          },
        ],
      },
    },
    loadSubFilterData: mockLoadSubFilterData,
    setSubFilterValue: mockSetSubFilterValue,
    subFiltersLoaded: { 'gl-competitions': true },
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseGoogleAnalytics.mockReturnValue(mockTrackGA);
    mockUseSubFilters.mockReturnValue(defaultSubFiltersReturn);
  });

  describe('Rendering', () => {
    it('renders loading skeleton when sub-filters are not loaded yet', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          ...defaultSubFiltersReturn,
          subFiltersLoaded: { 'gl-competitions': false },
        }),
      );

      render(<CupFilter />);

      expect(screen.getByTestId('filter-skeleton')).toBeInTheDocument();
      expect(screen.queryByTestId('cup-filter-select')).not.toBeInTheDocument();
    });

    it('renders Select with cup options when loaded', () => {
      render(<CupFilter />);

      expect(screen.getByTestId('cup-filter-select')).toBeInTheDocument();
      expect(screen.getByText('Mega Brands Cup')).toBeInTheDocument();
      expect(screen.getByText('BEES Dashboards')).toBeInTheDocument();
      expect(screen.queryByTestId('segmented-control')).not.toBeInTheDocument();
    });
  });

  describe('Cup Selection', () => {
    it('calls setSubFilterValue and tracks GA when cup is selected', async () => {
      const user = userEvent.setup();
      render(<CupFilter />);

      await user.selectOptions(
        screen.getByTestId('cup-filter-select'),
        'megabrands_cup',
      );

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'gl-competitions',
        'megabrands_cup',
      );
      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Sub cup',
        event_action: 'Selected',
        event_label: 'megabrands_cup',
      });
    });
  });

  describe('Divisions', () => {
    it('renders SegmentedControl with division options when cup has divisions', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          ...defaultSubFiltersReturn,
          activeSubFilters: { 'gl-competitions': 'bees_cup' },
        }),
      );

      render(<CupFilter />);

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByText('Index')).toBeInTheDocument();
      expect(screen.getByText('Maturity')).toBeInTheDocument();
    });

    it('sets first division as default and allows changing division with GA tracking', async () => {
      const user = userEvent.setup();

      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          ...defaultSubFiltersReturn,
          activeSubFilters: { 'gl-competitions': 'bees_cup' },
        }),
      );

      render(<CupFilter />);

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'gl-competitions_bees_cup',
        'index',
      );

      await user.click(screen.getByTestId('segment-maturity'));

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'gl-competitions_bees_cup',
        'maturity',
      );
      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Sub cup',
        event_action: 'Selected',
        event_label: 'maturity',
      });
    });

    it('clears divisions and shows segmented control correctly when switching cups', () => {
      const { rerender } = render(<CupFilter />);

      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          ...defaultSubFiltersReturn,
          activeSubFilters: { 'gl-competitions': 'bees_cup' },
        }),
      );
      rerender(<CupFilter />);
      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();

      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          ...defaultSubFiltersReturn,
          activeSubFilters: { 'gl-competitions': 'megabrands_cup' },
        }),
      );
      rerender(<CupFilter />);

      expect(mockSetSubFilterValue).toHaveBeenCalledWith(
        'gl-competitions_megabrands_cup',
        '',
      );
    });
  });

  describe('Initial Load', () => {
    it('loads sub-filter data on mount and reflects activeSubFilters values', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          ...defaultSubFiltersReturn,
          activeSubFilters: {
            'gl-competitions': 'megabrands_cup',
            'gl-competitions_bees_cup': 'maturity',
          },
        }),
      );

      render(<CupFilter />);

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(
        'gl-competitions',
        {},
        '',
      );
      const select = screen.getByTestId(
        'cup-filter-select',
      ) as HTMLSelectElement;
      expect(select.value).toBe('megabrands_cup');
    });
  });

  describe('Empty Data', () => {
    it('handles null filter data gracefully', () => {
      mockUseSubFilters.mockReturnValue(
        createMockUseSubFiltersReturn({
          ...defaultSubFiltersReturn,
          subFiltersData: {},
        }),
      );
      render(<CupFilter />);
      expect(screen.getByTestId('cup-filter-select')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('renders and omits custom data-testid based on dataTestId prop', () => {
      const { rerender } = render(<CupFilter dataTestId="custom" />);
      expect(screen.getByTestId('cup-filter-custom')).toBeInTheDocument();

      rerender(<CupFilter />);
      expect(screen.queryByTestId('cup-filter-custom')).not.toBeInTheDocument();
    });
  });
});
