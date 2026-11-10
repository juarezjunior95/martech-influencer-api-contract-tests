import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CountryQuickFilter } from './CountryQuickFilter';

const mockTrackGA = jest.fn();
const mockHandleClear = jest.fn();
const mockGetCountryAssetImageUrl = jest.fn();
const mockGetCountryOptions = jest.fn();
const mockGetCountry = jest.fn();
const mockUsePageFilterApplied = jest.fn();
const mockUsePageFilterData = jest.fn();

jest.mock('assets/icons/global.svg', () => 'global-icon.svg');

jest.mock('utils', () => ({
  getCountryAssetImageUrl: (...args: unknown[]) =>
    mockGetCountryAssetImageUrl(...args),
}));

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
  useGoogleAnalytics: jest.fn(() => mockTrackGA),
  usePageFilterApplied: (...args: unknown[]) =>
    mockUsePageFilterApplied(...args),
  usePageFilterData: (...args: unknown[]) => mockUsePageFilterData(...args),
}));

jest.mock('domain/Filter', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getCountryOptions: (...args: unknown[]) => mockGetCountryOptions(...args),
      getCountry: (...args: unknown[]) => mockGetCountry(...args),
    })),
  },
}));

jest.mock('components/Form', () => ({
  Select: ({
    dataTestId,
    id,
    value,
    options,
    onValueChange,
    onClearSingle,
    clearChips,
    getChipPlaceholder,
  }: any) => {
    const testId = dataTestId || id;
    const selected = Array.isArray(options)
      ? options.find((op: any) => op.value === value) ||
        (value && typeof value === 'object' ? value : options[0])
      : undefined;

    return (
      <div data-testid={testId}>
        <div data-testid={`${testId}-clear-chips`}>
          {String(Boolean(clearChips))}
        </div>
        <div data-testid={`${testId}-value`}>
          {typeof value === 'string' ? value : value?.value || ''}
        </div>
        <div data-testid={`${testId}-chip`}>
          {getChipPlaceholder?.(selected)}
        </div>
        <button
          data-testid={`${testId}-select-us`}
          onClick={() =>
            onValueChange({
              value: 'US',
              label: 'United States',
              zone: 'North America',
            })
          }
        >
          select-us
        </button>
        <button
          data-testid={`${testId}-select-empty`}
          onClick={() => onValueChange({ value: '', label: '' })}
        >
          select-empty
        </button>
        <button
          data-testid={`${testId}-select-array`}
          onClick={() =>
            onValueChange([
              {
                value: 'US',
                label: 'United States',
                zone: 'North America',
              },
            ])
          }
        >
          select-array
        </button>
        <button data-testid={`${testId}-clear`} onClick={onClearSingle}>
          clear
        </button>
      </div>
    );
  },
}));

