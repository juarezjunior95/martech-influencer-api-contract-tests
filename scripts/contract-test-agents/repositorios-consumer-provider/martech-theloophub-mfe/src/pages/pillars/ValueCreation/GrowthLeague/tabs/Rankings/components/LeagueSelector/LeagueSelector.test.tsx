import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import enUS from 'i18n/languages/en-US';
import { flattenObject } from 'i18n/provider';

import { LeagueSelector } from './LeagueSelector';

jest.mock('@hexa-ui/components', () => ({
  SegmentedControl: ({
    options,
    value,
    onValueChange,
    'data-testid': dataTestId,
  }: {
    options: Array<{ label: string; value: string }>;
    value: string;
    onValueChange: (value: string) => void;
    'data-testid'?: string;
  }) => (
    <div data-testid={dataTestId ?? 'segmented-control'} data-value={value}>
      {options.map((option) => (
        <button
          key={option.value}
          data-testid={`option-${option.value}`}
          data-selected={option.value === value}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

const messages = flattenObject(enUS);

const mockSetLeagueType = jest.fn();

const renderSelector = (leagueType = 'super-league', dataTestId?: string) =>
  render(
    <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
      <LeagueSelector
        leagueType={leagueType}
        setLeagueType={mockSetLeagueType}
        dataTestId={dataTestId}
      />
    </IntlProvider>,
  );

describe('LeagueSelector (Rankings)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the segmented control with both options and real i18n labels', () => {
      renderSelector();

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('option-super-league')).toBeInTheDocument();
      expect(screen.getByTestId('option-premier-league')).toBeInTheDocument();
      expect(screen.getByText('Super League')).toBeInTheDocument();
      expect(screen.getByText('Premier League')).toBeInTheDocument();
    });
  });

  describe('selected state', () => {
    it('reflects super-league as selected when leagueType is "super-league"', () => {
      renderSelector('super-league');

      const control = screen.getByTestId('segmented-control');
      expect(control).toHaveAttribute('data-value', 'super-league');
      expect(screen.getByTestId('option-super-league')).toHaveAttribute(
        'data-selected',
        'true',
      );
    });

    it('reflects premier-league as selected when leagueType is "premier-league"', () => {
      renderSelector('premier-league');

      const control = screen.getByTestId('segmented-control');
      expect(control).toHaveAttribute('data-value', 'premier-league');
      expect(screen.getByTestId('option-premier-league')).toHaveAttribute(
        'data-selected',
        'true',
      );
    });
  });

  describe('setLeagueType callback', () => {
    it('calls setLeagueType with "super-league" when clicking super-league option', async () => {
      const user = userEvent.setup();
      renderSelector('premier-league');

      await user.click(screen.getByTestId('option-super-league'));

      expect(mockSetLeagueType).toHaveBeenCalledTimes(1);
      expect(mockSetLeagueType).toHaveBeenCalledWith('super-league');
    });

    it('calls setLeagueType with "premier-league" when clicking premier-league option', async () => {
      const user = userEvent.setup();
      renderSelector('super-league');

      await user.click(screen.getByTestId('option-premier-league'));

      expect(mockSetLeagueType).toHaveBeenCalledTimes(1);
      expect(mockSetLeagueType).toHaveBeenCalledWith('premier-league');
    });
  });

  describe('data-testid Rendering', () => {
    it('renders and omits custom data-testid based on dataTestId prop', () => {
      const { rerender } = renderSelector('super-league', 'custom');
      expect(
        screen.getByTestId('league-selector-super-league-custom'),
      ).toBeInTheDocument();

      rerender(
        <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
          <LeagueSelector
            leagueType="super-league"
            setLeagueType={mockSetLeagueType}
          />
        </IntlProvider>,
      );
      expect(
        screen.queryByTestId('league-selector-super-league-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
