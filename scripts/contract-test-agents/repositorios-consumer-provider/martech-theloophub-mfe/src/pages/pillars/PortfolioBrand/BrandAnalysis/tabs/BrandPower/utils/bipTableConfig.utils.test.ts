import {
  brandsTableConfig,
  competitorTableConfig,
} from '../components/BipTable/config';
import { getBipTableConfig } from './bipTableConfig';

describe('getBipTableConfig', () => {
  it('returns the competitor table config when isCompetitorSubfilter is true', () => {
    expect(getBipTableConfig(true)).toBe(competitorTableConfig);
  });

  it('returns the brands table config when isCompetitorSubfilter is false', () => {
    expect(getBipTableConfig(false)).toBe(brandsTableConfig);
  });
});
