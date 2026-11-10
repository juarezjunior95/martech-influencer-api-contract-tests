import { useMemo } from 'react';

import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';
import { Option } from 'models/Filters';

const KPI_TO_FEATURE_TOGGLE_MAP: Record<string, string> = {
  volume: 'volume',
  nr: 'netRevenue',
  cores: 'cores',
  market_share: 'marketShare',
  power: 'brandPower',
};

export const useKpiFeatureToggles = () => {
  const [volumeEnabled] = useFeatureToggle(
    featureToggles.pillar.valueCreation.deepDive.volume,
  );
  const [netRevenueEnabled] = useFeatureToggle(
    featureToggles.pillar.valueCreation.deepDive.netRevenue,
  );
  const [coresEnabled] = useFeatureToggle(
    featureToggles.pillar.valueCreation.deepDive.cores,
  );
  const [marketShareEnabled] = useFeatureToggle(
    featureToggles.pillar.valueCreation.deepDive.marketShare,
  );
  const [brandPowerEnabled] = useFeatureToggle(
    featureToggles.pillar.valueCreation.deepDive.brandPower,
  );

  const featureToggleMap: Record<string, boolean> = useMemo(
    () => ({
      volume: volumeEnabled,
      netRevenue: netRevenueEnabled,
      cores: coresEnabled,
      marketShare: marketShareEnabled,
      brandPower: brandPowerEnabled,
    }),
    [
      volumeEnabled,
      netRevenueEnabled,
      coresEnabled,
      marketShareEnabled,
      brandPowerEnabled,
    ],
  );

  const filterOptionsByFeatureToggle = useMemo(() => {
    return (options: Option[]): Option[] => {
      return options.filter((option) => {
        const toggleKey = KPI_TO_FEATURE_TOGGLE_MAP[option.value as string];
        if (!toggleKey) return true;
        return featureToggleMap[toggleKey];
      });
    };
  }, [featureToggleMap]);

  return {
    featureToggleMap,
    filterOptionsByFeatureToggle,
  };
};
