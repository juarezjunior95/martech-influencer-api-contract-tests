import { useMemo } from 'react';

import { featureToggles } from 'config/featureToggle';

import { useMultiplesFeatureToggles } from '../useMultipleFeatureToggles/useMultipleFeatureToggles';

export type ABTestGroup = 'A' | 'B' | 'control';

export interface ABTestResult {
  isGroupA: boolean;
  isGroupB: boolean;
  isControl: boolean;
  isReady: boolean;
}

export const useABTest = (): ABTestResult => {
  const { featuresListByToggleName, togglesReady } = useMultiplesFeatureToggles(
    [featureToggles.groupAViewer, featureToggles.groupBViewer],
  );

  const result = useMemo((): ABTestResult => {
    const isGroupA =
      featuresListByToggleName[featureToggles.groupAViewer] || false;
    const isGroupB =
      featuresListByToggleName[featureToggles.groupBViewer] || false;

    let group: ABTestGroup = 'control';

    if (isGroupA) {
      group = 'A';
    } else if (isGroupB) {
      group = 'B';
    }

    return {
      isGroupA: group === 'A',
      isGroupB: group === 'B',
      isControl: group === 'control',
      isReady: togglesReady,
    };
  }, [featuresListByToggleName, togglesReady]);

  return result;
};
