import { renderHook } from '@testing-library/react-hooks';
import {
  createFeatureToggleServiceV2,
  useFeatureToggleServiceV2,
} from 'admin-portal-shared-services';
import FeatureToggleServiceV2 from 'admin-portal-shared-services/dist/services/featureToggle/featureToggleOptimizelyServiceV2/FeatureToggleServiceV2';

import { OPTIMIZELY_PROJECT_NAME } from '../../config/featureToggle';
import { useInitializeFeatureToggle } from './useInitializeFeatureToggle';

jest.mock('admin-portal-shared-services', () => ({
  createFeatureToggleServiceV2: jest.fn(),
  useFeatureToggleServiceV2: jest.fn(),
}));

describe('useInitializeFeatureToggle()', () => {
  const optimizelyKeyMock = 'mockOptimizelyKey';

  const setup = async () => {
    const { waitForNextUpdate } = renderHook(() =>
      useInitializeFeatureToggle(optimizelyKeyMock),
    );

    await waitForNextUpdate();
  };

  describe('given the application is rendering', () => {
    describe('when the feature toggle service is not loaded', () => {
      it('then calls createFeatureToggleServiceV2', async () => {
        const toggleServiceMock = {
          getIsReady: jest.fn().mockReturnValue(false),
          onReady: jest.fn().mockResolvedValue(true),
        } as unknown as FeatureToggleServiceV2;

        (useFeatureToggleServiceV2 as jest.Mock).mockReturnValue(
          toggleServiceMock,
        );

        await setup();

        expect(createFeatureToggleServiceV2).toHaveBeenCalledWith(
          OPTIMIZELY_PROJECT_NAME,
          optimizelyKeyMock,
        );
      });
    });

    describe('when the feature toggle service is loaded', () => {
      const originalServices = global.services;

      beforeEach(() => {
        global.services = {
          ...global.services,
          FeatureToggleOptimizelyV2: {
            [OPTIMIZELY_PROJECT_NAME]: jest.fn(),
          },
        };
      });

      afterAll(() => {
        global.services = originalServices;
      });

      it('then does not call createFeatureToggleServiceV2', async () => {
        await setup();

        expect(createFeatureToggleServiceV2).not.toBeCalled();
      });

      it('then calls useFeatureToggleServiceV2', async () => {
        await setup();

        expect(useFeatureToggleServiceV2).toBeCalledWith(
          OPTIMIZELY_PROJECT_NAME,
        );
      });

      describe('and service is ready', () => {
        it('then should call useFeatureToggleServiceV2', () => {
          (useFeatureToggleServiceV2 as jest.Mock).mockReturnValue({
            isFeatureEnabledAudiences: jest.fn(),
            getStore: jest.fn(),
            mockFeatureToggle: jest.fn(),
            onReady: jest.fn(),
            getIsReady: jest.fn().mockReturnValue(true),
          });

          renderHook(() => useInitializeFeatureToggle(optimizelyKeyMock));

          expect(useFeatureToggleServiceV2).toBeCalledWith(
            OPTIMIZELY_PROJECT_NAME,
          );
        });
      });
    });
  });
});
