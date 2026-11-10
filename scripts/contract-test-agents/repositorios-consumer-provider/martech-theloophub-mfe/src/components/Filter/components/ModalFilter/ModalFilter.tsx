import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

import { Heading, TextButton } from '@hexa-ui/components';
import { Plus } from '@hexa-ui/icons';
import {
  useBodyScrollLock,
  usePageFilterApplied,
  usePageFilterData,
  usePageFilterManagement,
} from 'hooks';

import { Accordion, AccordionItem, AccordionRef } from '../../../Accordion';
import {
  FILTER_CATEGORIES,
  groupFieldsByCategory,
} from '../../config/filterCategories';
import { useFilterHandlers } from '../../hooks/useFilterHandlers';
import { useTotalAppliedFilters } from '../../hooks/useTotalAppliedFilters';
import { FieldRenderer } from '../Fields';
import { FilterActions } from '../FilterActions/FilterActions';
import {
  ControlButton,
  ControlButtonContainer,
  FiltersCounter,
  Form,
  HeadingContainer,
  HeadingTitle,
  ModalOverlay,
  StyledFilterContainer,
  ModalFilter as StyledModalFilter,
} from './ModalFilter.styles';

interface ModalFilterProps {
  pageName: string;
  visibleFields?: string[];
  hiddenFields?: string[];
  onApply?: () => void;
  onReset?: () => void;
  isModalOpen: boolean;
  onClose: () => void;
  dataTestId?: string;
}

