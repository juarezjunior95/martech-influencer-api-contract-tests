import { useCallback } from 'react';

import { FilterForm, FilterValue, Option } from 'models/Filters';

interface UseFilterHandlersProps {
  updateForm: (key: string, value: FilterValue) => void;
  updateAllForm: (form: FilterForm) => void;
  apply: () => void;
  resetToDefaults: (defaults: Record<string, FilterValue>) => void;
  defaults: FilterForm;
  applied: FilterForm;
  onApply?: () => void;
  onReset?: () => void;
  onClose?: () => void;
}

export const useFilterHandlers = ({
  updateForm,
  updateAllForm,
  apply,
  resetToDefaults,
  defaults,
  applied,
  onApply,
  onReset,
  onClose,
}: UseFilterHandlersProps) => {
  const handleAutoApplyChange = useCallback(
    (key: string, value: FilterValue) => {
      updateForm(key, value);
      setTimeout(() => {
        apply();
        onApply?.();
      }, 0);
    },
    [updateForm, apply, onApply],
  );

  const handleFormChange = useCallback(
    (key: string, value: FilterValue) => {
      updateForm(key, value);
    },
    [updateForm],
  );

  const handleApply = useCallback(() => {
    apply();
    onApply?.();
  }, [apply, onApply]);

  const handleReset = useCallback(() => {
    if (defaults && Object.keys(defaults).length > 0) {
      resetToDefaults(defaults);
      setTimeout(() => {
        onReset?.();
      }, 0);
    }
  }, [defaults, resetToDefaults, onReset]);

  const handleResetAndApply = useCallback(() => {
    handleReset();
    apply();
  }, [handleReset, apply, onReset]);

  const handleAutoApplyValueChange = useCallback(
    (fieldKey: string, option: Option) => {
      handleAutoApplyChange(fieldKey, option?.value);
    },
    [handleAutoApplyChange],
  );

  const handleCancelModalFilter = useCallback(() => {
    updateAllForm(applied);
  }, [applied, updateAllForm, onClose]);

  const handleFormValueChange = useCallback(
    (fieldKey: string, option: Option) => {
      handleFormChange(fieldKey, option?.value);
    },
    [handleFormChange],
  );

  return {
    handleAutoApplyChange,
    handleFormChange,
    handleApply,
    handleReset,
    handleResetAndApply,
    handleAutoApplyValueChange,
    handleCancelModalFilter,
    handleFormValueChange,
  };
};
