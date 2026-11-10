import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import enUS from 'i18n/languages/en-US';
import { flattenObject } from 'i18n/provider';

import { CompetitionSelector } from './CompetitionSelector';

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

const mockSetCompetitionType = jest.fn();

const renderSelector = (competitionType = 'league', dataTestId?: string) =>
  render(
    <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
      <CompetitionSelector
        competitionType={competitionType}
        setCompetitionType={mockSetCompetitionType}
        dataTestId={dataTestId}
      />
    </IntlProvider>,
  );

describe('CompetitionSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the segmented control with both options and real i18n labels', () => {
      renderSelector();

      expect(screen.getByTestId('segmented-control')).toBeInTheDocument();
      expect(screen.getByTestId('option-league')).toBeInTheDocument();
      expect(screen.getByTestId('option-cup')).toBeInTheDocument();
      expect(screen.getByText('League')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('selected state', () => {
    it('reflects league as selected when competitionType is "league"', () => {
      renderSelector('league');

      const control = screen.getByTestId('segmented-control');
      expect(control).toHaveAttribute('data-value', 'league');
      expect(screen.getByTestId('option-league')).toHaveAttribute(
        'data-selected',
        'true',
      );
    });

    it('reflects cup as selected when competitionType is "cup"', () => {
      renderSelector('cup');

      const control = screen.getByTestId('segmented-control');
      expect(control).toHaveAttribute('data-value', 'cup');
      expect(screen.getByTestId('option-cup')).toHaveAttribute(
        'data-selected',
        'true',
      );
    });
  });

  describe('setCompetitionType callback', () => {
    it('calls setCompetitionType with "league" when clicking league option', async () => {
      const user = userEvent.setup();
      renderSelector('cup');

      await user.click(screen.getByTestId('option-league'));

      expect(mockSetCompetitionType).toHaveBeenCalledTimes(1);
      expect(mockSetCompetitionType).toHaveBeenCalledWith('league');
    });

    it('calls setCompetitionType with "cup" when clicking cup option', async () => {
      const user = userEvent.setup();
      renderSelector('league');

      await user.click(screen.getByTestId('option-cup'));

      expect(mockSetCompetitionType).toHaveBeenCalledTimes(1);
      expect(mockSetCompetitionType).toHaveBeenCalledWith('cup');
    });
  });

  describe('data-testid Rendering', () => {
    it('renders and omits custom data-testid based on dataTestId prop', () => {
      const { rerender } = renderSelector('league', 'custom');
      expect(
        screen.getByTestId('competition-selector-league-custom'),
      ).toBeInTheDocument();

      rerender(
        <IntlProvider locale="en-US" defaultLocale="en-US" messages={messages}>
          <CompetitionSelector
            competitionType="league"
            setCompetitionType={mockSetCompetitionType}
          />
        </IntlProvider>,
      );
      expect(
        screen.queryByTestId('competition-selector-custom'),
      ).not.toBeInTheDocument();
    });
  });
});
