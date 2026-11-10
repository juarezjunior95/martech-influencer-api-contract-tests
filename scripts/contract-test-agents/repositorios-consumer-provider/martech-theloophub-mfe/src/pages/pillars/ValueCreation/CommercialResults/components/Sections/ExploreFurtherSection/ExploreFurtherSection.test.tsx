import React from 'react';

import { render, screen } from '@testing-library/react';

import { ExploreFurtherSection } from './ExploreFurtherSection';

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockUseFeatureToggle = jest.fn(() => [true, false]);
const mockExploreFurther = jest.fn();

jest.mock('react-intl', () => ({
  useIntl: () => ({ formatMessage: mockFormatMessage }),
}));

jest.mock('hooks', () => ({
  useFeatureToggle: (...args: Parameters<typeof mockUseFeatureToggle>) =>
    mockUseFeatureToggle(...args),
}));

jest.mock('config/featureToggle', () => ({
  featureToggles: {
    pillar: {
      valueCreation: {
        submenus: {
          performanceTool: { id: 'submenu_performance_tool' },
        },
      },
    },
  },
}));

jest.mock('components', () => ({
  ExploreFurther: (props: Record<string, unknown>) => {
    mockExploreFurther(props);
    return (
      <div
        data-testid="explore-further"
        data-filter-page-name={props.filterPageName as string}
        data-test-id={props.dataTestId as string}
      />
    );
  },
}));

jest.mock('../../../constants', () => ({
  COMMERCIAL_RESULTS_PAGE_NAME: 'value-creation_commercial-results',
}));

function renderSection() {
  return render(<ExploreFurtherSection />);
}

describe('ExploreFurtherSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFeatureToggle.mockReturnValue([true, false]);
  });

  describe('feature toggle enabled', () => {
    it('renders ExploreFurther when feature toggle is enabled and not loading', () => {
      renderSection();

      expect(screen.getByTestId('explore-further')).toBeInTheDocument();
    });

    it('passes COMMERCIAL_RESULTS_PAGE_NAME as filterPageName and dataTestId', () => {
      renderSection();

      expect(mockExploreFurther).toHaveBeenCalledWith(
        expect.objectContaining({
          filterPageName: 'value-creation_commercial-results',
          dataTestId: 'value-creation_commercial-results',
        }),
      );
    });

    it('calls useFeatureToggle with the performanceTool feature toggle id', () => {
      renderSection();

      expect(mockUseFeatureToggle).toHaveBeenCalledWith(
        'submenu_performance_tool',
      );
    });

    it('builds cards with correct formatMessage ids for both card keys', () => {
      renderSection();

      const cardKeys = ['financialData', 'driversDecomposition'];
      const fields = [
        'title',
        'description',
        'linkLabel',
        'linkHref',
        'abbreviation',
      ];

      cardKeys.forEach((card) => {
        fields.forEach((field) => {
          expect(mockFormatMessage).toHaveBeenCalledWith({
            id: `ValueCreation.CommercialResults.exploreFurther.${card}.${field}`,
          });
        });
      });
    });

    it('sets enabled=true only for financialData when feature toggle is enabled', () => {
      renderSection();

      const { cards } = mockExploreFurther.mock.calls[0][0] as {
        cards: { title: string; enabled: boolean }[];
      };

      expect(cards[0].enabled).toBe(true);
      expect(cards[1].enabled).toBe(false);
    });
  });

  describe('feature toggle disabled or loading', () => {
    it('returns null when feature toggle is disabled', () => {
      mockUseFeatureToggle.mockReturnValue([false, false]);
      const { container } = renderSection();

      expect(container.firstChild).toBeNull();
    });

    it('returns null when feature toggle is still loading', () => {
      mockUseFeatureToggle.mockReturnValue([true, true]);
      const { container } = renderSection();

      expect(container.firstChild).toBeNull();
    });

    it('returns null when feature toggle is disabled and loading', () => {
      mockUseFeatureToggle.mockReturnValue([false, true]);
      const { container } = renderSection();

      expect(container.firstChild).toBeNull();
    });

    it('does NOT call ExploreFurther when feature toggle is disabled', () => {
      mockUseFeatureToggle.mockReturnValue([false, false]);
      renderSection();

      expect(mockExploreFurther).not.toHaveBeenCalled();
    });
  });

  describe('financialData card enabled flag', () => {
    it('sets enabled=false for financialData when feature toggle is disabled', () => {
      mockUseFeatureToggle.mockReturnValue([true, false]);
      renderSection();

      const { cards } = mockExploreFurther.mock.calls[0][0] as {
        cards: { enabled: boolean }[];
      };

      expect(cards[0].enabled).toBe(true);
    });
  });
});