export const ModalFilter = ({
  pageName,
  visibleFields,
  hiddenFields = [],
  onApply,
  onReset,
  isModalOpen,
  onClose,
  dataTestId,
}: ModalFilterProps) => {
  const { dataFilters, defaults } = usePageFilterData(pageName);
  const { updateForm, updateAllForm, apply, resetToDefaults } =
    usePageFilterManagement(pageName);
  const { applied } = usePageFilterApplied(pageName);
  const allFields = Object.keys(dataFilters || {});

  const formFieldsList = useMemo(() => {
    if (visibleFields && visibleFields.length > 0) {
      return visibleFields.filter((field) => !hiddenFields.includes(field));
    }
    return allFields.filter((field) => !hiddenFields.includes(field));
  }, [visibleFields, hiddenFields, allFields]);

  const {
    handleApply,
    handleReset,
    handleFormValueChange,
    handleCancelModalFilter,
  } = useFilterHandlers({
    updateForm,
    updateAllForm,
    applied,
    apply,
    resetToDefaults,
    defaults: defaults || {},
    onApply,
    onReset,
    onClose,
  });

  useBodyScrollLock(isModalOpen);

  const { totalAppliedFilters } = useTotalAppliedFilters(pageName);

  const modalRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<AccordionRef>(null);

  // Group fields by category
  const groupedFields = groupFieldsByCategory(formFieldsList);

  // Get default open categories
  const defaultOpenCategories = FILTER_CATEGORIES.filter(
    (cat) => cat.defaultOpen,
  ).map((cat) => cat.id);

  const isAnySelectOpen = (): boolean => {
    const openSelects = document.querySelectorAll(
      '[class*="select__control--menu-is-open"]',
    );
    return openSelects.length > 0;
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isModalOpen) {
        if (!isAnySelectOpen()) {
          onClose();
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isModalOpen, onClose]);

  const handleOverlayMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      event.target instanceof Node &&
      modalRef.current?.contains(event.target)
    ) {
      return;
    }

    const hasOpenSelect = isAnySelectOpen();

    setTimeout(() => {
      if (!hasOpenSelect) {
        onClose();
      }
    }, 0);
  };

  const handleExpandAll = () => {
    accordionRef.current?.expandAll();
  };

  const handleCollapseAll = () => {
    accordionRef.current?.collapseAll();
  };

  const getStyles = (key: 'closeButton' | 'closeIcon') => {
    const styles = {
      closeButton: {
        backgroundColor: '#f6f6f6',
        borderRadius: '100%',
        width: '32px',
        height: '32px',
        marginLeft: '1.5rem',
      },
      closeIcon: {
        fill: '#006EDB',
        stroke: '#006EDB',
        margin: '0 auto',
        transform: 'rotate(45deg)',
      },
    };
    return styles[key];
  };

  if (!dataFilters || Object.keys(dataFilters).length === 0) {
    return null;
  }

  const hasFormFields = formFieldsList.length > 0;
  const hasCategories = Object.keys(groupedFields).length > 0;

  return createPortal(
    <>
      <ModalOverlay
        data-testid={
          dataTestId ? `modal-filter-overlay-${dataTestId}` : undefined
        }
        isOpen={isModalOpen}
        onMouseDown={handleOverlayMouseDown}
      />
      <StyledModalFilter
        data-testid={dataTestId ? `modal-filter-${dataTestId}` : undefined}
        ref={modalRef}
        isOpen={isModalOpen}
      >
        <HeadingContainer
          data-testid={
            dataTestId
              ? `modal-filter-heading-container-${dataTestId}`
              : undefined
          }
        >
          <HeadingTitle
            data-testid={
              dataTestId
                ? `modal-filter-heading-title-${dataTestId}`
                : undefined
            }
          >
            <Heading
              data-testid={
                dataTestId ? `modal-filter-heading-${dataTestId}` : undefined
              }
              size="H3"
            >
              Filters
            </Heading>
            <FiltersCounter
              data-testid={
                dataTestId
                  ? `modal-filter-filters-counter-${dataTestId}`
                  : undefined
              }
            >
              {totalAppliedFilters}
            </FiltersCounter>
          </HeadingTitle>
          {hasCategories && (
            <ControlButtonContainer
              data-testid={
                dataTestId
                  ? `modal-filter-control-button-container-${dataTestId}`
                  : undefined
              }
            >
              <ControlButton
                data-testid={
                  dataTestId
                    ? `modal-filter-control-button-expand-all-${dataTestId}`
                    : undefined
                }
                type="button"
                onClick={handleExpandAll}
              >
                Expand All
              </ControlButton>
              <ControlButton
                data-testid={
                  dataTestId
                    ? `modal-filter-control-button-retract-all-${dataTestId}`
                    : undefined
                }
                type="button"
                onClick={handleCollapseAll}
              >
                Retract All
              </ControlButton>
              <TextButton
                data-testid={
                  dataTestId
                    ? `modal-filter-control-button-close-${dataTestId}`
                    : undefined
                }
                size="medium"
                style={getStyles('closeButton')}
                onClick={onClose}
              >
                <Plus
                  data-testid={
                    dataTestId
                      ? `modal-filter-control-button-close-icon-${dataTestId}`
                      : undefined
                  }
                  size="medium"
                  style={getStyles('closeIcon')}
                />
              </TextButton>
            </ControlButtonContainer>
          )}
        </HeadingContainer>

        <Form
          data-testid={
            dataTestId ? `modal-filter-form-${dataTestId}` : undefined
          }
        >
          {hasCategories && (
            <Accordion
              dataTestId={
                dataTestId ? `${dataTestId}-modal-filter-accordion` : undefined
              }
              ref={accordionRef}
              mode="multiple"
              defaultOpen={defaultOpenCategories}
            >
              {FILTER_CATEGORIES.map((category) => {
                const categoryFields = groupedFields[category.id];

                if (!categoryFields || categoryFields.length === 0) {
                  return null;
                }

                return (
                  <AccordionItem
                    dataTestId={
                      dataTestId
                        ? `${dataTestId}-modal-filter-accordion-item-${category.id}`
                        : undefined
                    }
                    key={category.id}
                    id={category.id}
                    title={category.title}
                  >
                    <StyledFilterContainer>
                      {categoryFields.map((fieldKey) => (
                        <FieldRenderer
                          dataTestId={
                            dataTestId
                              ? `${dataTestId}-modal-filter-field-renderer-${fieldKey}`
                              : undefined
                          }
                          key={fieldKey}
                          fieldKey={fieldKey}
                          pageName={pageName}
                          isAutoApply={false}
                          onValueChange={handleFormValueChange}
                        />
                      ))}
                    </StyledFilterContainer>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}

          {hasFormFields && (
            <FilterActions
              dataTestId={
                dataTestId ? `${dataTestId}-filter-actions` : undefined
              }
              onReset={handleReset}
              onApply={handleApply}
              onClose={onClose}
              onCancel={handleCancelModalFilter}
              hasFormFields={hasFormFields}
            />
          )}
        </Form>
      </StyledModalFilter>
    </>,
    document.body,
  );
};
