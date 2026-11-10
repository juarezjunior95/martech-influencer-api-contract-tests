import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QuickFilterItem } from './QuickFilterItem';

const mockZoneComponentFn = jest.fn();
const mockCountryComponentFn = jest.fn();

jest.mock('../../rules', () => ({
  QUICK_FILTERS_COMPONENTS: {
    zone: ({ fieldKey, onValueChange, getCurrentValue, dataTestId }: any) => {
      mockZoneComponentFn();
      return (
        <div data-testid={dataTestId ? dataTestId : 'zone-component'}>
          <button
            onClick={() =>
              onValueChange(fieldKey, { value: 'LATAM', label: 'LATAM' })
            }
            data-testid="zone-button"
          >
            Zone: {getCurrentValue('zone')}
          </button>
        </div>
      );
    },
    country: ({ dataTestId }: any) => {
      mockCountryComponentFn();
      return (
        <div data-testid={dataTestId ? dataTestId : 'country-component'}>
          Country
        </div>
      );
    },
  },
}));

describe('QuickFilterItem', () => {
  const mockDebouncedOnValueChange = jest.fn();
  const mockGetCurrentValue = jest.fn((key) => `value-${key}`);

  const defaultProps = {
    fieldKey: 'zone',
    currentPage: 'test-page',
    debouncedOnValueChange: mockDebouncedOnValueChange,
    getCurrentValue: mockGetCurrentValue,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the correct component based on fieldKey', () => {
    render(<QuickFilterItem {...defaultProps} fieldKey="zone" />);

    expect(screen.getByTestId('zone-component')).toBeInTheDocument();
    expect(mockZoneComponentFn).toHaveBeenCalled();
  });

  it('should render different component for different fieldKey', () => {
    render(<QuickFilterItem {...defaultProps} fieldKey="country" />);

    expect(screen.getByTestId('country-component')).toBeInTheDocument();
    expect(mockCountryComponentFn).toHaveBeenCalled();
  });

  it('should pass getCurrentValue to child component', () => {
    render(<QuickFilterItem {...defaultProps} />);

    const button = screen.getByTestId('zone-button');
    expect(button).toHaveTextContent('Zone: value-zone');
  });

  it('should call debouncedOnValueChange when child component triggers onValueChange', async () => {
    const user = userEvent.setup();
    render(<QuickFilterItem {...defaultProps} />);

    const button = screen.getByTestId('zone-button');
    await user.click(button);

    expect(mockDebouncedOnValueChange).toHaveBeenCalledWith('zone', 'LATAM');
  });

  describe('data-testid Rendering', () => {
    it('should render container and child component with data-testid when dataTestId is provided', () => {
      render(<QuickFilterItem {...defaultProps} dataTestId="custom" />);

      expect(
        screen.getByTestId('quick-filter-item-custom'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('custom-component')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is not provided', () => {
      const { container } = render(<QuickFilterItem {...defaultProps} />);

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="quick-filter-item-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByTestId('zone-component')).toBeInTheDocument();
    });

    it('should not render data-testid when dataTestId is explicitly undefined', () => {
      const { container } = render(
        <QuickFilterItem {...defaultProps} dataTestId={undefined} />,
      );

      const elementsWithTestId = container.querySelectorAll(
        '[data-testid^="quick-filter-item-"]',
      );
      expect(elementsWithTestId.length).toBe(0);

      expect(screen.getByTestId('zone-component')).toBeInTheDocument();
    });
  });
});
