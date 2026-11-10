import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ZoneQuickFilter } from './ZoneQuickFilter';

jest.mock('hooks', () => ({
  useGoogleAnalytics: jest.fn(() => jest.fn()),
  usePageFilterData: jest.fn(() => ({
    dataFilters: {
      zone: {
        values: [
          { value: 'LATAM', label: 'LATAM' },
          { value: 'APAC', label: 'APAC' },
        ],
      },
    },
  })),
}));

jest.mock('domain/Filter/FilterDataAccessor', () => ({
  FilterDataAccessor: {
    getInstance: jest.fn(() => ({
      getOptions: jest.fn(() => [
        { value: 'LATAM', label: 'LATAM' },
        { value: 'APAC', label: 'APAC' },
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
  }: {
    dataTestId?: string;
    id: string;
    value: any;
    onValueChange: (value: any) => void;
  }) => (
    <select
      data-testid={dataTestId || id}
      value={value?.value}
      onChange={(e) =>
        onValueChange({ value: e.target.value, label: e.target.value })
      }
    >
      <option value="LATAM">LATAM</option>
      <option value="APAC">APAC</option>
    </select>
  ),
}));

describe('ZoneQuickFilter', () => {
  const mockOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn(() => ({
    value: 'LATAM',
    label: 'LATAM',
  }));

  const defaultProps = {
    fieldKey: 'zone',
    pageName: 'test-page',
    onValueChange: mockOnValueChange,
    getCurrentValue: mockGetCurrentValue as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the select component', () => {
    render(<ZoneQuickFilter {...defaultProps} />);

    expect(screen.getByTestId('zone-select-quick-filter')).toBeInTheDocument();
  });

  it('should get current value on render', () => {
    render(<ZoneQuickFilter {...defaultProps} />);

    expect(mockGetCurrentValue).toHaveBeenCalledWith('zone');
  });

  it('should call onValueChange when value changes', async () => {
    const user = userEvent.setup();
    render(<ZoneQuickFilter {...defaultProps} />);

    const select = screen.getByTestId('zone-select-quick-filter');
    await user.selectOptions(select, 'APAC');

    expect(mockOnValueChange).toHaveBeenCalledWith('zone', {
      value: 'APAC',
      label: 'APAC',
    });
  });

  describe('data-testid Rendering', () => {
    it('should pass dataTestId to Select when provided', () => {
      render(
        <ZoneQuickFilter
          {...defaultProps}
          dataTestId="custom"
          fieldKey="zone"
        />,
      );
      expect(screen.getByTestId('custom-zone')).toBeInTheDocument();
    });

    it('should not render data-testid with custom prefix when dataTestId is not provided', () => {
      const { container } = render(<ZoneQuickFilter {...defaultProps} />);
      const elementsWithCustomTestId = container.querySelectorAll(
        '[data-testid^="custom-zone"]',
      );
      expect(elementsWithCustomTestId.length).toBe(0);
    });

    it('should render with default data-testid when dataTestId is not provided', () => {
      render(<ZoneQuickFilter {...defaultProps} />);
      expect(
        screen.getByTestId('zone-select-quick-filter'),
      ).toBeInTheDocument();
    });
  });
});
