import {
  cohortTableConfig,
  countryTableConfig,
  zoneMaturityTableConfig,
} from 'pages/components/POSBookTable/config';

import { VIEW_TYPES } from '../../constants';
import { getPOSBookTableConfig } from '../index';

describe('GrowTheCategory utils index', () => {
  describe('getPOSBookTableConfig', () => {
    it('returns country table config for country view', () => {
      expect(getPOSBookTableConfig(VIEW_TYPES.COUNTRY)).toBe(
        countryTableConfig,
      );
    });

    it('returns zone maturity table config for maturity-zone view', () => {
      expect(getPOSBookTableConfig(VIEW_TYPES.MATURITY_ZONE)).toBe(
        zoneMaturityTableConfig,
      );
    });

    it('returns cohort table config for cohort view', () => {
      expect(getPOSBookTableConfig(VIEW_TYPES.COHORT)).toBe(cohortTableConfig);
    });

    it('returns country table config for default/undefined', () => {
      expect(getPOSBookTableConfig()).toBe(countryTableConfig);
    });

    it('returns country table config for unknown view', () => {
      expect(getPOSBookTableConfig('unknown')).toBe(countryTableConfig);
    });
  });
});
