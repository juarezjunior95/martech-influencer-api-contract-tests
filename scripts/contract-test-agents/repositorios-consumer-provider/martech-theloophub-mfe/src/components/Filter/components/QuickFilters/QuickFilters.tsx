import { useCallback, useMemo, useState } from 'react';

import {
  useFilterHandlers,
  useTotalAppliedFilters,
} from 'components/Filter/hooks';
import {
  useCurrentPage,
  useDebouncedMap,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterManagement,
} from 'hooks';

import {
  ClearAllButton,
  ExpandFiltersButton,
  FiltersButton,
  QuickFilterItem,
} from './components';
import { DEBOUNCE_DELAY, MAX_VISIBLE_FILTERS } from './constants';
import { QuickFiltersContainer } from './QuickFilters.styles';
import { applyFilterRules } from './rules';

interface QuickFiltersProps {
  visibleFields?: string[];
  onApply: () => void;
  onReset: () => void;
  onOpenModal: () => void;
  dataTestId?: string;
}

export const QuickFilters = ({
  visibleFields,
  onApply,
  onReset,
  onOpenModal,
  dataTestId,
}: QuickFiltersProps) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const { appliedDataFilters } = usePageFilterData(currentPage);
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateForm, updateAllForm, apply, resetToDefaults } =
    usePageFilterManagement(currentPage);
  const { defaults } = usePageFilterData(currentPage);

  const { handleAutoApplyChange, handleResetAndApply } = useFilterHandlers({
    updateForm,
    updateAllForm,
    applied,
    apply,
    resetToDefaults,
    defaults: defaults || {},
    onApply,
    onReset,
  });

  const debouncedOnValueChange = useDebouncedMap(
    handleAutoApplyChange,
    DEBOUNCE_DELAY,
  );

  const getCurrentValue = useCallback(
    (key: string) => String(applied[key] || ''),
    [applied],
  );

  const availableFields = useMemo(() => {
    return applyFilterRules(visibleFields, {
      pageName: currentPage,
      appliedFilters: applied,
      dataFilters: appliedDataFilters,
    });
  }, [visibleFields, currentPage, applied, appliedDataFilters]);

  const { totalFixedAppliedFilters } = useTotalAppliedFilters(currentPage);

  const hasMoreFilters = availableFields.length > MAX_VISIBLE_FILTERS;
  const fieldsToDisplay = isExpanded
    ? availableFields
    : availableFields.slice(0, MAX_VISIBLE_FILTERS);
  const hiddenFiltersCount = availableFields.length - MAX_VISIBLE_FILTERS;

  if (!visibleFields?.length) {
    return null;
  }

  return (
    <QuickFiltersContainer
      data-testid={dataTestId ? `quick-filters-${dataTestId}` : undefined}
    >
      <FiltersButton
        dataTestId={dataTestId ? `${dataTestId}-filters-button` : undefined}
        totalAppliedFilters={totalFixedAppliedFilters}
        onOpenModal={onOpenModal}
      />

      {fieldsToDisplay.map((fieldKey) => (
        <QuickFilterItem
          dataTestId={
            dataTestId
              ? `${dataTestId}-quick-filter-item-${fieldKey}`
              : undefined
          }
          key={fieldKey}
          fieldKey={fieldKey}
          currentPage={currentPage}
          debouncedOnValueChange={debouncedOnValueChange}
          getCurrentValue={getCurrentValue}
        />
      ))}

      {hasMoreFilters && (
        <ExpandFiltersButton
          isExpanded={isExpanded}
          hiddenFiltersCount={hiddenFiltersCount}
          onToggle={() => setIsExpanded(!isExpanded)}
          dataTestId={
            dataTestId ? `${dataTestId}-expand-filters-button` : undefined
          }
        />
      )}

      {totalFixedAppliedFilters > 0 && (
        <ClearAllButton
          onClearAll={handleResetAndApply}
          dataTestId={dataTestId ? `${dataTestId}-clear-all-button` : undefined}
        />
      )}
    </QuickFiltersContainer>
  );
};
