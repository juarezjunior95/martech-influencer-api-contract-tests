import { act, renderHook } from '@testing-library/react-hooks';
import { useWaterfallViewBySync } from 'pages/pillars/ValueCreation/PerformanceTool/hooks/useWaterfallViewBySync';

import { commercialResultsWaterfallData } from '../../__mocks__/Waterfall';
import { useWaterfallData } from './useWaterfallData';

const mockGetContextKey = jest.fn(() => 'global');
const mockIsViewByDisabled = jest.fn(() => false);
const mockHandleBarClick = jest.fn();
const mockHandleViewByChange = jest.fn();

jest.mock('pages/pillars/ValueCreation/PerformanceTool/config', () => ({
  volumeWaterfallConfig: {
    get getContextKey() {
      return mockGetContextKey;
    },
    get isViewByDisabled() {
      return mockIsViewByDisabled;
    },
    get handleBarClick() {
      return mockHandleBarClick;
    },
  },
}));

jest.mock(
  'pages/pillars/ValueCreation/PerformanceTool/hooks/useWaterfallViewBySync',
  () => ({
    useWaterfallViewBySync: jest.fn(() => ({
      handleViewByChange: mockHandleViewByChange,
    })),
  }),
);

const mockFormatMessage = jest.fn(({ id }: { id: string }) => id);
const mockUpdateForm = jest.fn();
const mockApply = jest.fn();

const defaultProps = {
  formatMessage: mockFormatMessage,
  activeSubFilters: { waterfall_view_by: 'brand' },
  dataFilters: { zone: ['LATAM'] } as any,
  applied: { kpis: 'volume', zone: 'LATAM' } as any,
  isGlobalZone: false,
  updateForm: mockUpdateForm,
  apply: mockApply,
};

function renderUseWaterfallData(props: Partial<typeof defaultProps> = {}) {
  return renderHook(() => useWaterfallData({ ...defaultProps, ...props }));
}

describe('useWaterfallData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetContextKey.mockReturnValue('global');
    mockIsViewByDisabled.mockReturnValue(false);
  });

  describe('return shape', () => {
    it('returns all expected keys', () => {
      const { result } = renderUseWaterfallData();

      expect(result.current).toMatchObject({
        waterfallData: expect.any(Object),
        title: expect.any(String),
        handleBarClick: expect.any(Function),
        handleViewByChange: expect.any(Function),
        loading: false,
        error: null,
        isViewByDisabled: expect.any(Boolean),
        contextKey: expect.any(String),
      });
    });

    it('exposes handleViewByChange from useWaterfallViewBySync', () => {
      const { result } = renderUseWaterfallData();

      expect(result.current.handleViewByChange).toBe(mockHandleViewByChange);
    });
  });

  describe('title', () => {
    it('calls formatMessage with the correct id', () => {
      renderUseWaterfallData();

      expect(mockFormatMessage).toHaveBeenCalledWith({
        id: 'ValueCreation.CommercialResults.performance.waterfallTitle',
      });
    });

    it('exposes the value returned by formatMessage as title', () => {
      mockFormatMessage.mockReturnValue('Waterfall Title');

      const { result } = renderUseWaterfallData();

      expect(result.current.title).toBe('Waterfall Title');
    });
  });

  describe('contextKey', () => {
    it('calls getContextKey with applied and isGlobalZone', () => {
      renderUseWaterfallData();

      expect(mockGetContextKey).toHaveBeenCalledWith(
        defaultProps.applied,
        defaultProps.isGlobalZone,
      );
    });

    it('exposes the value returned by getContextKey', () => {
      mockGetContextKey.mockReturnValue('brand');

      const { result } = renderUseWaterfallData();

      expect(result.current.contextKey).toBe('brand');
    });

    it('passes the contextKey to useWaterfallViewBySync', () => {
      mockGetContextKey.mockReturnValue('portfolio');

      renderUseWaterfallData();

      expect(useWaterfallViewBySync).toHaveBeenCalledWith(
        expect.objectContaining({ contextKey: 'portfolio' }),
      );
    });
  });

  describe('isViewByDisabled', () => {
    it('calls isViewByDisabled with contextKey, activeSubFilters, and applied', () => {
      mockGetContextKey.mockReturnValue('global');

      renderUseWaterfallData();

      expect(mockIsViewByDisabled).toHaveBeenCalledWith(
        'global',
        defaultProps.activeSubFilters,
        defaultProps.applied,
      );
    });

    it('returns false when config.isViewByDisabled returns false', () => {
      mockIsViewByDisabled.mockReturnValue(false);

      const { result } = renderUseWaterfallData();

      expect(result.current.isViewByDisabled).toBe(false);
    });

    it('returns true when config.isViewByDisabled returns true', () => {
      mockIsViewByDisabled.mockReturnValue(true);

      const { result } = renderUseWaterfallData();

      expect(result.current.isViewByDisabled).toBe(true);
    });
  });

  describe('handleBarClick', () => {
    it('does nothing when index is null', () => {
      const { result } = renderUseWaterfallData();

      act(() => {
        result.current.handleBarClick(null);
      });

      expect(mockHandleBarClick).not.toHaveBeenCalled();
    });

    it('calls volumeWaterfallConfig.handleBarClick with the correct params', () => {
      const { result } = renderUseWaterfallData();

      act(() => {
        result.current.handleBarClick(2);
      });

      expect(mockHandleBarClick).toHaveBeenCalledWith(
        expect.objectContaining({
          index: 2,
          labels: commercialResultsWaterfallData.labels,
          activeSubFilters: defaultProps.activeSubFilters,
          dataFilters: defaultProps.dataFilters,
          applied: defaultProps.applied,
          updateForm: mockUpdateForm,
          apply: mockApply,
        }),
      );
    });

    it('calls handleBarClick once per invocation', () => {
      const { result } = renderUseWaterfallData();

      act(() => {
        result.current.handleBarClick(0);
        result.current.handleBarClick(1);
      });

      expect(mockHandleBarClick).toHaveBeenCalledTimes(2);
    });

    it('keeps the same function reference when unrelated props change', () => {
      const { result, rerender } = renderHook(
        ({ isGlobalZone }) =>
          useWaterfallData({ ...defaultProps, isGlobalZone }),
        { initialProps: { isGlobalZone: false } },
      );

      const first = result.current.handleBarClick;

      rerender({ isGlobalZone: true });

      expect(result.current.handleBarClick).toBe(first);
    });

    it('updates function reference when activeSubFilters changes', () => {
      const { result, rerender } = renderHook(
        ({ activeSubFilters }) =>
          useWaterfallData({ ...defaultProps, activeSubFilters }),
        { initialProps: { activeSubFilters: { waterfall_view_by: 'brand' } } },
      );

      const first = result.current.handleBarClick;

      rerender({ activeSubFilters: { waterfall_view_by: 'portfolio' } });

      expect(result.current.handleBarClick).not.toBe(first);
    });

    it('updates function reference when applied changes', () => {
      const applied1 = { kpis: 'volume', zone: 'LATAM' } as any;
      const applied2 = { kpis: 'nr', zone: 'LATAM' } as any;

      const { result, rerender } = renderHook(
        ({ applied }) => useWaterfallData({ ...defaultProps, applied }),
        { initialProps: { applied: applied1 } },
      );

      const first = result.current.handleBarClick;

      rerender({ applied: applied2 });

      expect(result.current.handleBarClick).not.toBe(first);
    });
  });
});
