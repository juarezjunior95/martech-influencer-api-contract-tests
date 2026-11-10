import { VIEW_TYPES } from '../../constants';
import {
  buildBffGrowTheCategorySubFilters,
  getBffGrowTheCategoryKpiId,
} from '../bffFilterGrowTheCategoryFilter';

describe('bffFilterGrowTheCategoryFilter', () => {
  describe('getBffGrowTheCategoryKpiId', () => {
    it('returns country BFF id for country view', () => {
      expect(getBffGrowTheCategoryKpiId(VIEW_TYPES.COUNTRY)).toBe(
        'category_pos-book_grow-the-category_country',
      );
    });

    it('returns country BFF id for default/unknown view', () => {
      expect(getBffGrowTheCategoryKpiId('unknown')).toBe(
        'category_pos-book_grow-the-category_country',
      );
    });

    it('returns maturity-zone BFF id for maturity-zone view', () => {
      expect(getBffGrowTheCategoryKpiId(VIEW_TYPES.MATURITY_ZONE)).toBe(
        'category_pos-book_grow-the-category_zone-maturity',
      );
    });

    it('returns cohort BFF id for cohort view', () => {
      expect(getBffGrowTheCategoryKpiId(VIEW_TYPES.COHORT)).toBe(
        'category_pos-book_grow-the-category_cohort',
      );
    });
  });

  describe('buildBffGrowTheCategorySubFilters', () => {
    it('returns object with cohort and pos_kpi', () => {
      expect(
        buildBffGrowTheCategorySubFilters({
          cohort: 'Premium',
          pos_kpi: 'participation',
        }),
      ).toEqual({ cohort: 'Premium', pos_kpi: 'participation' });
    });

    it.each([
      ['null', null],
      ['empty', ''],
    ])('converts %s cohort to null', (_label, cohort) => {
      expect(
        buildBffGrowTheCategorySubFilters({
          cohort,
          pos_kpi: 'participation',
        }),
      ).toEqual({ cohort: null, pos_kpi: 'participation' });
    });

    it('preserves pos_kpi value', () => {
      expect(
        buildBffGrowTheCategorySubFilters({
          cohort: 'All',
          pos_kpi: 'volume',
        }),
      ).toEqual({ cohort: 'All', pos_kpi: 'volume' });
    });
  });
});
