import { configs } from './tableConfig';

jest.mock('../cellRenderer/BrandCellRenderer/BrandCellRenderer', () => ({
  BrandCellRenderer: jest.fn(() => 'BrandCellRenderer'),
}));

jest.mock(
  '../cellRenderer/CampaignsCellRenderer/CampaignsCellRenderer',
  () => ({
    CampaignsCellRenderer: jest.fn(() => 'CampaignsCellRenderer'),
  }),
);

describe('tableConfig', () => {
  it('should have all expected column keys', () => {
    const expectedKeys = [
      'Gantt',
      'brand',
      'campaign_qwoa',
      'campaign_woa',
      'campaign_$',
      'tt_qwoa',
      'campaign',
      'gantt',
    ];

    expect(Object.keys(configs)).toEqual(expect.arrayContaining(expectedKeys));
  });

  describe('Gantt config', () => {
    it('has headerTooltip and headerGroupComponentParams', () => {
      const ganttConfig = configs.Gantt as Record<string, unknown>;
      expect(ganttConfig).toHaveProperty('headerTooltip');
      expect(ganttConfig.headerGroupComponentParams).toEqual({ tooltip: true });
    });
  });

  describe('Column configs with cellRenderer', () => {
    it.each([
      ['brand', 96],
      ['campaign_qwoa', 84],
      ['campaign_woa', 84],
      ['campaign_$', 120],
      ['tt_qwoa', 84],
      ['campaign', 150],
    ])('%s has minWidth %d and cellRenderer', (key, expectedMinWidth) => {
      const config = configs[key as keyof typeof configs];
      expect(config).toHaveProperty('minWidth', expectedMinWidth);
      expect(config).toHaveProperty('cellRenderer');
    });

    it('cellRenderer is a function and calls the renderer', () => {
      const mockParams = { data: { test: 'value' } };
      const brandConfig = configs.brand as Record<string, unknown>;
      const brandCellRenderer = brandConfig.cellRenderer as (
        params: typeof mockParams,
      ) => string;

      expect(typeof brandCellRenderer).toBe('function');
      const result = brandCellRenderer(mockParams);
      expect(result).toBe('BrandCellRenderer');
    });
  });

  describe('gantt config', () => {
    it('has minWidth but no cellRenderer', () => {
      expect(configs.gantt).toHaveProperty('minWidth', 577);
      expect(configs.gantt).not.toHaveProperty('cellRenderer');
    });
  });
});
