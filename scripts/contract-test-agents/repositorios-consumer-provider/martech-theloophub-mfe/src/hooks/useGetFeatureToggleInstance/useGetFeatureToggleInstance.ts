import { useEffect, useState } from 'react';

import { useFeatureToggleServiceV2 } from 'admin-portal-shared-services';
import FeatureToggleServiceV2 from 'admin-portal-shared-services/dist/services/featureToggle/featureToggleOptimizelyServiceV2/FeatureToggleServiceV2';
import { OPTIMIZELY_PROJECT_NAME } from 'config/featureToggle';

const initialState = {
  isReady: false,
};

export const useGetFeatureToggleInstance = () => {
  const [instanceStatus, setInstanceStatus] = useState<{
    isReady: boolean;
    featureToggleService?: FeatureToggleServiceV2;
  }>(initialState);

  const featureToggleService = useFeatureToggleServiceV2(
    OPTIMIZELY_PROJECT_NAME,
  );

  useEffect(() => {
    featureToggleService
      .onReady()
      .then(() => {
        setInstanceStatus({
          isReady: true,
          featureToggleService,
        });
      })
      .catch((error) => {
        console.error('Error initializing feature toggle service:', error);
        setInstanceStatus({
          isReady: false,
          featureToggleService: undefined,
        });
      });
  }, [featureToggleService]);

  return instanceStatus;
};
