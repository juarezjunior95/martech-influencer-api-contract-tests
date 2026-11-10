import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGoogleAnalytics } from 'hooks';

import { SegmentsQuickFilter } from './SegmentsQuickFilter';

const mockHandleClear = jest.fn();

jest.mock('components/Filter/hooks/useQuickFilter', () => ({
  useQuickFilter: jest.fn(({ getCurrentValue, fieldKey }) => {
    if (getCurrentValue && fieldKey) {
      getCurrentValue(fieldKey);
    }
    return {
      handleClear: mockHandleClear,
      showClearIcon: false,
    };
  }),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      segments: {
        values: [
          { value: 'beer', label: 'Beer' },
          { value: 'beyond-beer', label: 'Beyond Beer' },
          { value: 'beer-beyond-beer', label: 'Beer + Beyond Beer' },
        ],
        default: { value: 'beer', label: 'Beer' },
        enabled: true,
      },
    },
    defaults: {
      segments: { value: 'beer', label: 'Beer' },
    },
  })),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => [
        { value: 'beer', label: 'Beer' },
        { value: 'beyond-beer', label: 'Beyond Beer' },
        { value: 'beer-beyond-beer', label: 'Beer + Beyond Beer' },
      ]),
    })),
  },
}));

jest.mock('components/Form', () => ({
  Select: ({
    dataTestId,
    id,
    value,
    onValueChange,
    clearChips,
    onClearSingle,
  }: {
    dataTestId?: string;
    id: string;
    value: any;
    onValueChange: (value: any) => void;
    clearChips?: boolean;
    onClearSingle?: () => void;
  }) => (
    <div>
      <select
        data-testid={dataTestId || id}
        value={value?.value}
        onChange={(e) =>
          onValueChange({ value: e.target.value, label: e.target.value })
        }
      >
        <option value="beer">Beer</option>
        <option value="beyond-beer">Beyond Beer</option>
        <option value="beer-beyond-beer">Beer + Beyond Beer</option>
      </select>
      {clearChips && onClearSingle && (
        <button
          data-testid={`${dataTestId || id}-clear-button`}
          onClick={onClearSingle}
        />
      )}
    </div>
  ),
}));

describe('SegmentsQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({
    value: 'beer',
    label: 'Beer',
  }));

  const defaultProps = {
    fieldKey: 'segments',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<SegmentsQuickFilter {...defaultProps} />);

    expect(
      screen.getByTestId('segments-select-quick-filter'),
    ).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<SegmentsQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('segments');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<SegmentsQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('segments-select-quick-filter');
    await user.selectOptions(select, 'beyond-beer');

    expect(mockOnValueChange).toHaveBeenCalledWith('segments', {
      value: 'beyond-beer',
      label: 'beyond-beer',
    });
  });

  it('should render all product type options', () => {
    render(<SegmentsQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('segments-select-quick-filter');
    const options = select.querySelectorAll('option');

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveValue('beer');
    expect(options[1]).toHaveValue('beyond-beer');
    expect(options[2]).toHaveValue('beer-beyond-beer');
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <SegmentsQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="segments"
        />,
      );
      expect(screen.getByTestId('custom-segments')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<SegmentsQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-segments"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<SegmentsQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('segments-select-quick-filter'),
      ).toBeInTheDocument();
    });
  });

  describe('Google Analytics', () => {
    it('should track product type selection', async () => {
      const mockTrackGA = jest.fn();
      jest.mocked(useGoogleAnalytics).mockReturnValue(mockTrackGA);

      const user = userEvent.setup();
      render(<SegmentsQuickFilter {...defaultProps} />);

      const select = screen.getByTestId('segments-select-quick-filter');
      await user.selectOptions(select, 'beyond-beer');

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Segments Select',
        event_action: 'Select',
        event_label: 'beyond-beer',
      });
    });

    it('should not track when handleValueChange receives undefined value', () => {
      const mockTrackGA = jest.fn();
      jest.mocked(useGoogleAnalytics).mockReturnValue(mockTrackGA);

      render(<SegmentsQuickFilter {...defaultProps} />);

      expect(
        screen.getByTestId('segments-select-quick-filter'),
      ).toBeInTheDocument();
    });
  });
});
