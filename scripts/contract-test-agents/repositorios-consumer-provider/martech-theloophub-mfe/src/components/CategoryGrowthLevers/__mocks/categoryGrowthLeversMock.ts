import { GrowthLeversItemProps } from '../Components/GrowthLeversItem/interface';
import { CategoryGrowthLeversProps } from '../types';

const growthLeversItems: GrowthLeversItemProps[] = [
  {
    type: 'multi',
    cardTitle: 'GrowthLevers',
    alignItems: 'default',
    growthLeversNumber: { value: '25.5', measure: '%' },
    variation: { value: '3.7', measure: 'pp', color: '#176d38' },
    comparison: { value: 'vs', measure: 'LY' },
  },
  {
    type: 'multi',
    cardTitle: 'GrowthLevers',
    alignItems: 'default',
    growthLeversNumber: { value: '42.8', measure: '%' },
    variation: { value: '-1.3', measure: 'pp', color: '#c9201d' },
    comparison: { value: 'vs', measure: 'LY' },
  },
  {
    type: 'multi',
    cardTitle: 'GrowthLevers',
    alignItems: 'default',
    growthLeversNumber: { value: '68.2', measure: '%' },
    variation: { value: '5.9', measure: 'pp', color: '#176d38' },
    comparison: { value: 'vs', measure: 'LY' },
  },
  {
    type: 'multi',
    cardTitle: 'GrowthLevers',
    alignItems: 'default',
    growthLeversNumber: { value: '31.4', measure: '%' },
    variation: { value: '2.1', measure: 'pp', color: '#176d38' },
    comparison: { value: 'vs', measure: 'LY' },
  },
  {
    type: 'multi',
    cardTitle: 'GrowthLevers',
    alignItems: 'default',
    growthLeversNumber: { value: '54.7', measure: '%' },
    variation: { value: '-0.8', measure: 'pp', color: '#c9201d' },
    comparison: { value: 'vs', measure: 'LY' },
  },
];

export const categoryGrowthLeversMock: CategoryGrowthLeversProps = {
  categoryTitle: 'GrowthLevers',
  showImage: true,
  image: {
    src: 'https://one.martech.uat.bees-platform.dev/mf/martech-theloophub-mfe/cbecf44e89f182c52c44.png',
    alt: 'GrowthLevers Image',
  },
  items: growthLeversItems.slice(0, 3),
};

export const categoryGrowthLeversNoImageMock: CategoryGrowthLeversProps = {
  categoryTitle: 'GrowthLevers - No Image',
  showImage: false,
  items: growthLeversItems.slice(0, 3),
};

export const categoryGrowthLeversNoVariationMock: CategoryGrowthLeversProps = {
  categoryTitle: 'GrowthLevers - No Variation',
  showImage: false,
  items: growthLeversItems.slice(0, 3).map((item) => ({
    ...item,
    alignItems: 'center',
    variation: undefined,
    comparison: undefined,
  })),
};

export const categoryGrowthLeversFiveKpisMock: CategoryGrowthLeversProps = {
  categoryTitle: 'GrowthLevers',
  showImage: true,
  image: {
    src: 'https://one.martech.uat.bees-platform.dev/mf/martech-theloophub-mfe/a2b9693036397745f457.png',
    alt: 'GrowthLevers Image',
  },
  items: growthLeversItems.map((item) => ({
    ...item,
    alignItems: 'center',
    variation: undefined,
    comparison: undefined,
  })),
};

export const mockItems = growthLeversItems;
