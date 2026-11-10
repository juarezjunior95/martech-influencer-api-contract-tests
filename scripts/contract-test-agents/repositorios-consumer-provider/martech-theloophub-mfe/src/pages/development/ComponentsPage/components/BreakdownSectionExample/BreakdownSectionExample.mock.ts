import { BreakdownTier } from 'pages/components/BreakdownSection/types';

export const MOCK_DESCRIPTION_VALUES = { country: 'Brazil' };
export const FULL_WIDTH_OVERRIDES = { container: { width: '100%' } };

export const mockTiers: BreakdownTier[] = [
  {
    tier_level: 'beer',
    tier_name: 'Beer',
    audiences: {
      core: {
        value: 31.2,
        yoy_change: 2.3,
        yoy_direction: 'up',
        comparison_index: 101,
        performance_index: null,
      },
      halo: {
        value: 29.5,
        yoy_change: -1.1,
        yoy_direction: 'down',
        comparison_index: 120,
        performance_index: 80,
      },
      total: {
        value: 50.5,
        yoy_change: 1.5,
        yoy_direction: 'up',
        comparison_index: 105,
        performance_index: 110,
      },
    },
  },
  {
    tier_level: 'core_co',
    tier_name: 'Core Co',
    audiences: {
      core: {
        value: 38,
        yoy_change: 0.8,
        yoy_direction: 'up',
        comparison_index: 102,
        performance_index: 102,
      },
      halo: {
        value: 0,
        yoy_change: 0,
        yoy_direction: 'up',
        comparison_index: 150,
        performance_index: 150,
      },
      total: {
        value: 220,
        yoy_change: -0.5,
        yoy_direction: 'down',
        comparison_index: 80,
        performance_index: 80,
      },
    },
  },
  {
    tier_level: 'brand',
    tier_name: 'Brahma',
    audiences: {
      core: {
        value: 28,
        yoy_change: 3.1,
        yoy_direction: 'up',
        comparison_index: 120,
        performance_index: 120,
      },
      halo: null,
      total: {
        value: 43,
        yoy_change: 2.0,
        yoy_direction: 'up',
        comparison_index: 108,
        performance_index: 108,
      },
    },
  },
  {
    tier_level: 'competitor',
    tier_name: 'Competitor Avg',
    audiences: null,
  },
];

export const mockTiersNoData: BreakdownTier[] = [
  {
    tier_level: 'brand',
    tier_name: 'Brand (No Data)',
    audiences: null,
  },
];