describe('CountryQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn((key: string) => {
    if (key === 'country') return { value: 'BR', label: 'Brazil' };
    if (key === 'zone') return { value: 'LATAM', label: 'LATAM' };
    return null;
  });

  const defaultProps = {
    fieldKey: 'country',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCountryAssetImageUrl.mockResolvedValue(
      'https://cdn.example.com/countries/us.png',
    );
    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: 'LATAM', country: 'BR' },
      isGlobalZone: false,
    });
    mockUsePageFilterData.mockReturnValue({
      dataFilters: { country: {} },
      rawData: {},
    });
    mockGetCountryOptions.mockReturnValue([
      { value: 'BR', label: 'Brazil', zone: 'LATAM' },
      { value: 'US', label: 'United States', zone: 'North America' },
      { value: 'ABI', label: 'ABI Global', zone: 'ABI' },
    ]);
    mockGetCountry.mockReturnValue({
      value: 'LATAM',
      label: 'LATAM fallback label',
      quick_filter_label: 'LATAM fallback label',
    });
  });

  it('renders and requests current value through useQuickFilter hook', () => {
    render(<CountryQuickFilter {...defaultProps} />);
    expect(
      screen.getByTestId('country-select-quick-filter'),
    ).toBeInTheDocument();
    expect(mockGetCurrentValue).toHaveBeenCalledWith('country');
  });

  it('tracks GA and updates zone before country on valid selection', async () => {
    const user = userEvent.setup();
    render(<CountryQuickFilter {...defaultProps} />);

    await user.click(
      screen.getByTestId('country-select-quick-filter-select-us'),
    );

    expect(mockTrackGA).toHaveBeenCalledWith({
      event_category: 'Country Select',
      event_action: 'Select',
      event_label: 'US',
    });
    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, 'zone', {
      value: 'North America',
      label: 'North America',
    });
    expect(mockOnValueChange).toHaveBeenNthCalledWith(2, 'country', {
      value: 'US',
      label: 'United States',
      zone: 'North America',
    });
  });

  it('handles array payload from Select onValueChange', async () => {
    const user = userEvent.setup();
    render(<CountryQuickFilter {...defaultProps} />);

    await user.click(
      screen.getByTestId('country-select-quick-filter-select-array'),
    );

    expect(mockOnValueChange).toHaveBeenNthCalledWith(1, 'zone', {
      value: 'North America',
      label: 'North America',
    });
    expect(mockOnValueChange).toHaveBeenNthCalledWith(2, 'country', {
      value: 'US',
      label: 'United States',
      zone: 'North America',
    });
  });

  it('ignores change events without option value', async () => {
    const user = userEvent.setup();
    render(<CountryQuickFilter {...defaultProps} />);
    await user.click(
      screen.getByTestId('country-select-quick-filter-select-empty'),
    );
    expect(mockTrackGA).not.toHaveBeenCalled();
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });

  it('loads chip image from API when option has no preset image_url', async () => {
    render(<CountryQuickFilter {...defaultProps} />);
    expect(mockGetCountryAssetImageUrl).toHaveBeenCalledWith('BR');
    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'BR' })).toBeInTheDocument();
    });
  });

  it('shows global icon for ABI value and skips API resolution', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: 'ABI', country: 'ABI' },
      isGlobalZone: true,
    });
    render(<CountryQuickFilter {...defaultProps} />);
    expect(screen.getByAltText('ABI Global')).toBeInTheDocument();
    expect(mockGetCountryAssetImageUrl).not.toHaveBeenCalled();
  });

  it('uses preset image_url from option without calling API', async () => {
    mockGetCountryOptions.mockReturnValueOnce([
      {
        value: 'BR',
        label: 'Brazil',
        zone: 'LATAM',
        image_url: '/cdn/countries/BR.png',
      },
      { value: 'US', label: 'United States', zone: 'North America' },
    ]);
    render(<CountryQuickFilter {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByAltText('BR')).toBeInTheDocument();
    });
    expect(mockGetCountryAssetImageUrl).not.toHaveBeenCalled();
  });

  it('renders no chip image when API returns null', async () => {
    mockGetCountryAssetImageUrl.mockResolvedValueOnce(null);
    render(<CountryQuickFilter {...defaultProps} />);
    await waitFor(() => {
      expect(screen.queryByAltText('BR')).not.toBeInTheDocument();
    });
  });

  it('uses accessor fallback when country is ABI but zone is not ABI', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: 'LATAM', country: 'ABI' },
      isGlobalZone: false,
    });
    render(<CountryQuickFilter {...defaultProps} />);
    expect(mockGetCountry).toHaveBeenCalled();
    expect(
      screen.getByTestId('country-select-quick-filter-value'),
    ).toHaveTextContent('LATAM');
  });

  it('exposes clear icon only when value differs from first option and zone is not ABI', () => {
    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: 'LATAM', country: 'US' },
      isGlobalZone: false,
    });
    render(<CountryQuickFilter {...defaultProps} />);
    expect(
      screen.getByTestId('country-select-quick-filter-clear-chips'),
    ).toHaveTextContent('true');
  });

  it('hides clear icon in ABI zone and wires clear action', async () => {
    const user = userEvent.setup();
    mockUsePageFilterApplied.mockReturnValue({
      applied: { zone: 'ABI', country: 'US' },
      isGlobalZone: true,
    });
    render(<CountryQuickFilter {...defaultProps} />);
    expect(
      screen.getByTestId('country-select-quick-filter-clear-chips'),
    ).toHaveTextContent('false');

    await user.click(screen.getByTestId('country-select-quick-filter-clear'));
    expect(mockHandleClear).toHaveBeenCalledTimes(1);
  });

  it('applies custom data-testid prefix when provided', () => {
    render(<CountryQuickFilter {...defaultProps} dataTestId="custom" />);
    expect(screen.getByTestId('custom-country')).toBeInTheDocument();
  });
});
