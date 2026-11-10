import {
  BrandAudiencesCardData,
  BrandAudiencesTargetingCardModel,
} from '../types';

export const stripBrandVolumeFromCards = (
  cards: BrandAudiencesTargetingCardModel[],
): BrandAudiencesTargetingCardModel[] =>
  cards.map((card) => {
    const data = Array.isArray(card.data) ? card.data : [];

    const sanitized = data.map((item) => {
      if (!item || typeof item !== 'object' || !('brandVolume' in item)) {
        return item;
      }
      const { brandVolume: _omitted, ...rest } = item as Record<
        string,
        unknown
      >;
      return rest as typeof item;
    }) as BrandAudiencesCardData;

    return { ...card, data: sanitized };
  });
