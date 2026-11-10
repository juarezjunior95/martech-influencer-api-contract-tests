import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSubFilters } from 'hooks';

import { CohortFilter } from './CohortFilter';

const mockOnChange = jest.fn();
const mockLoadSubFilterData = jest.fn();
const mockSetSubFilterValue = jest.fn();
const mockSetSubFilterInUse = jest.fn();

const mockSubFiltersData = {
  cohorts: {
    values: [
      { value: 'cohort1', label: 'Cohort 1' },
      { value: 'cohort2', label: 'Cohort 2' },
      { value: 'cohort3', label: 'Cohort 3' },
    ],
  },
};

const mockActiveSubFilters = {
  cohorts: 'All',
};

const mockSubFiltersLoaded = {
  cohorts: false,
};

jest.mock('hooks', () => ({
  useSubFilters: jest.fn(),
}));

jest.mock('components', () => ({
  Select: ({
    id,
    defaultValue,
    value,
    options,
    shape,
    size,
    onValueChange,
    valueLabel,
    chips,
    placeholder,
    clearChips,
    dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'select'}>
      <div data-testid="select-id">{id}</div>
      <div data-testid="select-default-value">{defaultValue}</div>
      <div data-testid="select-value">{value}</div>
      <div data-testid="select-options-count">{options?.length || 0}</div>
      <div data-testid="select-shape">{shape}</div>
      <div data-testid="select-size">{size}</div>
      <div data-testid="select-value-label">{valueLabel}</div>
      <div data-testid="select-chips">{String(chips)}</div>
      <div data-testid="select-placeholder">{placeholder}</div>
      <div data-testid="select-clear-chips">{String(clearChips)}</div>
      <button
        data-testid="select-trigger"
        onClick={() => onValueChange({ value: 'cohort1', label: 'Cohort 1' })}
      >
        Change Value
      </button>
      <button
        data-testid="select-clear-trigger"
        onClick={() => onValueChange({ value: '', label: '' })}
      >
        Clear Value
      </button>
    </div>
  ),
}));

