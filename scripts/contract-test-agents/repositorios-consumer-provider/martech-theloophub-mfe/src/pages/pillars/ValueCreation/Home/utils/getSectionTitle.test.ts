import { FilterDataAccessor } from 'domain/Filter/FilterDataAccessor';
import type { FilterDataStructure, FilterForm } from 'models/Filters';

import {
  getGeoLabel,
  getGrowthLeverLabel,
  getSustainableGrowthOverviewTitle,
} from './getSectionTitle';

jest.mock('domain/Filter/FilterDataAccessor');

const mockAccessor = {
  getCountry: jest.fn(),
  getOptions: jest.fn(),
};

const dataFilters = {} as FilterDataStructure;

function appliedForm(overrides: Partial<FilterForm> = {}): FilterForm {
  return overrides as FilterForm;
}

describe('getSectionTitle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (FilterDataAccessor.getInstance as jest.Mock).mockReturnValue(mockAccessor);
  });

  describe('getGeoLabel', () => {
    it.each([
      {
        caseName: 'should return Europe when zone is EUR and country is ABI',
        applied: appliedForm({ zone: 'EUR', country: 'ABI' }),
        expected: 'Europe',
        assert: () => {
          expect(mockAccessor.getCountry).not.toHaveBeenCalled();
        },
      },
      {
        caseName: 'should return Global when zone and country are ABI',
        arrange: () => {
          mockAccessor.getCountry.mockReturnValue({
            value: 'ABI',
            label: 'Global',
          });
        },
        applied: appliedForm({ zone: 'ABI', country: 'ABI' }),
        expected: 'Global',
      },
      {
        caseName: 'should return country label from FilterDataAccessor',
        arrange: () => {
          mockAccessor.getCountry.mockReturnValue({
            value: 'BR',
            label: 'Brazil',
          });
        },
        applied: appliedForm({ zone: 'SAZ', country: 'BR' }),
        expected: 'Brazil',
      },
      {
        caseName: 'should return empty string when country is not found',
        arrange: () => {
          mockAccessor.getCountry.mockReturnValue(null);
        },
        applied: appliedForm({ zone: 'SAZ', country: 'XX' }),
        expected: '',
      },
    ])('$caseName', ({ arrange, applied, expected, assert }) => {
      arrange?.();
      expect(getGeoLabel(dataFilters, applied)).toBe(expected);
      assert?.();
    });
  });

  describe('getGrowthLeverLabel', () => {
    it.each([
      {
        caseName: 'should return empty string when growth lever is not set',
        applied: appliedForm({ zone: 'ABI', country: 'ABI' }),
        expected: '',
      },
      {
        caseName: 'should return the label of the selected growth lever',
        arrange: () => {
          mockAccessor.getOptions.mockReturnValue([
            { value: 'lead_premium', label: 'Lead Premium' },
            { value: 'superior_core', label: 'Superior Core' },
          ]);
        },
        applied: appliedForm({
          zone: 'SAZ',
          country: 'BR',
          value_creation_growth_levers: 'lead_premium',
        }),
        expected: 'Lead Premium',
      },
      {
        caseName:
          'should return empty string when no matching growth lever option',
        arrange: () => {
          mockAccessor.getOptions.mockReturnValue([]);
        },
        applied: appliedForm({
          zone: 'SAZ',
          country: 'BR',
          value_creation_growth_levers: 'unknown',
        }),
        expected: '',
      },
    ])('$caseName', ({ arrange, applied, expected }) => {
      arrange?.();
      expect(getGrowthLeverLabel(dataFilters, applied)).toBe(expected);
    });
  });

  describe('getSustainableGrowthOverviewTitle', () => {
    it.each([
      {
        caseName:
          'should return Global Sustainable Growth Overview for global view',
        arrange: () => {
          mockAccessor.getCountry.mockReturnValue({
            value: 'ABI',
            label: 'Global',
          });
          mockAccessor.getOptions.mockReturnValue([]);
        },
        applied: appliedForm({ zone: 'ABI', country: 'ABI' }),
        expected: 'Global Sustainable Growth Overview',
      },
      {
        caseName:
          'should return Europe Sustainable Growth Overview for EUR zone',
        arrange: () => {
          mockAccessor.getOptions.mockReturnValue([]);
        },
        applied: appliedForm({ zone: 'EUR', country: 'ABI' }),
        expected: 'Europe Sustainable Growth Overview',
      },
      {
        caseName:
          'should return Brazil Sustainable Growth Overview for country view',
        arrange: () => {
          mockAccessor.getCountry.mockReturnValue({
            value: 'BR',
            label: 'Brazil',
          });
          mockAccessor.getOptions.mockReturnValue([]);
        },
        applied: appliedForm({ zone: 'SAZ', country: 'BR' }),
        expected: 'Brazil Sustainable Growth Overview',
      },
      {
        caseName:
          'should replace Sustainable Growth with growth lever label when selected',
        arrange: () => {
          mockAccessor.getCountry.mockReturnValue({
            value: 'BR',
            label: 'Brazil',
          });
          mockAccessor.getOptions.mockReturnValue([
            { value: 'lead_premium', label: 'Lead Premium' },
          ]);
        },
        applied: appliedForm({
          zone: 'SAZ',
          country: 'BR',
          value_creation_growth_levers: 'lead_premium',
        }),
        expected: 'Brazil Lead Premium Overview',
      },
      {
        caseName: 'should return default title when no geo label is available',
        arrange: () => {
          mockAccessor.getCountry.mockReturnValue(null);
          mockAccessor.getOptions.mockReturnValue([]);
        },
        applied: appliedForm(),
        expected: 'Sustainable Growth Overview',
      },
    ])('$caseName', ({ arrange, applied, expected }) => {
      arrange();
      expect(getSustainableGrowthOverviewTitle(dataFilters, applied)).toBe(
        expected,
      );
    });
  });
});
