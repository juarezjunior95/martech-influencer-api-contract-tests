import { createBaseWaterfallConfig } from './createBaseWaterfallConfig';

export const marketShareWaterfallConfig = createBaseWaterfallConfig(
  'market_share',
  {
    additionalAllowedContexts: ['eur_zone'],

    additionalGroupingToViewBy: {
      eur_zone: {
        'All Brands': 'brand',
      },
      global: {
        'All Brands': 'country',
      },
    },

    getContextKeyOverride: (applied) => {
      if (applied?.zone === 'EUR' && applied?.country === 'ABI') {
        return 'eur_zone';
      }
      return null;
    },

    isViewByDisabled: () => true,
  },
);
