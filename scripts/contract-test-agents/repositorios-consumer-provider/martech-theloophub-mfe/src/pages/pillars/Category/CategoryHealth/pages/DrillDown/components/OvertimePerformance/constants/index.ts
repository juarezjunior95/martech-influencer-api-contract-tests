import type { KPIType, ProductType } from '../../../types';

export const TOOLTIP_KEYS: Record<KPIType, Record<ProductType, string>> = {
  volume: {
    Beer: 'Category.CategoryHealth.Volume.Beer.tooltip',
    'Beyond Beer': 'Category.CategoryHealth.Volume.BeyondBeer.tooltip',
    'Beer + Beyond Beer':
      'Category.CategoryHealth.Volume.BeerBeyondBeer.tooltip',
  },
  icl: {
    Beer: 'Category.CategoryHealth.ICL.BICL.tooltip',
    'Beyond Beer': 'Category.CategoryHealth.ICL.BYB.tooltip',
    'Beer + Beyond Beer': 'Category.CategoryHealth.ICL.BeerBeyondBeer.tooltip',
  },
  sot: {
    Beer: 'Category.CategoryHealth.SOT.Beer.tooltip',
    'Beyond Beer': 'Category.CategoryHealth.SOT.BeyondBeer.tooltip',
    'Beer + Beyond Beer': 'Category.CategoryHealth.SOT.BeerBeyondBeer.tooltip',
  },
  participation: {
    Beer: 'Category.CategoryHealth.Participation.Beer.tooltip',
    'Beyond Beer': 'Category.CategoryHealth.Participation.BeyondBeer.tooltip',
    'Beer + Beyond Beer':
      'Category.CategoryHealth.Participation.BeerBeyondBeer.tooltip',
  },
  wmtbb: {
    Beer: 'Category.CategoryHealth.WMTBB.tooltip',
    'Beyond Beer': 'Category.CategoryHealth.WMTBB.tooltip',
    'Beer + Beyond Beer': 'Category.CategoryHealth.WMTBB.tooltip',
  },
};
