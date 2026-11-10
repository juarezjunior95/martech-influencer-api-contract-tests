import { useEffect, useRef, useState } from 'react';

import { TextButton } from '@hexa-ui/components';
import { Plus } from '@hexa-ui/icons';
import { Select } from 'components/Form';
import { useBodyScrollLock } from 'hooks';
import { Option } from 'models/Filters';

import {
  FooterButton,
  HeaderContainer,
  HeaderTitle,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  OrderByField,
  OrderByLabel,
  StyledModalFilter,
} from './PillarResourcesFilterModal.styles';
import type { OrderByOption, PillarResourcesFilterModalProps } from './types';

const ORDER_BY_OPTIONS: Option[] = [
  { value: 'a-z', label: 'A-Z' },
  { value: 'z-a', label: 'Z-A' },
];

export const PillarResourcesFilterModal = ({
  isOpen,
  onClose,
  orderBy,
  onSetFilter,
}: PillarResourcesFilterModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [draftOrderBy, setDraftOrderBy] = useState<OrderByOption>(orderBy);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) setDraftOrderBy(orderBy);
  }, [isOpen, orderBy]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  const handleOverlayMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current?.contains(event.target as Node)) return;
    onClose();
  };

  const handleSetFilter = (e: React.MouseEvent) => {
    e.preventDefault();
    onSetFilter(draftOrderBy);
    onClose();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
  };

  const currentValue = ORDER_BY_OPTIONS.find(
    (opt) => opt.value === draftOrderBy,
  );

  return (
    <>
      <ModalOverlay isOpen={isOpen} onMouseDown={handleOverlayMouseDown} />
      <StyledModalFilter
        ref={modalRef}
        isOpen={isOpen}
        data-testid="pillar-resources-filter-modal"
      >
        <HeaderContainer>
          <HeaderTitle size="H3">Filter</HeaderTitle>
          <TextButton
            size="medium"
            onClick={handleClose}
            aria-label="Close filter modal"
            style={{
              backgroundColor: '#f6f6f6',
              borderRadius: '100%',
              width: '32px',
              height: '32px',
              marginLeft: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus
              size="medium"
              style={{
                fill: '#006EDB',
                stroke: '#006EDB',
                transform: 'rotate(45deg)',
              }}
            />
          </TextButton>
        </HeaderContainer>

        <ModalBody>
          <OrderByField>
            <OrderByLabel htmlFor="pillar-resources-order-by">
              Order by
            </OrderByLabel>
            <Select
              id="pillar-resources-order-by"
              options={ORDER_BY_OPTIONS}
              value={currentValue}
              onValueChange={(value) => {
                const option = value as Option;
                if (option?.value)
                  setDraftOrderBy(option.value as OrderByOption);
              }}
              placeholder="Select order"
              searchable={false}
              clearable={false}
            />
          </OrderByField>
        </ModalBody>

        <ModalFooter>
          <FooterButton size="medium" variant="secondary" onClick={handleClose}>
            Close
          </FooterButton>
          <FooterButton
            size="medium"
            variant="primary"
            onClick={handleSetFilter}
          >
            Set Filter
          </FooterButton>
        </ModalFooter>
      </StyledModalFilter>
    </>
  );
};
