import { innovationHubMainCardsMock } from '../../../__mocks__/innovationHubTestFixtures';
import { mapInnovationHubMainCardsToEmptyNotice } from './mapInnovationHubMainCardsToEmptyNotice';

describe('mapInnovationHubMainCardsToEmptyNotice', () => {
  const notice = 'KPI data not available';

  it('applies empty notice to every key present in the main-cards record', () => {
    const keys = Object.keys(innovationHubMainCardsMock);
    expect(keys.length).toBeGreaterThan(0);

    const out = mapInnovationHubMainCardsToEmptyNotice(
      innovationHubMainCardsMock,
      notice,
    );

    expect(Object.keys(out)).toEqual(keys);
    for (const key of keys) {
      expect(out[key].noticeMessage).toBe(notice);
      expect(out[key].bigNumberData).toEqual([]);
    }
  });

  it('preserves chart header titles when mapping to empty state', () => {
    const out = mapInnovationHubMainCardsToEmptyNotice(
      innovationHubMainCardsMock,
      notice,
    );

    expect(out.volume.chartHeader.title).toBe(
      innovationHubMainCardsMock.volume.chartHeader.title,
    );
    expect(out.macoMargin.chartHeader.title).toBe(
      innovationHubMainCardsMock.macoMargin.chartHeader.title,
    );
  });
});
