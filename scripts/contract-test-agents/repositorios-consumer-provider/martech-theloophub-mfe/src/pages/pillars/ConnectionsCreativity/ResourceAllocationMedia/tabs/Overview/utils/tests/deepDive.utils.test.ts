import { getDeepDiveHeaderMessage } from '../deepDive.utils';

describe('deepDive.utils', () => {
  describe('getDeepDiveHeaderMessage', () => {
    const mockFormatMessage = jest.fn(
      ({ id }: { id: string }) => `translated-${id}`,
    );

    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, 'error').mockImplementation(jest.fn());
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each([
      { subfilter: undefined, desc: 'undefined' },
      { subfilter: 'unknown_kpi', desc: 'unknown subfilter' },
    ])(
      'returns default media_spend config when subfilter is $desc',
      ({ subfilter }) => {
        const result = getDeepDiveHeaderMessage({
          activeSubFilters: { dropdown: subfilter },
          isGlobalZone: false,
          formatMessage: mockFormatMessage,
        });

        expect(result).toEqual({
          title:
            'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.mediaSpend',
          measure:
            'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measureMioUsd',
        });
      },
    );

    it.each([
      {
        isGlobalZone: true,
        expectedLabel: 'Label.country',
        desc: 'COUNTRY for global zone',
      },
      {
        isGlobalZone: false,
        expectedLabel: 'Label.brand',
        desc: 'BRAND for non-global zone',
      },
    ])('uses $desc', ({ isGlobalZone, expectedLabel }) => {
      getDeepDiveHeaderMessage({
        activeSubFilters: { dropdown: 'media_spend' },
        isGlobalZone,
        formatMessage: mockFormatMessage,
      });

      expect(mockFormatMessage).toHaveBeenCalledWith({ id: expectedLabel });
    });

    it.each([
      {
        subfilter: 'media_spend',
        titleId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.mediaSpend',
        measureId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measureMioUsd',
      },
      {
        subfilter: 'qwoaByCountry',
        titleId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.qwoaByCountry',
        measureId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measurePercentage',
      },
      {
        subfilter: 'qwoaByBrand',
        titleId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.qwoaByBrand',
        measureId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measurePercentage',
      },
      {
        subfilter: 'campaigns',
        titleId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.campaigns',
        measureId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measurePercentage',
      },
      {
        subfilter: 'nwm',
        titleId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.nwm',
        measureId:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measurePercentage',
      },
    ])(
      'calls formatMessage with correct IDs for $subfilter',
      ({ subfilter, titleId, measureId }) => {
        getDeepDiveHeaderMessage({
          activeSubFilters: { dropdown: subfilter },
          isGlobalZone: false,
          formatMessage: mockFormatMessage,
        });

        expect(mockFormatMessage).toHaveBeenCalledWith({ id: titleId });
        expect(mockFormatMessage).toHaveBeenCalledWith({ id: measureId });
      },
    );

    it('returns formatted title with region', () => {
      const result = getDeepDiveHeaderMessage({
        activeSubFilters: { dropdown: 'media_spend' },
        isGlobalZone: true,
        formatMessage: mockFormatMessage,
      });

      expect(result.title).toBe(
        'translated-ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.mediaSpend translated-Label.country',
      );
    });

    it('returns default config and logs error when formatMessage throws', () => {
      const throwingFormatMessage = jest.fn(() => {
        throw new Error('Format error');
      });

      const result = getDeepDiveHeaderMessage({
        activeSubFilters: { dropdown: 'media_spend' },
        isGlobalZone: false,
        formatMessage: throwingFormatMessage,
      });

      expect(result).toEqual({
        title:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.mediaSpend',
        measure:
          'ConnectionsCreativity.ResourceAllocationMedia.Overview.DeepDive.tableTitles.measureMioUsd',
      });
      expect(console.error).toHaveBeenCalledWith(
        'Error formatting deep dive header message:',
        expect.any(Error),
      );
    });

    it('returns object with title and measure properties', () => {
      const result = getDeepDiveHeaderMessage({
        activeSubFilters: { dropdown: 'media_spend' },
        isGlobalZone: true,
        formatMessage: mockFormatMessage,
      });

      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('measure');
      expect(typeof result.title).toBe('string');
      expect(typeof result.measure).toBe('string');
      expect(result.title).toContain(' ');
    });
  });
});
