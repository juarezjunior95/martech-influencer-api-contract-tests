import { renderHook } from '@testing-library/react-hooks';
import {
  useAuthenticationService,
  useFeatureToggleServiceV2,
} from 'admin-portal-shared-services';

import { useGetFeatureToggleInstance } from './../useGetFeatureToggleInstance';
import { useMultiplesFeatureToggles } from './useMultipleFeatureToggles';

jest.mock('admin-portal-shared-services', () => ({
  useAuthenticationService: jest.fn(),
  useFeatureToggleServiceV2: jest.fn(),
}));
const useAuthenticationServiceMock = useAuthenticationService as jest.Mock;
const useFeatureToggleServiceV2Mock = useFeatureToggleServiceV2 as jest.Mock;

jest.mock('./../useGetFeatureToggleInstance', () => ({
  useGetFeatureToggleInstance: jest.fn(),
}));
const useGetFeatureToggleInstanceMock =
  useGetFeatureToggleInstance as jest.Mock;

describe('useMultiplesFeatureToggles', () => {
  const mockUserId = 'test-user-id';
  const mockZone = 'test-zone';
  const mockRoles = ['test-role'];
  const mockFeatureTogglesList = ['feature1', 'feature2'];
  const mockParseJwt = {
    scopes: ['scope1', 'scope2'],
    supportedCountries: ['country1', 'country2'],
  };
  const mockSupportedCountries = ['country1', 'country2'];
  const mockUserScopes = ['scope1', 'scope2'];

  const mockFeatureToggleService = {
    onReady: jest.fn().mockResolvedValue(true),
    isFeatureEnabledAudiences: jest.fn(),
  };

  beforeEach(() => {
    useAuthenticationServiceMock.mockReturnValue({
      getUserId: jest.fn().mockReturnValue(mockUserId),
      getCountryB2C: jest.fn().mockReturnValue(mockZone),
      getRoles: jest.fn().mockReturnValue(mockRoles),
      parseJwt: jest.fn().mockReturnValue(mockParseJwt),
      getSupportedCountries: jest.fn().mockReturnValue(mockSupportedCountries),
      getUserScopes: jest.fn().mockReturnValue(mockUserScopes),
    });
    useGetFeatureToggleInstanceMock.mockReturnValue({
      isReady: false,
      featureToggleService: null,
    });
    useFeatureToggleServiceV2Mock.mockReturnValue(mockFeatureToggleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return initial state when feature toggle service is not ready', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useMultiplesFeatureToggles(mockFeatureTogglesList),
    );

    expect(result.current).toEqual({
      togglesReady: false,
      togglesValues: [],
      featuresListByToggleName: {},
    });
  });
});
