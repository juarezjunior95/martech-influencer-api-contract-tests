import { useEffect, useState } from 'react';

import { useAuthenticationService } from 'admin-portal-shared-services';
import { useGetFeatureToggleInstance } from 'hooks/useGetFeatureToggleInstance/useGetFeatureToggleInstance';

const createFeaturesObjectByToggleName = (
  toggles: string[],
  results: { status: string; value: boolean }[],
): { [key: string]: boolean } => {
  return toggles.reduce(
    (acc, toggle, index) => {
      acc[toggle] = results[index].value;
      return acc;
    },
    {} as { [key: string]: boolean },
  );
};

type TogglesState = {
  togglesReady: boolean;
  togglesValues: PromiseSettledResult<boolean | undefined>[];
  featuresListByToggleName: {
    [key: string]: boolean;
  };
};

export const useMultiplesFeatureToggles = (
  featureTogglesList: string[],
): TogglesState => {
  const { isReady, featureToggleService } = useGetFeatureToggleInstance();
  const authentication = useAuthenticationService();
  const userId = authentication.getUserId();
  const selectedZone = authentication.getCountryB2C();
  const roles = authentication.getRoles();
  const scopes = authentication.getUserScopes();
  const supportedCountries = authentication.getSupportedCountries();

  const [togglesState, setTogglesState] = useState<TogglesState>({
    togglesReady: false,
    togglesValues: [],
    featuresListByToggleName: {},
  });

  useEffect(() => {
    let isMounted = true;
    const fetchFeatureToggles = async () => {
      if (isReady && !togglesState.togglesReady) {
        try {
          const promiseList = featureTogglesList.map((toggle) =>
            featureToggleService?.isFeatureEnabledAudiences(toggle, userId, {
              scopes: scopes.join(','),
              roles: roles.join(','),
              supportedCountries: supportedCountries.join(','),
              country: selectedZone,
            }),
          );

          const response = await Promise.allSettled(promiseList);
          if (isMounted) {
            const result = response as { status: string; value: boolean }[];
            const featuresListByToggleName = createFeaturesObjectByToggleName(
              featureTogglesList,
              result,
            );

            setTogglesState({
              togglesReady: true,
              togglesValues: response,
              featuresListByToggleName,
            });
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching feature toggles:', error);
          }
        }
      }
    };

    fetchFeatureToggles();
    return () => {
      isMounted = false;
    };
  }, [
    isReady,
    userId,
    selectedZone,
    featureToggleService,
    featureTogglesList,
    togglesState.togglesReady,
  ]);

  return togglesState;
};
