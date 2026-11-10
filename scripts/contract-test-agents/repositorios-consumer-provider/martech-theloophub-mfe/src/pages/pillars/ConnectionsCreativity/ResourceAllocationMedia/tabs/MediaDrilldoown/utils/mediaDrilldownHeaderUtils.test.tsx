import { RA_BUBBLE_SUBFILTER } from '../constants';
import { getMediaDrilldownHeaderMessage } from './mediaDrilldownHeaderUtils';

const mockFormatMessage = jest.fn((descriptor: { id: string }) => {
  const messages: Record<string, string> = {
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.title.media_qwoa':
      'Media QWOA in the top 12 countries',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.title.media_qwoa':
      'Media QWOA per Brand',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.measure.media_qwoa':
      '[# of weeks]',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.measure.media_qwoa':
      '[# of weeks]',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.tooltip.media_qwoa':
      'Media QWOA global tooltip',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.tooltip.media_qwoa':
      'Media QWOA country tooltip',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.title.non_working_money':
      'Non-Working Money in the top 12 countries',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.title.non_working_money':
      'Non-Working Money per Brand',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.measure.non_working_money':
      '[% of Total Investment]',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.measure.non_working_money':
      '[% of Total Investment]',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.tooltip.non_working_money':
      'Non-Working Money global tooltip',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.tooltip.non_working_money':
      'Non-Working Money country tooltip',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.title.campaign_qwoa':
      'Campaign QWOA in the top 12 countries',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.title.campaign_qwoa':
      'Campaign QWOA per Brand',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.measure.campaign_qwoa':
      '[# of weeks]',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.measure.campaign_qwoa':
      '[# of weeks]',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.globalView.tooltip.campaign_qwoa':
      'Campaign QWOA global tooltip',
    'ConnectionsCreativity.ResourceAllocationMedia.MediaDrilldoownTab.countryView.tooltip.campaign_qwoa':
      'Campaign QWOA country tooltip',
  };
  return messages[descriptor.id] || descriptor.id;
});

describe('getMediaDrilldownHeaderMessage', () => {
  beforeEach(() => {
    mockFormatMessage.mockClear();
  });

  it.each([
    {
      kpi: 'media_qwoa',
      isGlobalZone: true,
      expectedTitle: 'Media QWOA in the top 12 countries',
      expectedMeasure: '[# of weeks]',
      expectedTooltip: 'Media QWOA global tooltip',
    },
    {
      kpi: 'media_qwoa',
      isGlobalZone: false,
      expectedTitle: 'Media QWOA per Brand',
      expectedMeasure: '[# of weeks]',
      expectedTooltip: 'Media QWOA country tooltip',
    },
    {
      kpi: 'non_working_money',
      isGlobalZone: true,
      expectedTitle: 'Non-Working Money in the top 12 countries',
      expectedMeasure: '[% of Total Investment]',
      expectedTooltip: 'Non-Working Money global tooltip',
    },
    {
      kpi: 'non_working_money',
      isGlobalZone: false,
      expectedTitle: 'Non-Working Money per Brand',
      expectedMeasure: '[% of Total Investment]',
      expectedTooltip: 'Non-Working Money country tooltip',
    },
    {
      kpi: 'campaign_qwoa',
      isGlobalZone: true,
      expectedTitle: 'Campaign QWOA in the top 12 countries',
      expectedMeasure: '[# of weeks]',
      expectedTooltip: 'Campaign QWOA global tooltip',
    },
    {
      kpi: 'campaign_qwoa',
      isGlobalZone: false,
      expectedTitle: 'Campaign QWOA per Brand',
      expectedMeasure: '[# of weeks]',
      expectedTooltip: 'Campaign QWOA country tooltip',
    },
  ])(
    'returns correct messages for $kpi with isGlobalZone=$isGlobalZone',
    ({
      kpi,
      isGlobalZone,
      expectedTitle,
      expectedMeasure,
      expectedTooltip,
    }) => {
      const result = getMediaDrilldownHeaderMessage({
        activeSubFilters: { [RA_BUBBLE_SUBFILTER]: kpi },
        isGlobalZone,
        formatMessage: mockFormatMessage,
      });

      expect(result.title).toBe(expectedTitle);
      expect(result.measure).toBe(expectedMeasure);
      expect(result.tooltip).toBe(expectedTooltip);
    },
  );

  it('returns space for title and measure when BubbleKey is undefined', () => {
    const result = getMediaDrilldownHeaderMessage({
      activeSubFilters: {},
      isGlobalZone: true,
      formatMessage: mockFormatMessage,
    });

    expect(result.title).toBe(' ');
    expect(result.measure).toBe(' ');
    expect(result.tooltip).toBeUndefined();
  });

  it('returns undefined tooltip when translation key is not found', () => {
    const mockFormatMessageNoTranslation = jest.fn(
      (descriptor: { id: string }) => descriptor.id,
    );

    const result = getMediaDrilldownHeaderMessage({
      activeSubFilters: { [RA_BUBBLE_SUBFILTER]: 'media_qwoa' },
      isGlobalZone: true,
      formatMessage: mockFormatMessageNoTranslation,
    });

    expect(result.tooltip).toBeUndefined();
  });

  it('returns space for title when BubbleKey is invalid', () => {
    const result = getMediaDrilldownHeaderMessage({
      activeSubFilters: { [RA_BUBBLE_SUBFILTER]: 'invalid_key' },
      isGlobalZone: true,
      formatMessage: mockFormatMessage,
    });

    expect(result.title).toBe(' ');
    expect(result.measure).toBe(' ');
  });
});
