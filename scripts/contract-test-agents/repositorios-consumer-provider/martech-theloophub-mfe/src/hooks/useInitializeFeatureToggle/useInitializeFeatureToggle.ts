import { useEffect, useState } from 'react';

import {
  createFeatureToggleServiceV2,
  useFeatureToggleServiceV2 as featureToggleService,
} from 'admin-portal-shared-services';
import { OPTIMIZELY_PROJECT_NAME } from 'config/featureToggle';

type UseInitializeFeatureToggleResult = {
  isReady: boolean;
};

interface FeatureToggleGlobals {
  services?: {
    FeatureToggleOptimizelyV2?: Record<string, unknown>;
  };
}

const isFeatureToggleServiceLoaded = () =>
  (globalThis as unknown as FeatureToggleGlobals).services
    ?.FeatureToggleOptimizelyV2?.[OPTIMIZELY_PROJECT_NAME];

export const useInitializeFeatureToggle = (
  optimizelyKey: string,
): UseInitializeFeatureToggleResult => {
  const [isReady, setIsReady] = useState<boolean>(false);

  const handleFeatureToggleInitialization = (): void => {
    const toggleService = featureToggleService(OPTIMIZELY_PROJECT_NAME);
    if (toggleService.getIsReady()) {
      setIsReady(true);
      return;
    }
    toggleService
      .onReady()
      .then(() => {
        setIsReady(true);
      })
      .catch((error) => {
        console.error('Error initializing feature toggle service:', error);
      });
  };

  useEffect(() => {
    if (isFeatureToggleServiceLoaded()) {
      handleFeatureToggleInitialization();
      return;
    }

    createFeatureToggleServiceV2(OPTIMIZELY_PROJECT_NAME, optimizelyKey);
    handleFeatureToggleInitialization();
  }, [optimizelyKey]);

  return {
    isReady,
  };
};
