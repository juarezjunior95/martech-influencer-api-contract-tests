import type { BigNumberDemographic } from 'components/BigNumber/types';

import { BrandAudiencesTargetingCardModel } from '../types';

export function getHighlightSegmentsFromBrandAudienceCard(
  card: BrandAudiencesTargetingCardModel,
): string[] {
  const labels = new Set<string>();
  for (const item of card.data) {
    if (!('audience' in item) || item.audience == null) {
      continue;
    }
    const {
      gender = [],
      age = [],
      incomeBracket = [],
    }: BigNumberDemographic = item.audience;
    gender.forEach((v) => labels.add(v));
    age.forEach((v) => labels.add(v));
    incomeBracket.forEach((v) => labels.add(v));
  }
  return [...labels];
}
