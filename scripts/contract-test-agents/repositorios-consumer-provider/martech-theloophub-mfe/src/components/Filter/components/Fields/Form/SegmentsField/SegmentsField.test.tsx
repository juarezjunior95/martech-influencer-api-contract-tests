jest.mock('components/Form', () => ({
  ChipsSelect: ({
    dataTestId,
    value,
    onChange,
    options,
  }: {
    dataTestId?: string;
    value: string;
    onChange: (option: { value: string; label: string }) => void;
    options: Array<{ value: string; label: string }>;
  }) => (
    <div data-testid={dataTestId || 'chips-select'} data-value={value}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt)}
          data-testid={`option-${opt.value}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(),
    })),
  },
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';

import { SegmentsField } from './SegmentsField';

describe('SegmentsField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;
  let mockGetOptions: jest.Mock;

  const mockOptions = [
    { value: 'beer', label: 'Beer' },
    { value: 'beyond-beer', label: 'Beyond Beer' },
    { value: 'beer-beyond-beer', label: 'Beer + Beyond Beer' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn().mockReturnValue('beer');
    mockGetOptions = jest.fn().mockReturnValue(mockOptions);

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {
        segments: {
          values: mockOptions,
        },
      },
    });
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: mockGetOptions,
    });
  });

  describe('rendering', () => {
    it('should render ChipsSelect component', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });

    it('should render all options as buttons', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('option-beer')).toBeInTheDocument();
      expect(screen.getByTestId('option-beyond-beer')).toBeInTheDocument();
      expect(screen.getByTestId('option-beer-beyond-beer')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const control = screen.getByTestId('chips-select');
      expect(control).toHaveAttribute('data-value', 'beer');
    });

    it('should display correct option labels', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByText('Beer')).toBeInTheDocument();
      expect(screen.getByText('Beyond Beer')).toBeInTheDocument();
      expect(screen.getByText('Beer + Beyond Beer')).toBeInTheDocument();
    });
  });

  describe('data loading', () => {
    it('should load options from FilterDataAccessor', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(FilterDataAccessor.getInstance).toHaveBeenCalled();
      expect(mockGetOptions).toHaveBeenCalledWith(
        'segments',
        {
          segments: {
            values: mockOptions,
          },
        },
        {},
      );
    });

    it('should use dataFilters from usePageFilterData', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(usePageFilterData).toHaveBeenCalledWith('test-page');
    });

    it('should handle empty options array', () => {
      mockGetOptions.mockReturnValue([]);

      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const buttons = screen.queryAllByRole('button');
      expect(buttons.length).toBe(0);
    });

    it('should memoize options to prevent unnecessary recalculations', () => {
      const { rerender } = render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetOptions).toHaveBeenCalledTimes(1);

      rerender(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetOptions).toHaveBeenCalledTimes(1);
    });
  });

  describe('value change', () => {
    it('should call onValueChange when option is clicked', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const beyondBeerOption = screen.getByTestId('option-beyond-beer');
      fireEvent.click(beyondBeerOption);

      expect(mockOnValueChange).toHaveBeenCalledWith('segments', {
        value: 'beyond-beer',
        label: 'Beyond Beer',
      });
    });

    it('should track Google Analytics event when value changes', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const beerBeyondBeerOption = screen.getByTestId(
        'option-beer-beyond-beer',
      );
      fireEvent.click(beerBeyondBeerOption);

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Segments Select',
        event_action: 'Select',
        event_label: 'beer-beyond-beer',
      });
    });

    it('should not call onValueChange when option value is undefined', () => {
      mockGetOptions.mockReturnValue([
        { value: undefined, label: 'Invalid' },
        ...mockOptions,
      ]);

      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const invalidOption = screen.getByTestId('option-undefined');
      fireEvent.click(invalidOption);

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });

    it('should not call onValueChange when option value is null', () => {
      mockGetOptions.mockReturnValue([
        { value: null, label: 'Invalid' },
        ...mockOptions,
      ]);

      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const invalidOption = screen.getByTestId('option-null');
      fireEvent.click(invalidOption);

      expect(mockOnValueChange).not.toHaveBeenCalled();
    });
  });

  describe('data-testid rendering', () => {
    it('should pass dataTestId to ChipsSelect when provided', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('custom-segments')).toBeInTheDocument();
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-segments"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });
  });

  describe('getCurrentValue integration', () => {
    it('should use getCurrentValue to set initial value', () => {
      mockGetCurrentValue.mockReturnValue('beyond-beer');

      render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(mockGetCurrentValue).toHaveBeenCalledWith('segments');
      const control = screen.getByTestId('chips-select');
      expect(control).toHaveAttribute('data-value', 'beyond-beer');
    });

    it('should update displayed value when getCurrentValue returns different value', () => {
      const { rerender } = render(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toHaveAttribute(
        'data-value',
        'beer',
      );

      mockGetCurrentValue.mockReturnValue('beer-beyond-beer');

      rerender(
        <SegmentsField
          fieldKey="segments"
          pageName="test-page"
          onValueChange={mockOnValueChange}
          getCurrentValue={mockGetCurrentValue}
        />,
      );

      expect(screen.getByTestId('chips-select')).toHaveAttribute(
        'data-value',
        'beer-beyond-beer',
      );
    });
  });
});
