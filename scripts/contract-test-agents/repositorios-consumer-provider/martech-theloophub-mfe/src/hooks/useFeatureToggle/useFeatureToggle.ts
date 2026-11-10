import { useCallback, useEffect, useState } from 'react';

import { useAuthenticationService } from 'admin-portal-shared-services';
import { useGetFeatureToggleInstance } from 'hooks/useGetFeatureToggleInstance/useGetFeatureToggleInstance';

export const useFeatureToggle = (
  featureToggleName: string,
): [boolean | undefined, boolean] => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isToggle, setIsToggle] = useState<boolean | undefined>(undefined);
  const authentication = useAuthenticationService();
  const userId = authentication.getUserId();
  const selectedZone = authentication.getCountryB2C();
  const roles = authentication.getRoles();
  const scopes = authentication.getUserScopes();
  const supportedCountries = authentication.getSupportedCountries();

  const { isReady, featureToggleService } = useGetFeatureToggleInstance();

  const fetchFeatureToggle = useCallback(async () => {
    try {
      await featureToggleService.onReady();
      const response = await featureToggleService.isFeatureEnabledAudiences(
        featureToggleName,
        userId,
        {
          scopes: scopes.join(','),
          roles: roles.join(','),
          supportedCountries: supportedCountries.join(','),
          country: selectedZone,
        },
      );
      setIsToggle(response);
    } catch (error) {
      console.error('Error checking feature toggle:', error);
      setIsToggle(false);
    } finally {
      setIsLoading(false);
    }
  }, [
    featureToggleService,
    userId,
    selectedZone,
    scopes,
    roles,
    supportedCountries,
    featureToggleName,
  ]);

  useEffect(() => {
    if (!isReady) return;

    fetchFeatureToggle();
  }, [fetchFeatureToggle, isReady]);

  return [isToggle, isLoading];
};
