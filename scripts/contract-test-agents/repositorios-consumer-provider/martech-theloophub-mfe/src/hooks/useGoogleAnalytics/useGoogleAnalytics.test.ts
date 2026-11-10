import { renderHook } from '@testing-library/react-hooks';

import { useGoogleAnalytics } from './useGoogleAnalytics';

const mockUseAnalyticsTrack = jest.fn();
const mockGetUserId = jest.fn();
const mockUseAuthenticationService = jest.fn();

jest.mock('martech-portal-shared-services', () => ({
  useAnalyticsTrack: () => mockUseAnalyticsTrack(),
}));

jest.mock('admin-portal-shared-services', () => ({
  useAuthenticationService: () => mockUseAuthenticationService(),
}));

describe('useGoogleAnalytics', () => {
  const mockAnalyticsTrack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyticsTrack.mockReset();
    mockGetUserId.mockReturnValue('test-user-123');
    mockUseAuthenticationService.mockReturnValue({
      getUserId: mockGetUserId,
    });
    mockUseAnalyticsTrack.mockReturnValue(mockAnalyticsTrack);
  });

  describe('Hook Initialization', () => {
    it('should return trackGA function', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      expect(typeof result.current).toBe('function');
    });

    it('should call useAnalyticsTrack on initialization', () => {
      renderHook(() => useGoogleAnalytics());

      expect(mockUseAnalyticsTrack).toHaveBeenCalled();
    });

    it('should call getUserId on initialization', () => {
      renderHook(() => useGoogleAnalytics());

      expect(mockGetUserId).toHaveBeenCalled();
    });
  });

  describe('trackGA Function', () => {
    it('should call analyticsTrack with correct parameters', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Button',
        event_action: 'Click',
        event_label: 'Submit Form',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith({
        event: 'GAEvent',
        event_category: 'Button',
        event_action: 'Click',
        event_label: 'Submit Form',
        userUid: 'test-user-123',
      });
    });

    it('should include userUid in analytics tracking', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Link',
        event_action: 'Navigate',
        event_label: 'External Link',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          userUid: 'test-user-123',
        }),
      );
    });

    it('should always set event as GAEvent', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Form',
        event_action: 'Submit',
        event_label: 'Contact Form',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'GAEvent',
        }),
      );
    });

    it('should track multiple events with different parameters', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Video',
        event_action: 'Play',
        event_label: 'Tutorial Video',
      });

      result.current({
        event_category: 'Download',
        event_action: 'Click',
        event_label: 'PDF Report',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledTimes(2);
      expect(mockAnalyticsTrack).toHaveBeenNthCalledWith(1, {
        event: 'GAEvent',
        event_category: 'Video',
        event_action: 'Play',
        event_label: 'Tutorial Video',
        userUid: 'test-user-123',
      });
      expect(mockAnalyticsTrack).toHaveBeenNthCalledWith(2, {
        event: 'GAEvent',
        event_category: 'Download',
        event_action: 'Click',
        event_label: 'PDF Report',
        userUid: 'test-user-123',
      });
    });
  });

  describe('User Identification', () => {
    it('should use correct userId when available', () => {
      mockGetUserId.mockReturnValue('user-456');

      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Menu',
        event_action: 'Open',
        event_label: 'Main Menu',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          userUid: 'user-456',
        }),
      );
    });

    it('should handle undefined userId', () => {
      mockGetUserId.mockReturnValue(undefined);

      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Page',
        event_action: 'View',
        event_label: 'Home Page',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          userUid: undefined,
        }),
      );
    });

    it('should handle null userId', () => {
      mockGetUserId.mockReturnValue(null);

      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Search',
        event_action: 'Submit',
        event_label: 'Product Search',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          userUid: null,
        }),
      );
    });

    it('should handle empty string userId', () => {
      mockGetUserId.mockReturnValue('');

      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Filter',
        event_action: 'Apply',
        event_label: 'Date Range Filter',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          userUid: '',
        }),
      );
    });
  });

  describe('Event Categories', () => {
    it('should track button events', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Button',
        event_action: 'Click',
        event_label: 'Export Button',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_category: 'Button',
        }),
      );
    });

    it('should track navigation events', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Navigation',
        event_action: 'Navigate',
        event_label: 'Dashboard',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_category: 'Navigation',
        }),
      );
    });

    it('should track form events', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Form',
        event_action: 'Submit',
        event_label: 'Login Form',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_category: 'Form',
        }),
      );
    });
  });

  describe('Event Actions', () => {
    it('should track click actions', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Card',
        event_action: 'Click',
        event_label: 'Product Card',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_action: 'Click',
        }),
      );
    });

    it('should track view actions', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Modal',
        event_action: 'View',
        event_label: 'Info Modal',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_action: 'View',
        }),
      );
    });

    it('should track submit actions', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Form',
        event_action: 'Submit',
        event_label: 'Newsletter Signup',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_action: 'Submit',
        }),
      );
    });
  });

  describe('Event Labels', () => {
    it('should track with descriptive labels', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Button',
        event_action: 'Click',
        event_label: 'Download Report - Q4 2024',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_label: 'Download Report - Q4 2024',
        }),
      );
    });

    it('should track with empty label', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Link',
        event_action: 'Click',
        event_label: '',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_label: '',
        }),
      );
    });
  });

  describe('Hook Stability', () => {
    it('should return function on each render', () => {
      const { result, rerender } = renderHook(() => useGoogleAnalytics());

      const firstRef = result.current;
      expect(typeof firstRef).toBe('function');

      rerender();
      const secondRef = result.current;
      expect(typeof secondRef).toBe('function');
    });

    it('should maintain userId across multiple calls', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Test1',
        event_action: 'Action1',
        event_label: 'Label1',
      });

      result.current({
        event_category: 'Test2',
        event_action: 'Action2',
        event_label: 'Label2',
      });

      expect(mockAnalyticsTrack).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ userUid: 'test-user-123' }),
      );
      expect(mockAnalyticsTrack).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({ userUid: 'test-user-123' }),
      );
    });
  });

  describe('Integration', () => {
    it('should use current userId from authentication service', () => {
      mockGetUserId.mockReturnValue('initial-user');

      const { result, rerender } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Action',
        event_action: 'Do',
        event_label: 'Thing',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          userUid: 'initial-user',
        }),
      );

      mockGetUserId.mockReturnValue('changed-user');
      rerender();

      result.current({
        event_category: 'Action',
        event_action: 'Do',
        event_label: 'Thing',
      });

      expect(mockAnalyticsTrack).toHaveBeenLastCalledWith(
        expect.objectContaining({
          userUid: 'changed-user',
        }),
      );
    });

    it('should call analyticsTrack from correct service', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      result.current({
        event_category: 'Test',
        event_action: 'Test',
        event_label: 'Test',
      });

      expect(mockUseAnalyticsTrack).toHaveBeenCalled();
      expect(mockAnalyticsTrack).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle when analyticsTrack throws error', () => {
      mockAnalyticsTrack.mockImplementation(() => {
        throw new Error('Analytics error');
      });

      const { result } = renderHook(() => useGoogleAnalytics());

      expect(() => {
        result.current({
          event_category: 'Button',
          event_action: 'Click',
          event_label: 'Test',
        });
      }).toThrow('Analytics error');
    });
  });

  describe('Parameter Validation', () => {
    it('should pass through event_category exactly as provided', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      const testCategory = 'Custom Category With Spaces & Special!@#';
      result.current({
        event_category: testCategory,
        event_action: 'Action',
        event_label: 'Label',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_category: testCategory,
        }),
      );
    });

    it('should pass through event_action exactly as provided', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      const testAction = 'Complex Action: [Multiple] {Parts}';
      result.current({
        event_category: 'Category',
        event_action: testAction,
        event_label: 'Label',
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_action: testAction,
        }),
      );
    });

    it('should pass through event_label exactly as provided', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      const testLabel = 'Label with unicode: émojis 🎉 and symbols ™®©';
      result.current({
        event_category: 'Category',
        event_action: 'Action',
        event_label: testLabel,
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          event_label: testLabel,
        }),
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long event parameters', () => {
      const { result } = renderHook(() => useGoogleAnalytics());

      const longString = 'A'.repeat(1000);
      result.current({
        event_category: longString,
        event_action: longString,
        event_label: longString,
      });

      expect(mockAnalyticsTrack).toHaveBeenCalledWith({
        event: 'GAEvent',
        event_category: longString,
        event_action: longString,
        event_label: longString,
        userUid: 'test-user-123',
      });
    });

    it('should work when analyticsTrack returns a value', () => {
      mockAnalyticsTrack.mockReturnValue({ success: true });

      const { result } = renderHook(() => useGoogleAnalytics());

      const returnValue = result.current({
        event_category: 'Test',
        event_action: 'Test',
        event_label: 'Test',
      });

      expect(returnValue).toEqual({ success: true });
    });

    it('should work when analyticsTrack returns undefined', () => {
      mockAnalyticsTrack.mockReturnValue(undefined);

      const { result } = renderHook(() => useGoogleAnalytics());

      const returnValue = result.current({
        event_category: 'Test',
        event_action: 'Test',
        event_label: 'Test',
      });

      expect(returnValue).toBeUndefined();
    });
  });
});
