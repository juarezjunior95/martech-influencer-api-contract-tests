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
          data-selected={String(option.value === value)}
          onClick={() => onValueChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

const messages = flattenObject(enUS);

const mockOnValueChange = jest.fn();

const renderSelector = (ui: React.ReactElement) =>
  render(
    <IntlProvider defaultLocale="en-US" locale="en-US" messages={messages}>
      {ui}
    </IntlProvider>,
  );

describe('LeagueSelector (Overview)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders segmented control with Super and Premier labels from the catalogue', () => {
    renderSelector(
      <LeagueSelector
        selectedLeague="super-league"
        onLeagueChange={mockOnValueChange}
      />,
    );

    expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
    expect(screen.getByTestId('option-super-league')).toBeInTheDocument();
    expect(screen.getByTestId('option-premier-league')).toBeInTheDocument();
    expect(screen.getByText('Super League')).toBeInTheDocument();
    expect(screen.getByText('Premier League')).toBeInTheDocument();
  });

  it.each([
    ['super-league', 'option-super-league'],
    ['premier-league', 'option-premier-league'],
  ] as const)(
    'marks %s as the active selection',
    (selectedLeague, activeOptionTestId) => {
      renderSelector(
        <LeagueSelector
          selectedLeague={selectedLeague}
          onLeagueChange={mockOnValueChange}
        />,
      );

      expect(screen.getByTestId('segmented-control')).toHaveAttribute(
        'data-value',
        selectedLeague,
      );
      expect(screen.getByTestId(activeOptionTestId)).toHaveAttribute(
        'data-selected',
        'true',
      );
    },
  );

  it.each([
    ['premier-league', 'option-super-league', 'super-league'],
    ['super-league', 'option-premier-league', 'premier-league'],
    ['super-league', 'option-super-league', 'super-league'],
  ] as const)(
    'calls onLeagueChange with %s',
    async (initial, optionTestId, expected) => {
      const user = userEvent.setup();

      renderSelector(
        <LeagueSelector
          selectedLeague={initial}
          onLeagueChange={mockOnValueChange}
        />,
      );

      await user.click(screen.getByTestId(optionTestId));

      expect(mockOnValueChange).toHaveBeenCalledTimes(1);
      expect(mockOnValueChange).toHaveBeenCalledWith(expected);
    },
  );

  describe('data-testid', () => {
    it('adds custom test id when dataTestId is provided', () => {
      renderSelector(
        <LeagueSelector
          selectedLeague="super-league"
          onLeagueChange={mockOnValueChange}
          dataTestId="custom"
        />,
      );

      expect(screen.getByTestId('league-selector-custom')).toBeInTheDocument();
    });

    it('does not add custom test id when dataTestId is omitted', () => {
      renderSelector(
        <LeagueSelector
          selectedLeague="super-league"
          onLeagueChange={mockOnValueChange}
        />,
      );

      expect(
        screen.queryByTestId('league-selector-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
