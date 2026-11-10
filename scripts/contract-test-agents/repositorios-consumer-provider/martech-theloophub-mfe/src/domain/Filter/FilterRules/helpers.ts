import { GROWTH_LEVERS_RULES, KPI_RULES } from './constants';
import { FilterRuleConfig } from './types';

export const getKpiRule = (
  kpi: string,
  geoType: 'global' | 'zone' | 'country' | 'eur',
  brandClass: string,
): FilterRuleConfig | null => {
  const kpiLower = kpi?.toLowerCase() || '';
  const kpiRules = KPI_RULES[kpiLower];
  if (!kpiRules) return null;
  if (geoType === 'eur' && !kpiRules.eur) {
    return kpiRules.global?.[brandClass] || null;
  }
  return kpiRules[geoType]?.[brandClass] || null;
};

// Helper to get Growth Lever rule
export const getGrowthLeverRule = (
  growthLever: string,
  geoType: 'global' | 'zone' | 'country' | 'eur',
  brandClass: string,
): FilterRuleConfig | null => {
  if (!growthLever || growthLever === 'All') return null;
  const glRules = GROWTH_LEVERS_RULES[growthLever];
  if (!glRules) return null;
  if (geoType === 'eur' && !glRules.eur) {
    return glRules.zone?.[brandClass] || null;
  }
  return glRules[geoType]?.[brandClass] || null;
};
