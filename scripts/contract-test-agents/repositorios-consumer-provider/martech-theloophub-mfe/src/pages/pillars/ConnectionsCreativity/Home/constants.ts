export const MAIN_CARDS_CONFIG = [
  {
    titleId: 'ConnectionsCreativity.Home.mediaEffectiveness' as const,
    dataKey: 'mediaEffectiveness' as const,
  },
  {
    titleId: 'ConnectionsCreativity.Home.businessEfficiency' as const,
    dataKey: 'businessEfficiency' as const,
  },
] as const;

export const RESOURCE_ALLOCATION_ROUTE =
  '/connections-creativity/resource-allocation-media/resource-allocation';

export type ResourceAllocationCardKey =
  'megabrandsQwoaBigNumber' | 'campaignsQwoaBigNumber';

export const RESOURCE_ALLOCATION_CARD_KEYS: ResourceAllocationCardKey[] = [
  'megabrandsQwoaBigNumber',
  'campaignsQwoaBigNumber',
];
