import { fireEvent, render, screen } from '@testing-library/react';
import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import { useGoogleAnalytics, usePageFilterData } from 'hooks';
import { useFilterRules } from 'hooks/useFilters/core/useFilterRules';

import { BeerPriceSegmentField } from './BeerPriceSegmentField';

jest.mock('components/Form', () => ({
  Select: ({
    id,
    label,
    value,
    options,
    onValueChange,
    placeholder,
    disabled,
  }: {
    id: string;
    label: string;
    value: string;
    options: Array<{ value: string; label: string }>;
    onValueChange: (option: unknown) => void;
    placeholder: string;
    disabled?: boolean;
  }) => (
    <div data-testid="select-component">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => {
          const option = options.find((opt) => opt.value === e.target.value);
          onValueChange(option);
        }}
        data-placeholder={placeholder}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(),
}));

jest.mock('hooks/useFilters/core/useFilterRules', () => ({
  useFilterRules: jest.fn(),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => []),
    })),
  },
}));

describe('BeerPriceSegmentField', () => {
  let mockTrackGA: jest.Mock;
  let mockOnValueChange: jest.Mock;
  let mockGetCurrentValue: jest.Mock;
  let mockGetFieldConfig: jest.Mock;
  let mockFilterOptions: jest.Mock;

  const mockRawOptions = [
    { value: 'All', label: 'All' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Core', label: 'Core' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    mockTrackGA = jest.fn();
    mockOnValueChange = jest.fn();
    mockGetCurrentValue = jest.fn((key: string) => {
      if (key === 'beer_price_segment') return 'All';
      if (key === 'kpis') return 'power';
      if (key === 'country') return 'BR';
      if (key === 'zone') return 'LATAM';
      return '';
    });

    mockGetFieldConfig = jest.fn(() => ({
      hidden: false,
      label: 'Beer Price Segment',
      defaultValue: 'All',
      disabled: false,
      allowedValues: null,
    }));

    mockFilterOptions = jest.fn((opts: typeof mockRawOptions) => opts);

    (useGoogleAnalytics as jest.Mock).mockReturnValue(mockTrackGA);
    (usePageFilterData as jest.Mock).mockReturnValue({
      dataFilters: {},
    });
    (useFilterRules as jest.Mock).mockReturnValue({
      getFieldConfig: mockGetFieldConfig,
      filterOptions: mockFilterOptions,
    });

    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
      getOptions: jest.fn(() => mockRawOptions),
    });
  });

  const getDefaultProps = () => ({
    fieldKey: 'beer_price_segment',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  });

  describe('Basic rendering', () => {
    it('should render the Select component', () => {
      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      expect(screen.getByTestId('select-component')).toBeInTheDocument();
    });

    it('should render with label from field config', () => {
      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Beer Price Segment')).toBeInTheDocument();
    });

    it('should return null when fieldConfig.hidden is true', () => {
      mockGetFieldConfig.mockReturnValue({
        hidden: true,
        label: 'Beer Price Segment',
        defaultValue: 'All',
        disabled: false,
        allowedValues: null,
      });

      const { container } = render(
        <BeerPriceSegmentField {...getDefaultProps()} />,
      );

      expect(screen.queryByTestId('select-component')).not.toBeInTheDocument();
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Value change', () => {
    it('should call onValueChange for beer_price_segment when value changes', () => {
      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Beer Price Segment');
      fireEvent.change(select, { target: { value: 'Premium' } });

      expect(mockOnValueChange).toHaveBeenCalledTimes(1);
      expect(mockOnValueChange).toHaveBeenCalledWith(
        'beer_price_segment',
        expect.objectContaining({ value: 'Premium', label: 'Premium' }),
      );
    });

    it('should track Google Analytics event when value changes', () => {
      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Beer Price Segment');
      fireEvent.change(select, { target: { value: 'Premium' } });

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Beer Price Segment Select',
        event_action: 'Select',
        event_label: 'Premium',
      });
    });
  });

  describe('Options', () => {
    it('should filter out Other when kpi is volume and country is CAN', () => {
      mockGetCurrentValue.mockImplementation((key: string) => {
        if (key === 'kpis') return 'volume';
        if (key === 'country') return 'CAN';
        if (key === 'beer_price_segment') return 'All';
        return '';
      });

      (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
        getOptions: jest.fn(() => [
          { value: 'All', label: 'All' },
          { value: 'Premium', label: 'Premium' },
          { value: 'Other', label: 'Other' },
        ]),
      });

      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Beer Price Segment');
      const options = select.querySelectorAll('option');
      const values = Array.from(options).map(
        (o) => o.getAttribute('value') ?? '',
      );

      expect(values).not.toContain('Other');
      expect(values).toContain('All');
      expect(values).toContain('Premium');
    });

    it('should not filter out Other when kpi is volume and country is not CAN', () => {
      mockGetCurrentValue.mockImplementation((key: string) => {
        if (key === 'kpis') return 'volume';
        if (key === 'country') return 'BR';
        if (key === 'beer_price_segment') return 'All';
        return '';
      });

      (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
        getOptions: jest.fn(() => [
          { value: 'All', label: 'All' },
          { value: 'Premium', label: 'Premium' },
          { value: 'Other', label: 'Other' },
        ]),
      });

      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Beer Price Segment');
      const options = select.querySelectorAll('option');
      const values = Array.from(options).map(
        (o) => o.getAttribute('value') ?? '',
      );

      expect(values).toContain('Other');
      expect(values).toContain('All');
      expect(values).toContain('Premium');
    });

    it('should filter out Other when kpi is net revenue (for any country)', () => {
      mockGetCurrentValue.mockImplementation((key: string) => {
        if (key === 'kpis') return 'nr';
        if (key === 'country') return 'BR';
        if (key === 'beer_price_segment') return 'All';
        return '';
      });

      (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue({
        getOptions: jest.fn(() => [
          { value: 'All', label: 'All' },
          { value: 'Core', label: 'Core' },
          { value: 'Other', label: 'Other' },
        ]),
      });

      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      const select = screen.getByLabelText('Beer Price Segment');
      const options = select.querySelectorAll('option');
      const values = Array.from(options).map(
        (o) => o.getAttribute('value') ?? '',
      );

      expect(values).not.toContain('Other');
      expect(values).toContain('All');
      expect(values).toContain('Core');
    });

    it('should use getFieldConfig with correct context', () => {
      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      expect(mockGetFieldConfig).toHaveBeenCalledWith('beer_price_segment', {
        kpi: 'power',
        growthLever: '',
        country: 'BR',
        zone: 'LATAM',
        brandClass: '',
        brand: '',
      });
    });
  });

  describe('Disabled state', () => {
    it('should render Select as disabled when fieldConfig.disabled is true', () => {
      mockGetFieldConfig.mockReturnValue({
        hidden: false,
        label: 'Beer Price Segment',
        defaultValue: 'All',
        disabled: true,
        allowedValues: null,
      });

      render(<BeerPriceSegmentField {...getDefaultProps()} />);

      expect(screen.getByLabelText('Beer Price Segment')).toBeDisabled();
    });
  });
});
