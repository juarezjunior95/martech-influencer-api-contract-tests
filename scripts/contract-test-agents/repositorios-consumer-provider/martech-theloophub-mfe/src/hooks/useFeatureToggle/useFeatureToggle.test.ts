import { act, renderHook } from '@testing-library/react-hooks';
import {
  useAuthenticationService,
  useFeatureToggleServiceV2,
} from 'admin-portal-shared-services';

import { useGetFeatureToggleInstance } from './../useGetFeatureToggleInstance';
import { useFeatureToggle } from './useFeatureToggle';

jest.mock('admin-portal-shared-services', () => ({
  useAuthenticationService: jest.fn(),
  useFeatureToggleServiceV2: jest.fn(),
}));

jest.mock('./../useGetFeatureToggleInstance', () => ({
  useGetFeatureToggleInstance: jest.fn(),
}));

describe('useFeatureToggle', () => {
  const mockUseAuthenticationService = useAuthenticationService as jest.Mock;
  const mockUseFeatureToggleServiceV2 = useFeatureToggleServiceV2 as jest.Mock;
  const mockUseGetFeatureToggleInstance =
    useGetFeatureToggleInstance as jest.Mock;

  const mockFeatureToggleService = {
    onReady: jest.fn().mockResolvedValue(true),
    isFeatureEnabledAudiences: jest.fn(),
  };

  const mockAuthenticationService = {
    getUserId: jest.fn(),
    getCountryB2C: jest.fn(),
    getRoles: jest.fn(),
    parseJwt: jest.fn(),
    getSupportedCountries: jest.fn(),
    getUserScopes: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuthenticationService.mockReturnValue(mockAuthenticationService);
    mockUseFeatureToggleServiceV2.mockReturnValue(mockFeatureToggleService);
    mockUseGetFeatureToggleInstance.mockReturnValue({
      isReady: true,
      featureToggleService: mockFeatureToggleService,
    });

    mockAuthenticationService.getUserId.mockReturnValue('user-id');
    mockAuthenticationService.getCountryB2C.mockReturnValue('country');
    mockAuthenticationService.getRoles.mockReturnValue(['role1', 'role2']);
    mockAuthenticationService.parseJwt.mockReturnValue({
      scopes: ['scope1', 'scope2'],
      supportedCountries: ['country1', 'country2'],
    });
    mockAuthenticationService.getUserScopes.mockReturnValue([
      'scope1',
      'scope2',
    ]);
    mockAuthenticationService.getSupportedCountries.mockReturnValue([
      'country1',
      'country2',
    ]);
  });

  it('should return true when the feature is enabled', async () => {
    mockFeatureToggleService.isFeatureEnabledAudiences.mockResolvedValue(true);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFeatureToggle('feature-toggle-name'),
    );

    await act(async () => await waitForNextUpdate());

    const [isToggle, isLoading] = result.current;
    expect(isToggle).toBe(true);
    expect(isLoading).toBe(false);
  });

  it('should return false when the feature is not enabled', async () => {
    mockFeatureToggleService.isFeatureEnabledAudiences.mockResolvedValue(false);

    const { result, waitForNextUpdate } = renderHook(() =>
      useFeatureToggle('feature-toggle-name'),
    );

    await act(async () => await waitForNextUpdate());

    const [isToggle, isLoading] = result.current;
    expect(isToggle).toBe(false);
    expect(isLoading).toBe(false);
  });
});
