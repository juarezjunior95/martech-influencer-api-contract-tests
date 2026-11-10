import { act, renderHook } from '@testing-library/react-hooks';
import { FilterForm } from 'models/Filters';

import { useFilterHandlers } from './useFilterHandlers';

describe('useFilterHandlers', () => {
  let mockUpdateForm: jest.Mock;
  let mockUpdateAllForm: jest.Mock;
  let mockApplied: jest.Mock;
  let mockApply: jest.Mock;
  let mockResetToDefaults: jest.Mock;
  let mockOnApply: jest.Mock;
  let mockOnReset: jest.Mock;

  const mockDefaults = {
    zone: 'LATAM',
    country: 'BR',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    mockUpdateForm = jest.fn();
    mockUpdateAllForm = jest.fn();
    mockApplied = jest.fn();
    mockApply = jest.fn();
    mockResetToDefaults = jest.fn();
    mockOnApply = jest.fn();
    mockOnReset = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('handleAutoApplyChange', () => {
    it('should update form and apply changes', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateAllForm: mockUpdateAllForm,
          updateForm: mockUpdateForm,
          applied: mockApplied as unknown as FilterForm,
          onApply: mockOnApply,
          onReset: mockOnReset,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
        }),
      );

      act(() => {
        result.current.handleAutoApplyChange('zone', 'NAZ');
      });

      expect(mockUpdateForm).toHaveBeenCalledWith('zone', 'NAZ');

      act(() => {
        jest.runAllTimers();
      });

      expect(mockApply).toHaveBeenCalled();
      expect(mockOnApply).toHaveBeenCalled();
    });

    it('should work when onApply is not provided', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
        }),
      );

      act(() => {
        result.current.handleAutoApplyChange('zone', 'NAZ');
        jest.runAllTimers();
      });

      expect(mockUpdateForm).toHaveBeenCalledWith('zone', 'NAZ');
      expect(mockApply).toHaveBeenCalled();
    });
  });

  describe('handleFormChange', () => {
    it('should only update form without applying', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
        }),
      );

      act(() => {
        result.current.handleFormChange('country', 'US');
      });

      expect(mockUpdateForm).toHaveBeenCalledWith('country', 'US');
      expect(mockApply).not.toHaveBeenCalled();
    });
  });

  describe('handleApply', () => {
    it('should call apply and onApply callback', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
          onApply: mockOnApply,
        }),
      );

      act(() => {
        result.current.handleApply();
      });

      expect(mockApply).toHaveBeenCalled();
      expect(mockOnApply).toHaveBeenCalled();
    });

    it('should work when onApply is not provided', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
        }),
      );

      act(() => {
        result.current.handleApply();
      });

      expect(mockApply).toHaveBeenCalled();
    });
  });

  describe('handleReset', () => {
    it('should reset to defaults without applying', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
          onReset: mockOnReset,
        }),
      );

      act(() => {
        result.current.handleReset();
      });

      expect(mockResetToDefaults).toHaveBeenCalledWith(mockDefaults);

      act(() => {
        jest.runAllTimers();
      });

      expect(mockOnReset).toHaveBeenCalled();
    });

    it('should not reset when defaults is empty', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: {},
          onReset: mockOnReset,
        }),
      );

      act(() => {
        result.current.handleReset();
      });

      expect(mockResetToDefaults).not.toHaveBeenCalled();
      expect(mockApply).not.toHaveBeenCalled();
      expect(mockOnReset).not.toHaveBeenCalled();
    });

    it('should work when onReset is not provided', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
        }),
      );

      act(() => {
        result.current.handleReset();
        jest.runAllTimers();
      });

      expect(mockResetToDefaults).toHaveBeenCalledWith(mockDefaults);
      expect(mockApply).not.toHaveBeenCalled();
    });
  });

  describe('handleAutoApplyValueChange', () => {
    it('should extract value from option and call handleAutoApplyChange', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
        }),
      );

      const option = { value: 'NAZ', label: 'NAZ' };

      act(() => {
        result.current.handleAutoApplyValueChange('zone', option);
      });

      expect(mockUpdateForm).toHaveBeenCalledWith('zone', 'NAZ');

      act(() => {
        jest.runAllTimers();
      });

      expect(mockApply).toHaveBeenCalled();
    });

    it('should handle undefined option', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          updateForm: mockUpdateForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
        }),
      );

      act(() => {
        result.current.handleAutoApplyValueChange(
          'zone',
          undefined as unknown as { value: string; label: string },
        );
      });

      expect(mockUpdateForm).toHaveBeenCalledWith('zone', undefined);
    });
  });

  describe('handleFormValueChange', () => {
    it('should extract value from option and call handleFormChange', () => {
      const { result } = renderHook(() =>
        useFilterHandlers({
          updateForm: mockUpdateForm,
          updateAllForm: mockUpdateAllForm,
          applied: mockApplied as unknown as FilterForm,
          apply: mockApply,
          resetToDefaults: mockResetToDefaults,
          defaults: mockDefaults,
        }),
      );

      const option = { value: 'US', label: 'United States' };

      act(() => {
        result.current.handleFormValueChange('country', option);
      });

      expect(mockUpdateForm).toHaveBeenCalledWith('country', 'US');
      expect(mockApply).not.toHaveBeenCalled();
    });
  });

  describe('callback stability', () => {
    it('should not recreate callbacks when dependencies do not change', () => {
      const props = {
        updateForm: mockUpdateForm,
        updateAllForm: mockUpdateAllForm,
        applied: mockApplied as unknown as FilterForm,
        apply: mockApply,
        resetToDefaults: mockResetToDefaults,
        defaults: mockDefaults,
        onApply: mockOnApply,
        onReset: mockOnReset,
      };

      const { result, rerender } = renderHook((p) => useFilterHandlers(p), {
        initialProps: props,
      });

      const firstCallbacks = result.current;

      rerender(props);

      expect(result.current.handleApply).toBe(firstCallbacks.handleApply);
      expect(result.current.handleReset).toBe(firstCallbacks.handleReset);
    });

    it('should recreate callbacks when defaults change', () => {
      const { result, rerender } = renderHook(
        ({ defaults }) =>
          useFilterHandlers({
            updateForm: mockUpdateForm,
            updateAllForm: mockUpdateAllForm,
            applied: mockApplied as unknown as FilterForm,
            apply: mockApply,
            resetToDefaults: mockResetToDefaults,
            defaults,
          }),
        { initialProps: { defaults: mockDefaults } },
      );

      const firstHandleReset = result.current.handleReset;

      rerender({ defaults: { zone: 'NAZ', country: 'US' } });

      expect(result.current.handleReset).not.toBe(firstHandleReset);
    });
  });
});
