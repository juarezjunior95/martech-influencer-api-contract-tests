import { act, renderHook } from '@testing-library/react-hooks';
import { useFeatureToggleServiceV2 } from 'admin-portal-shared-services';

import { useGetFeatureToggleInstance } from './useGetFeatureToggleInstance';

jest.mock('admin-portal-shared-services', () => ({
  useFeatureToggleServiceV2: jest.fn(),
}));

describe('useGetFeatureToggleInstance', () => {
  const mockUseFeatureToggleServiceV2 = useFeatureToggleServiceV2 as jest.Mock;

  const mockFeatureToggleServiceInstance = {
    onReady: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseFeatureToggleServiceV2.mockReturnValue(
      mockFeatureToggleServiceInstance,
    );
  });

  it('should set isReady to true when the service is ready', async () => {
    mockFeatureToggleServiceInstance.onReady.mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() =>
      useGetFeatureToggleInstance(),
    );

    await act(async () => {
      await waitForNextUpdate({ timeout: 2000 });
    });

    expect(result.current.isReady).toBe(true);
    expect(result.current.featureToggleService).toBe(
      mockFeatureToggleServiceInstance,
    );
  });

  it('should set isReady to false when the service fails to be ready', async () => {
    mockFeatureToggleServiceInstance.onReady.mockRejectedValue(
      new Error('error'),
    );

    const { result, waitForNextUpdate } = renderHook(() =>
      useGetFeatureToggleInstance(),
    );

    await act(async () => {
      await waitForNextUpdate({ timeout: 2000 });
    });

    expect(result.current.isReady).toBe(false);
    expect(result.current.featureToggleService).toBeUndefined();
  });
});
