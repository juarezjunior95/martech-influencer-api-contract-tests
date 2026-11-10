import { renderHook } from '@testing-library/react-hooks';

import { useDataRefreshContext } from './DataRefreshModal';
import { useDataRefreshForTab } from './useDataRefreshForTab';

jest.mock('./DataRefreshModal', () => ({
  useDataRefreshContext: jest.fn(),
}));

describe('useDataRefreshForTab', () => {
  const mockUseDataRefreshContext = useDataRefreshContext as jest.Mock;
  let mockHandleDataForTab: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockHandleDataForTab = jest.fn();

    mockUseDataRefreshContext.mockReturnValue({
      modalOpen: false,
      handleDataForTab: mockHandleDataForTab,
      showAllRows: false,
    });
  });

  describe('Initial State', () => {
    it('should not call handleDataForTab when modalOpen is false', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      renderHook(() => useDataRefreshForTab('overview'));

      expect(mockHandleDataForTab).not.toHaveBeenCalled();
    });

    it('should call handleDataForTab when modalOpen is true', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      renderHook(() => useDataRefreshForTab('overview'));

      expect(mockHandleDataForTab).toHaveBeenCalledWith('overview');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);
    });

    it('should call useDataRefreshContext on mount', () => {
      renderHook(() => useDataRefreshForTab('overview'));

      expect(mockUseDataRefreshContext).toHaveBeenCalled();
    });
  });

  describe('modalOpen Changes', () => {
    it('should call handleDataForTab when modalOpen changes to true', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(() => useDataRefreshForTab('overview'));

      expect(mockHandleDataForTab).not.toHaveBeenCalled();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      rerender();

      expect(mockHandleDataForTab).toHaveBeenCalledWith('overview');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);
    });

    it('should not call handleDataForTab when modalOpen changes to false', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(() => useDataRefreshForTab('overview'));

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);

      mockHandleDataForTab.mockClear();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      rerender();

      expect(mockHandleDataForTab).not.toHaveBeenCalled();
    });

    it('should handle rapid modalOpen toggles', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(() => useDataRefreshForTab('overview'));

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });
      rerender();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });
      rerender();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });
      rerender();

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(2);
    });
  });

  describe('tabName Changes', () => {
    it('should call handleDataForTab with new tabName when modalOpen is true', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      expect(mockHandleDataForTab).toHaveBeenCalledWith('overview');

      rerender({ tabName: 'details' });

      expect(mockHandleDataForTab).toHaveBeenCalledWith('details');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(2);
    });

    it('should not call handleDataForTab when tabName changes but modalOpen is false', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      expect(mockHandleDataForTab).not.toHaveBeenCalled();

      rerender({ tabName: 'details' });

      expect(mockHandleDataForTab).not.toHaveBeenCalled();
    });

    it('should handle multiple tabName changes', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      rerender({ tabName: 'details' });
      rerender({ tabName: 'summary' });
      rerender({ tabName: 'analytics' });

      expect(mockHandleDataForTab).toHaveBeenCalledWith('overview');
      expect(mockHandleDataForTab).toHaveBeenCalledWith('details');
      expect(mockHandleDataForTab).toHaveBeenCalledWith('summary');
      expect(mockHandleDataForTab).toHaveBeenCalledWith('analytics');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(4);
    });
  });

  describe('showAllRows Changes', () => {
    it('should call handleDataForTab when showAllRows changes and modalOpen is true', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(() => useDataRefreshForTab('overview'));

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: true,
      });

      rerender();

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(2);
      expect(mockHandleDataForTab).toHaveBeenCalledWith('overview');
    });

    it('should not call handleDataForTab when showAllRows changes but modalOpen is false', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(() => useDataRefreshForTab('overview'));

      expect(mockHandleDataForTab).not.toHaveBeenCalled();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: true,
      });

      rerender();

      expect(mockHandleDataForTab).not.toHaveBeenCalled();
    });

    it('should handle multiple showAllRows toggles', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(() => useDataRefreshForTab('overview'));

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: true,
      });
      rerender();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });
      rerender();

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(3);
    });
  });

  describe('Combined Changes', () => {
    it('should handle modalOpen and tabName changing simultaneously', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      expect(mockHandleDataForTab).not.toHaveBeenCalled();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      rerender({ tabName: 'details' });

      expect(mockHandleDataForTab).toHaveBeenCalledWith('details');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);
    });

    it('should handle modalOpen, tabName and showAllRows changing together', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: true,
      });

      rerender({ tabName: 'details' });

      expect(mockHandleDataForTab).toHaveBeenCalledWith('details');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);
    });

    it('should handle tabName and showAllRows changing while modalOpen is true', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: true,
      });

      rerender({ tabName: 'details' });

      expect(mockHandleDataForTab).toHaveBeenCalledWith('details');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty tabName', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      renderHook(() => useDataRefreshForTab(''));

      expect(mockHandleDataForTab).toHaveBeenCalledWith('');
    });

    it('should handle tabName with special characters', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      renderHook(() => useDataRefreshForTab('tab-name_123.test'));

      expect(mockHandleDataForTab).toHaveBeenCalledWith('tab-name_123.test');
    });

    it('should handle very long tabName', () => {
      const longTabName = 'a'.repeat(1000);

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      renderHook(() => useDataRefreshForTab(longTabName));

      expect(mockHandleDataForTab).toHaveBeenCalledWith(longTabName);
    });

    it('should not call handleDataForTab when same tabName is set', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);

      rerender({ tabName: 'overview' });

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);
    });
  });

  describe('Multiple Hook Instances', () => {
    it('should work correctly with multiple instances for different tabs', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      renderHook(() => useDataRefreshForTab('overview'));
      renderHook(() => useDataRefreshForTab('details'));

      expect(mockHandleDataForTab).toHaveBeenCalledWith('overview');
      expect(mockHandleDataForTab).toHaveBeenCalledWith('details');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(2);
    });

    it('should handle each instance independently', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender: rerender1 } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      const { rerender: rerender2 } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'details' },
        },
      );

      mockHandleDataForTab.mockClear();

      rerender1({ tabName: 'summary' });

      expect(mockHandleDataForTab).toHaveBeenCalledWith('summary');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);

      rerender2({ tabName: 'analytics' });

      expect(mockHandleDataForTab).toHaveBeenCalledWith('analytics');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(2);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle typical modal open workflow', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(() => useDataRefreshForTab('overview'));

      expect(mockHandleDataForTab).not.toHaveBeenCalled();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      rerender();

      expect(mockHandleDataForTab).toHaveBeenCalledWith('overview');
      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      mockHandleDataForTab.mockClear();
      rerender();

      expect(mockHandleDataForTab).not.toHaveBeenCalled();
    });

    it('should handle tab switching while modal is open', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      expect(mockHandleDataForTab).toHaveBeenCalledWith('overview');

      rerender({ tabName: 'details' });
      expect(mockHandleDataForTab).toHaveBeenCalledWith('details');

      rerender({ tabName: 'summary' });
      expect(mockHandleDataForTab).toHaveBeenCalledWith('summary');

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(3);
    });

    it('should handle showAllRows toggle workflow', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(() => useDataRefreshForTab('overview'));

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: true,
      });

      rerender();

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(2);

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      rerender();

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(3);
    });

    it('should handle complete user interaction flow', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });
      rerender({ tabName: 'overview' });

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: true,
      });
      rerender({ tabName: 'overview' });

      rerender({ tabName: 'details' });

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: false,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });
      rerender({ tabName: 'details' });

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(3);
    });
  });

  describe('handleDataForTab Function', () => {
    it('should use current handleDataForTab from context', () => {
      const handler1 = jest.fn();

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: handler1,
        showAllRows: false,
      });

      renderHook(() => useDataRefreshForTab('overview'));

      expect(handler1).toHaveBeenCalledWith('overview');
      expect(handler1).toHaveBeenCalledTimes(1);
    });

    it('should call handleDataForTab on every dependency change', () => {
      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: false,
      });

      const { rerender } = renderHook(
        ({ tabName }) => useDataRefreshForTab(tabName),
        {
          initialProps: { tabName: 'overview' },
        },
      );

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(1);

      mockUseDataRefreshContext.mockReturnValue({
        modalOpen: true,
        handleDataForTab: mockHandleDataForTab,
        showAllRows: true,
      });

      rerender({ tabName: 'overview' });

      expect(mockHandleDataForTab).toHaveBeenCalledTimes(2);
    });
  });
});
