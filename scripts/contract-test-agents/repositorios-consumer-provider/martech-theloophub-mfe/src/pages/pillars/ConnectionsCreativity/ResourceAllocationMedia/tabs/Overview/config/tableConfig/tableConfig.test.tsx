import deepDiveConfig, { createGuidelineColumnConfig } from './tableConfig';

describe('tableConfig', () => {
  describe('createGuidelineColumnConfig', () => {
    it('returns basic config without tooltip when shouldShowTooltip is false', () => {
      const result = createGuidelineColumnConfig(false);

      expect(result).toEqual(
        expect.objectContaining({
          minWidth: 202,
        }),
      );
      expect(result).not.toHaveProperty('headerTooltip');
      expect(result).not.toHaveProperty('headerComponentParams');
    });

    it('returns config with tooltip params when shouldShowTooltip is true', () => {
      const tooltipMessage = 'Test Message';
      const result = createGuidelineColumnConfig(true, tooltipMessage);

      expect(result).toEqual(
        expect.objectContaining({
          minWidth: 202,
          headerTooltip: tooltipMessage,
          headerComponentParams: expect.objectContaining({
            tooltip: true,
            tooltipHideIcon: false,
            tooltipCellStyle: 'dark',
            tooltipHeaderStyle: 'dark',
          }),
        }),
      );
    });
  });

  describe('deepDiveConfig', () => {
    it('exposes expected columns with base config', () => {
      const expectedKeys = [
        'countries',
        'brands',
        'ly',
        'bu',
        'current_year_',
        'previous_year_',
        'guideline',
      ];

      expect(Object.keys(deepDiveConfig)).toEqual(expectedKeys);

      expectedKeys.forEach((key) => {
        expect(deepDiveConfig[key]).toEqual(
          expect.objectContaining({
            minWidth: 202,
            headerClass: undefined,
          }),
        );
      });
    });
  });
});
