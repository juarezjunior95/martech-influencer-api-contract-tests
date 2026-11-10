import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useModalContext, useScopedModal } from 'contexts';
import { FilterDataAccessor } from 'domain/Filter';
import {
  useFiltersUrlSync,
  usePageFilterData,
  usePageFilterManagement,
  usePageFilterStatus,
} from 'hooks';

import { ModalFilter, QuickFilters } from './components';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { LoadingSkeleton } from './components/LoadingSkeleton/LoadingSkeleton';
import { StyledFilter } from './Filter.styles';

export interface FilterProps {
  dataTestId?: string;
  pageName: string;
  visibleFields?: string[];
  hidden?: boolean;
  onApply?: () => void;
  onReset?: () => void;
}

export const FILTER_MODAL_NAME = 'filter-modal';

export const Filter = ({
  dataTestId,
  pageName,
  visibleFields = [],
  hidden = false,
  onApply,
  onReset,
}: FilterProps) => {
  const { isLoading, isLoaded, isError } = usePageFilterStatus(pageName);
  const { setPage, loadPageFilters } = usePageFilterManagement(pageName);
  const { isOpen, close, open } = useScopedModal(FILTER_MODAL_NAME);
  const { availableFields, dataFilters } = usePageFilterData(
    pageName,
    visibleFields,
  );
  const { closeModal } = useModalContext();
  const isOpenRef = useRef(isOpen);
  const countryOptions = FilterDataAccessor.getInstance().getCountryOptions(
    dataFilters ?? {},
  );
  const hasAtLeastOneCountry = countryOptions.length > 0;
  const isHidden = useMemo(() => {
    if (isLoading) {
      return hidden;
    }
    return hidden || !hasAtLeastOneCountry;
  }, [hidden, hasAtLeastOneCountry, isLoading]);

  useFiltersUrlSync(isHidden, pageName);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (isOpenRef.current) {
        closeModal(FILTER_MODAL_NAME);
      }
    };
  }, [closeModal]);

  useEffect(() => {
    if (pageName) {
      setPage(pageName);
      loadPageFilters({ pageName });
    }
  }, [pageName, loadPageFilters, setPage]);

  const handleApply = useCallback(() => {
    onApply?.();
  }, [onApply]);

  const handleReset = useCallback(() => {
    onReset?.();
  }, [onReset]);

  const handleOpenModal = useCallback(() => {
    open();
  }, [open]);

  const handleCloseModal = useCallback(() => {
    close();
  }, [close]);

  if (isLoading) {
    return (
      <StyledFilter
        data-testid={dataTestId ? `filter-${dataTestId}` : undefined}
        hidden={hidden}
      >
        <LoadingSkeleton
          dataTestId={dataTestId ? `${dataTestId}-filter` : undefined}
        />
      </StyledFilter>
    );
  }

  if (isError) {
    return (
      <StyledFilter
        data-testid={dataTestId ? `filter-${dataTestId}` : undefined}
        hidden={hidden}
      >
        <ErrorMessage
          dataTestId={dataTestId ? `${dataTestId}-filter` : undefined}
        />
      </StyledFilter>
    );
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <StyledFilter
      data-testid={dataTestId ? `filter-${dataTestId}` : undefined}
      hidden={isHidden}
    >
      <QuickFilters
        dataTestId={dataTestId ? `${dataTestId}` : undefined}
        visibleFields={visibleFields}
        onReset={handleReset}
        onApply={handleApply}
        onOpenModal={handleOpenModal}
      />

      <ModalFilter
        dataTestId={dataTestId ? `${dataTestId}` : undefined}
        pageName={pageName}
        visibleFields={availableFields}
        onApply={handleApply}
        onReset={handleReset}
        isModalOpen={isOpen}
        onClose={handleCloseModal}
      />
    </StyledFilter>
  );
};
