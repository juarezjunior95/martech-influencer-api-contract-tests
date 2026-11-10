import { TIER_ORDER } from '../constants';
import { BreakdownTier } from '../types';

export const sortTiers = (tiers: BreakdownTier[]): BreakdownTier[] => {
  return [...tiers].sort((a, b) => {
    const indexA = TIER_ORDER.indexOf(a.tier_level);
    const indexB = TIER_ORDER.indexOf(b.tier_level);
    const posA = indexA === -1 ? Infinity : indexA;
    const posB = indexB === -1 ? Infinity : indexB;
    return posA - posB;
  });
};