describe('CohortFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useSubFilters as jest.Mock).mockReturnValue({
      activeSubFilters: mockActiveSubFilters,
      subFiltersData: mockSubFiltersData,
      subFiltersLoaded: mockSubFiltersLoaded,
      loadSubFilterData: mockLoadSubFilterData,
      setSubFilterValue: mockSetSubFilterValue,
      setSubFilterInUse: mockSetSubFilterInUse,
      ALL_VALUE: 'All',
    });
  });

  describe('Component Rendering', () => {
    it('renders Select component', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('renders wrapper div with correct style', () => {
      const { container } = render(<CohortFilter onChange={mockOnChange} />);

      const wrapper = container.querySelector('div[style*="min-width"]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveStyle({ minWidth: '200px' });
    });
  });

  describe('Default Props', () => {
    it('uses default defaultValue as empty string', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-default-value')).toHaveTextContent('');
    });

    it('uses default filterCohort as cohorts', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-id')).toHaveTextContent('cohorts');
    });

    it('uses default selectLabel as Select a Cohort', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-value-label')).toHaveTextContent(
        'Select a Cohort',
      );
    });

    it('uses default allowItemRemoval as true', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-clear-chips')).toHaveTextContent(
        'true',
      );
    });
  });

  describe('Custom Props', () => {
    it('uses custom defaultValue', () => {
      render(<CohortFilter onChange={mockOnChange} defaultValue="cohort1" />);

      expect(screen.getByTestId('select-default-value')).toHaveTextContent(
        'cohort1',
      );
    });

    it('uses custom filterCohort', () => {
      render(
        <CohortFilter onChange={mockOnChange} filterCohort="custom-cohorts" />,
      );

      expect(screen.getByTestId('select-id')).toHaveTextContent(
        'custom-cohorts',
      );
    });

    it('uses custom selectLabel', () => {
      render(
        <CohortFilter onChange={mockOnChange} selectLabel="Choose Cohort" />,
      );

      expect(screen.getByTestId('select-value-label')).toHaveTextContent(
        'Choose Cohort',
      );
    });

    it('uses custom labelIsSelected when filter has value', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: { cohorts: 'cohort1' },
        subFiltersData: mockSubFiltersData,
        subFiltersLoaded: mockSubFiltersLoaded,
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(
        <CohortFilter
          onChange={mockOnChange}
          labelIsSelected="Selected Cohort"
        />,
      );

      expect(screen.getByTestId('select-value-label')).toHaveTextContent(
        'Selected Cohort',
      );
    });

    it('uses custom allowItemRemoval as false', () => {
      render(<CohortFilter onChange={mockOnChange} allowItemRemoval={false} />);

      expect(screen.getByTestId('select-clear-chips')).toHaveTextContent(
        'false',
      );
    });

    it('uses custom options when provided', () => {
      const customOptions = [
        {
          group: 'Custom',
          values: [
            { value: 'custom1', label: 'Custom 1' },
            { value: 'custom2', label: 'Custom 2' },
          ],
        },
      ];

      render(<CohortFilter onChange={mockOnChange} options={customOptions} />);

      expect(screen.getByTestId('select-options-count')).toHaveTextContent('1');
    });
  });

  describe('Select Configuration', () => {
    it('passes shape as pill', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-shape')).toHaveTextContent('pill');
    });

    it('passes size as medium', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-size')).toHaveTextContent('medium');
    });

    it('passes chips as true', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-chips')).toHaveTextContent('true');
    });

    it('passes placeholder as empty string', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-placeholder')).toHaveTextContent('');
    });
  });

  describe('SubFilters Integration', () => {
    it('calls loadSubFilterData on mount', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(mockLoadSubFilterData).toHaveBeenCalledWith('cohorts');
    });

    it('calls loadSubFilterData with custom filterCohort', () => {
      render(
        <CohortFilter onChange={mockOnChange} filterCohort="custom-cohorts" />,
      );

      expect(mockLoadSubFilterData).toHaveBeenCalledWith('custom-cohorts');
    });

    it('uses cohorts values from subFiltersData', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-options-count')).toHaveTextContent('3');
    });

    it('handles missing subFiltersData gracefully', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: mockActiveSubFilters,
        subFiltersData: {},
        subFiltersLoaded: mockSubFiltersLoaded,
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-options-count')).toHaveTextContent('0');
    });
  });

  describe('Value Handling', () => {
    it('shows empty value when activeSubFilters is All', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: { cohorts: 'All' },
        subFiltersData: mockSubFiltersData,
        subFiltersLoaded: mockSubFiltersLoaded,
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-value')).toHaveTextContent('');
    });

    it('shows actual value when activeSubFilters is not All', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: { cohorts: 'cohort1' },
        subFiltersData: mockSubFiltersData,
        subFiltersLoaded: mockSubFiltersLoaded,
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-value')).toHaveTextContent('cohort1');
    });

    it('shows selectLabel when value is All', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: { cohorts: 'All' },
        subFiltersData: mockSubFiltersData,
        subFiltersLoaded: mockSubFiltersLoaded,
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-value-label')).toHaveTextContent(
        'Select a Cohort',
      );
    });

    it('shows labelIsSelected when value is not All', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: { cohorts: 'cohort1' },
        subFiltersData: mockSubFiltersData,
        subFiltersLoaded: mockSubFiltersLoaded,
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-value-label')).toHaveTextContent(
        'Cohort',
      );
    });
  });

  describe('Change Handler', () => {
    it('updates subfilter state and notifies parent when value changes', async () => {
      const user = userEvent.setup();

      render(<CohortFilter onChange={mockOnChange} />);

      const trigger = screen.getByTestId('select-trigger');
      await user.click(trigger);

      expect(mockSetSubFilterValue).toHaveBeenCalledWith('cohorts', 'cohort1');
      expect(mockSetSubFilterInUse).toHaveBeenCalledWith('cohorts', true);
      expect(mockOnChange).toHaveBeenCalledWith('cohort1');
    });

    it('clears subfilter state and notifies parent when empty value is selected', async () => {
      const user = userEvent.setup();

      render(<CohortFilter onChange={mockOnChange} />);

      const clearTrigger = screen.getByTestId('select-clear-trigger');
      await user.click(clearTrigger);

      expect(mockSetSubFilterValue).toHaveBeenCalledWith('cohorts', 'All');
      expect(mockSetSubFilterInUse).toHaveBeenCalledWith('cohorts', false);
      expect(mockOnChange).toHaveBeenCalledWith('');
    });
  });

  describe('Initial Load Effect', () => {
    it('calls handleCohortChange when subFilters are loaded', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: mockActiveSubFilters,
        subFiltersData: mockSubFiltersData,
        subFiltersLoaded: { cohorts: true },
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} defaultValue="cohort2" />);

      expect(mockSetSubFilterValue).toHaveBeenCalledWith('cohorts', 'cohort2');
      expect(mockOnChange).toHaveBeenCalledWith('cohort2');
    });

    it('does not call handleCohortChange when subFilters are not loaded', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(mockSetSubFilterValue).not.toHaveBeenCalled();
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('does not call handleCohortChange when cohorts values are empty', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: mockActiveSubFilters,
        subFiltersData: { cohorts: { values: [] } },
        subFiltersLoaded: { cohorts: true },
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} />);

      expect(mockSetSubFilterValue).not.toHaveBeenCalled();
      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('Component Stability', () => {
    it('renders consistently across multiple renders', () => {
      const { rerender } = render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select')).toBeInTheDocument();

      rerender(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('updates when props change', () => {
      const { rerender } = render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-default-value')).toHaveTextContent('');

      rerender(<CohortFilter onChange={mockOnChange} defaultValue="cohort1" />);

      expect(screen.getByTestId('select-default-value')).toHaveTextContent(
        'cohort1',
      );
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined subFiltersData', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: mockActiveSubFilters,
        subFiltersData: undefined,
        subFiltersLoaded: mockSubFiltersLoaded,
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select')).toBeInTheDocument();
      expect(screen.getByTestId('select-options-count')).toHaveTextContent('0');
    });

    it('handles undefined activeSubFilters', () => {
      (useSubFilters as jest.Mock).mockReturnValue({
        activeSubFilters: {},
        subFiltersData: mockSubFiltersData,
        subFiltersLoaded: mockSubFiltersLoaded,
        loadSubFilterData: mockLoadSubFilterData,
        setSubFilterValue: mockSetSubFilterValue,
        setSubFilterInUse: mockSetSubFilterInUse,
        ALL_VALUE: 'All',
      });

      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('handles custom filterCohort in all operations', () => {
      const customFilterName = 'my-custom-cohorts';

      render(
        <CohortFilter
          onChange={mockOnChange}
          filterCohort={customFilterName}
        />,
      );

      expect(mockLoadSubFilterData).toHaveBeenCalledWith(customFilterName);
      expect(screen.getByTestId('select-id')).toHaveTextContent(
        customFilterName,
      );
    });
  });

  describe('Options Priority', () => {
    it('uses custom options when provided instead of subFiltersData', () => {
      const customOptions = [
        {
          group: 'Custom',
          values: [{ value: 'custom1', label: 'Custom 1' }],
        },
      ];

      render(<CohortFilter onChange={mockOnChange} options={customOptions} />);

      expect(screen.getByTestId('select-options-count')).toHaveTextContent('1');
    });

    it('uses subFiltersData when options are not provided', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      expect(screen.getByTestId('select-options-count')).toHaveTextContent('3');
    });
  });

  describe('data-testid', () => {
    it('should render Select with data-testid when provided', () => {
      render(<CohortFilter onChange={mockOnChange} dataTestId="cohort" />);

      expect(screen.getByTestId('cohort-filter-cohort')).toBeInTheDocument();
    });

    it('should not render data-testid on Select when not provided', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      const selectElement = screen.getByTestId('select');
      expect(selectElement).toBeInTheDocument();
      expect(selectElement).toHaveAttribute('data-testid', 'select');
    });

    it('should use custom dataTestId value', () => {
      render(
        <CohortFilter onChange={mockOnChange} dataTestId="custom-filter" />,
      );

      expect(
        screen.getByTestId('custom-filter-filter-cohort'),
      ).toBeInTheDocument();
    });

    it('should follow kebab-case naming convention', () => {
      render(
        <CohortFilter onChange={mockOnChange} dataTestId="my-cohort-filter" />,
      );

      expect(
        screen.getByTestId('my-cohort-filter-filter-cohort'),
      ).toBeInTheDocument();
    });

    it('should propagate dataTestId with correct suffix', () => {
      render(<CohortFilter onChange={mockOnChange} dataTestId="test" />);

      const selectElement = screen.getByTestId('test-filter-cohort');

      expect(selectElement).toBeInTheDocument();
    });

    it('should render without data-testid by default (optional prop)', () => {
      render(<CohortFilter onChange={mockOnChange} />);

      const selectElement = screen.getByTestId('select');
      expect(selectElement).toHaveAttribute('data-testid', 'select');
    });

    it('should work with all other props when dataTestId is provided', () => {
      render(
        <CohortFilter
          onChange={mockOnChange}
          dataTestId="cohort"
          defaultValue="cohort1"
          filterCohort="custom-cohorts"
          selectLabel="Choose"
          labelIsSelected="Selected"
          allowItemRemoval={false}
        />,
      );

      expect(screen.getByTestId('cohort-filter-cohort')).toBeInTheDocument();
      expect(screen.getByTestId('select-id')).toHaveTextContent(
        'custom-cohorts',
      );
    });

    it('should not cause visual changes when dataTestId is added', () => {
      const { container: withoutTestId } = render(
        <CohortFilter onChange={mockOnChange} />,
      );
      const { container: withTestId } = render(
        <CohortFilter onChange={mockOnChange} dataTestId="cohort" />,
      );

      const wrapperWithout = withoutTestId.querySelector(
        'div[style*="min-width"]',
      );
      const wrapperWith = withTestId.querySelector('div[style*="min-width"]');

      expect(wrapperWithout).toHaveStyle({ minWidth: '200px' });
      expect(wrapperWith).toHaveStyle({ minWidth: '200px' });
    });

    it('should handle undefined dataTestId gracefully', () => {
      render(<CohortFilter onChange={mockOnChange} dataTestId={undefined} />);

      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    it('should handle empty string dataTestId gracefully', () => {
      render(<CohortFilter onChange={mockOnChange} dataTestId="" />);

      const selectElement = screen.getByTestId('select');
      expect(selectElement).toHaveAttribute('data-testid', 'select');
    });
  });
});
