import { getDeepDiveHeaderMessage } from '../deepDiveHeaderUtils';

const BASE = 'ConnectionsCreativity.ResourceAllocationMedia.Overview.Ranking';
const TITLES = `${BASE}.titles`;
const TOOLTIPS = `${BASE}.tooltips`;

describe('deepDiveHeaderUtils', () => {
  describe('getDeepDiveHeaderMessage', () => {
    const mockFormatMessage = jest.fn(
      ({ id }: { id: string }, values?: Record<string, any>) => {
        if (values) {
          return `translated-${id}-${JSON.stringify(values)}`;
        }
        return `translated-${id}`;
      },
    );

    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('title generation', () => {
      it.each([
        {
          kpi: 'media_spend',
          isGlobal: true,
          expected: `${TITLES}.mediaSpendGlobal`,
        },
        {
          kpi: 'media_spend',
          isGlobal: false,
          expected: `${TITLES}.mediaSpendCountries`,
        },
        {
          kpi: 'megabrands',
          isGlobal: true,
          expected: `${TITLES}.megabrandsGlobal`,
        },
        {
          kpi: 'megabrands',
          isGlobal: false,
          expected: `${TITLES}.qwoaCountries`,
        },
        {
          kpi: 'campaigns',
          isGlobal: true,
          expected: `${TITLES}.campaignsGlobal`,
        },
        {
          kpi: 'campaigns',
          isGlobal: false,
          expected: `${TITLES}.campaignsCountries`,
        },
        {
          kpi: 'resource_allocation',
          isGlobal: true,
          expected: `${TITLES}.resourceAllocationGlobal`,
        },
        {
          kpi: 'resource_allocation',
          isGlobal: false,
          expected: `${TITLES}.resourceAllocationCountries`,
        },
      ])(
        'returns correct title for $kpi (isGlobal: $isGlobal)',
        ({ kpi, isGlobal, expected }) => {
          const result = getDeepDiveHeaderMessage({
            activeSubFilters: { kpis: kpi },
            isGlobalZone: isGlobal,
            data: {},
            formatMessage: mockFormatMessage,
            selectedView: 'ranking_toggle',
          });

          expect(mockFormatMessage).toHaveBeenCalledWith({ id: expected });
          expect(result.title).toContain(expected.split('.').pop());
        },
      );

      it('returns "-" when titleKey is undefined', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'unknown_kpi' },
          isGlobalZone: true,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'ranking_toggle',
        });

        expect(result.title).toBe('-');
      });
    });

    describe('connector generation', () => {
      it.each([
        { isGlobal: true, expected: `${TITLES}.connectorGlobal` },
        { isGlobal: false, expected: `${TITLES}.connectorCountries` },
      ])(
        'returns correct connector (isGlobal: $isGlobal)',
        ({ isGlobal, expected }) => {
          getDeepDiveHeaderMessage({
            activeSubFilters: { kpis: 'media_spend' },
            isGlobalZone: isGlobal,
            data: {},
            formatMessage: mockFormatMessage,
            selectedView: 'ranking_toggle',
          });

          expect(mockFormatMessage).toHaveBeenCalledWith({ id: expected });
        },
      );
    });

    describe('measure generation', () => {
      it.each([
        {
          kpi: 'media_spend',
          isGlobal: true,
          expected: `${TITLES}.measureMioUsd`,
        },
        {
          kpi: 'media_spend',
          isGlobal: false,
          expected: `${TITLES}.measureMioUsd`,
        },
        {
          kpi: 'megabrands',
          isGlobal: true,
          expected: `${TITLES}.measurePercentage`,
        },
        {
          kpi: 'megabrands',
          isGlobal: false,
          expected: `${TITLES}.measureHash`,
        },
        {
          kpi: 'campaigns',
          isGlobal: true,
          expected: `${TITLES}.measurePercentage`,
        },
        {
          kpi: 'campaigns',
          isGlobal: false,
          expected: `${TITLES}.measureHash`,
        },
        {
          kpi: 'resource_allocation',
          isGlobal: true,
          expected: `${TITLES}.measurePercentage`,
        },
        {
          kpi: 'resource_allocation',
          isGlobal: false,
          expected: `${TITLES}.measureHash`,
        },
      ])(
        'returns $expected for $kpi (isGlobal: $isGlobal)',
        ({ kpi, isGlobal, expected }) => {
          getDeepDiveHeaderMessage({
            activeSubFilters: { kpis: kpi },
            isGlobalZone: isGlobal,
            data: {},
            formatMessage: mockFormatMessage,
            selectedView: 'ranking_toggle',
          });

          expect(mockFormatMessage).toHaveBeenCalledWith({ id: expected });
        },
      );

      it('returns "-" when measureKey is undefined', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'unknown_kpi' },
          isGlobalZone: true,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'ranking_toggle',
        });

        expect(result.measure).toBe('-');
      });
    });

    describe('context generation', () => {
      it('returns top countries context when isGlobalZone is true', () => {
        const data = {
          overview_graph: {
            total_per_year_full: {
              labels: ['Country1', 'Country2', 'Country3'],
            },
          },
        };

        getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'media_spend' },
          isGlobalZone: true,
          data,
          formatMessage: mockFormatMessage,
          selectedView: 'ranking_toggle',
        });

        expect(mockFormatMessage).toHaveBeenCalledWith(
          { id: `${TITLES}.topCountries` },
          { countriesQuantity: 3 },
        );
      });

      it.each([
        { data: {}, desc: 'empty data' },
        { data: { overview_graph: null }, desc: 'null overview_graph' },
        {
          data: { overview_graph: { total_per_year_full: null } },
          desc: 'null total_per_year_full',
        },
      ])('uses empty string for labels count when $desc', ({ data }) => {
        getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'media_spend' },
          isGlobalZone: true,
          data,
          formatMessage: mockFormatMessage,
          selectedView: 'ranking_toggle',
        });

        expect(mockFormatMessage).toHaveBeenCalledWith(
          { id: `${TITLES}.topCountries` },
          { countriesQuantity: '' },
        );
      });

      it('returns country brands context when isGlobalZone is false', () => {
        getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'media_spend' },
          isGlobalZone: false,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'ranking_toggle',
        });

        expect(mockFormatMessage).toHaveBeenCalledWith({
          id: `${TITLES}.countryBrands`,
        });
      });
    });

    describe('tooltip generation for ranking view', () => {
      it.each([
        {
          kpi: 'megabrands',
          isGlobal: false,
          expected: `${TOOLTIPS}.megabrands`,
          hasTooltip: true,
        },
        { kpi: 'megabrands', isGlobal: true, expected: '', hasTooltip: false },
        {
          kpi: 'resource_allocation',
          isGlobal: true,
          expected: `${TOOLTIPS}.resourceAllocationGlobal`,
          hasTooltip: true,
        },
        {
          kpi: 'resource_allocation',
          isGlobal: false,
          expected: `${TOOLTIPS}.resourceAllocationCountries`,
          hasTooltip: true,
        },
        { kpi: 'campaigns', isGlobal: false, expected: '', hasTooltip: false },
        { kpi: 'media_spend', isGlobal: true, expected: '', hasTooltip: false },
      ])(
        'returns correct tooltip for $kpi (isGlobal: $isGlobal)',
        ({ kpi, isGlobal, expected, hasTooltip }) => {
          const result = getDeepDiveHeaderMessage({
            activeSubFilters: { kpis: kpi },
            isGlobalZone: isGlobal,
            data: {},
            formatMessage: mockFormatMessage,
            selectedView: 'ranking_toggle',
          });

          if (hasTooltip) {
            expect(mockFormatMessage).toHaveBeenCalledWith({ id: expected });
            expect(result.tooltip).toContain(expected.split('.').pop());
          } else {
            expect(result.tooltip).toBe('');
          }
        },
      );
    });

    describe('resource_allocation specific tooltips in ranking view', () => {
      it('returns labelIconTooltip for countries (ranking)', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'resource_allocation' },
          isGlobalZone: false,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'ranking_toggle',
        });

        expect(mockFormatMessage).toHaveBeenCalledWith({
          id: `${TOOLTIPS}.resourceAllocationLabelIconCountries`,
        });
        expect(result.labelIconTooltip).toContain(
          'resourceAllocationLabelIconCountries',
        );
      });

      it.each([
        { isGlobal: true, expected: `${TOOLTIPS}.resourceAllocationGlobal` },
        {
          isGlobal: false,
          expected: `${TOOLTIPS}.resourceAllocationCountries`,
        },
      ])(
        'returns horizontalDashedLineTooltip: $expected (isGlobal: $isGlobal)',
        ({ isGlobal, expected }) => {
          const result = getDeepDiveHeaderMessage({
            activeSubFilters: { kpis: 'resource_allocation' },
            isGlobalZone: isGlobal,
            data: {},
            formatMessage: mockFormatMessage,
            selectedView: 'ranking_toggle',
          });

          expect(result.horizontalDashedLineTooltip).toContain(
            expected.split('.').pop(),
          );
        },
      );

      it('does not return tooltips for other kpis', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'media_spend' },
          isGlobalZone: false,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'ranking_toggle',
        });

        expect(result.labelIconTooltip).toBe('');
        expect(result.horizontalDashedLineTooltip).toBe('');
      });
    });

    describe('guideline column tooltip for breakdown view', () => {
      it.each([
        {
          kpi: 'resource_allocation',
          view: 'breakdown_toggle',
          expected: true,
        },
        { kpi: 'media_spend', view: 'breakdown_toggle', expected: false },
        { kpi: 'resource_allocation', view: 'ranking_toggle', expected: false },
      ])(
        'shouldShowGuidelineColumnTooltip is $expected for $kpi + $view',
        ({ kpi, view, expected }) => {
          const result = getDeepDiveHeaderMessage({
            activeSubFilters: { kpis: kpi },
            isGlobalZone: false,
            data: {},
            formatMessage: mockFormatMessage,
            selectedView: view,
          });

          expect(result.shouldShowGuidelineColumnTooltip).toBe(expected);
        },
      );

      it.each([
        { isGlobal: true, expected: 'resourceAllocationGlobal' },
        { isGlobal: false, expected: 'resourceAllocationCountries' },
      ])(
        'returns guidelineColumnTooltipMessage: $expected',
        ({ isGlobal, expected }) => {
          const result = getDeepDiveHeaderMessage({
            activeSubFilters: { kpis: 'resource_allocation' },
            isGlobalZone: isGlobal,
            data: {},
            formatMessage: mockFormatMessage,
            selectedView: 'breakdown_toggle',
          });

          expect(result.guidelineColumnTooltipMessage).toContain(expected);
        },
      );

      it('does not set guidelineColumnTooltipMessage when flag is false', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'media_spend' },
          isGlobalZone: false,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'breakdown_toggle',
        });

        expect(result.guidelineColumnTooltipMessage).toBeUndefined();
      });
    });

    describe('non-ranking view behavior', () => {
      it('does not set general tooltip for non-ranking view', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'megabrands' },
          isGlobalZone: false,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'breakdown_toggle',
        });

        expect(result.tooltip).toBe('');
      });

      it('does not set resource_allocation specific tooltips for breakdown view', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'resource_allocation' },
          isGlobalZone: false,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'breakdown_toggle',
        });

        expect(result.labelIconTooltip).toBe('');
        expect(result.horizontalDashedLineTooltip).toBe('');
      });
    });

    describe('return structure and edge cases', () => {
      it('returns all expected properties', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'media_spend' },
          isGlobalZone: true,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: 'ranking_toggle',
        });

        expect(result).toHaveProperty('title');
        expect(result).toHaveProperty('connector');
        expect(result).toHaveProperty('context');
        expect(result).toHaveProperty('measure');
        expect(result).toHaveProperty('tooltip');
        expect(result).toHaveProperty('shouldShowGuidelineColumnTooltip');
        expect(result).toHaveProperty('guidelineColumnTooltipMessage');
        expect(result).toHaveProperty('labelIconTooltip');
        expect(result).toHaveProperty('horizontalDashedLineTooltip');
      });

      it('handles undefined selectedView', () => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { kpis: 'media_spend' },
          isGlobalZone: true,
          data: {},
          formatMessage: mockFormatMessage,
          selectedView: undefined,
        });

        expect(result.shouldShowGuidelineColumnTooltip).toBe(false);
        expect(result.tooltip).toBe('');
      });
    });
  });
});
