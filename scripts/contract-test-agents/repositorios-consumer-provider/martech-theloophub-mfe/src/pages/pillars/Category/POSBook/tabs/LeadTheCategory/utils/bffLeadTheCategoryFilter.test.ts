import { VIEW_TYPES } from '../constants';
import {
  buildBffBrandParticipationSubFilters,
  buildBffManufactureSubFilters,
  getBffBrandParticipationKpiId,
  getBffManufactureKpiId,
} from './bffLeadTheCategoryFilter';

describe('bffLeadTheCategoryFilter', () => {
  describe('getBffManufactureKpiId', () => {
    it('returns global BFF id when isGlobalZone is true', () => {
      expect(getBffManufactureKpiId(true)).toBe(
        'category_pos-book_lead-the-category_global_manufacture-participation',
      );
    });

    it('returns country BFF id when isGlobalZone is false', () => {
      expect(getBffManufactureKpiId(false)).toBe(
        'category_pos-book_lead-the-category_country_manufacture-participation',
      );
    });
  });

  describe('buildBffManufactureSubFilters', () => {
    it('returns object with price_segment', () => {
      expect(
        buildBffManufactureSubFilters({ price_segment: 'Premium' }),
      ).toEqual({ price_segment: 'Premium' });
    });

    it('converts null price_segment to null', () => {
      expect(buildBffManufactureSubFilters({ price_segment: null })).toEqual({
        price_segment: null,
      });
    });

    it('converts empty price_segment to null', () => {
      expect(buildBffManufactureSubFilters({ price_segment: '' })).toEqual({
        price_segment: null,
      });
    });
  });

  describe('getBffBrandParticipationKpiId', () => {
    it('returns portfolio global id for portfolio view when global', () => {
      expect(getBffBrandParticipationKpiId(VIEW_TYPES.PORTFOLIO, true)).toBe(
        'category_pos-book_lead-the-category_global_participation-portfolio',
      );
    });

    it('returns portfolio country id for portfolio view when not global', () => {
      expect(getBffBrandParticipationKpiId(VIEW_TYPES.PORTFOLIO, false)).toBe(
        'category_pos-book_lead-the-category_country_participation-portfolio',
      );
    });

    it('returns global-brands id for global-brands view', () => {
      expect(
        getBffBrandParticipationKpiId(VIEW_TYPES.GLOBAL_BRANDS, true),
      ).toBe(
        'category_pos-book_lead-the-category_global_participation-global-brands',
      );
    });

    it('returns ranking global id for rankings view when global', () => {
      expect(getBffBrandParticipationKpiId(VIEW_TYPES.RANKINGS, true)).toBe(
        'category_pos-book_lead-the-category_global_participation-ranking',
      );
    });

    it('returns ranking country id for rankings view when not global', () => {
      expect(getBffBrandParticipationKpiId(VIEW_TYPES.RANKINGS, false)).toBe(
        'category_pos-book_lead-the-category_country_participation-ranking',
      );
    });

    it('returns portfolio id for unknown view (default)', () => {
      expect(getBffBrandParticipationKpiId('unknown', true)).toBe(
        'category_pos-book_lead-the-category_global_participation-portfolio',
      );
    });

    it('returns portfolio country id for unknown view when not global', () => {
      expect(getBffBrandParticipationKpiId('unknown', false)).toBe(
        'category_pos-book_lead-the-category_country_participation-portfolio',
      );
    });
  });

  describe('buildBffBrandParticipationSubFilters', () => {
    it('returns object with cohort and price_segment', () => {
      expect(
        buildBffBrandParticipationSubFilters({
          cohort: 'Premium',
          price_segment: 'Standard',
        }),
      ).toEqual({ cohort: 'Premium', price_segment: 'Standard' });
    });

    it('converts null values to null', () => {
      expect(
        buildBffBrandParticipationSubFilters({
          cohort: null,
          price_segment: null,
        }),
      ).toEqual({ cohort: null, price_segment: null });
    });

    it('converts empty values to null', () => {
      expect(
        buildBffBrandParticipationSubFilters({
          cohort: '',
          price_segment: '',
        }),
      ).toEqual({ cohort: null, price_segment: null });
    });
  });
});
