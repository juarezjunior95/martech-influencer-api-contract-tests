import React from 'react';

import { ChevronDown } from '@hexa-ui/icons';

import * as S from './Accordion.styles';

export interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
  dataTestId?: string;
}

export const AccordionItem = ({
  id,
  title,
  children,
  isOpen = false,
  onToggle,
  className,
  dataTestId,
}: AccordionItemProps) => {
  return (
    <S.AccordionItemWrapper
      className={className}
      data-testid={dataTestId ? `accordion-${dataTestId}` : undefined}
    >
      <S.AccordionTrigger
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
        data-testid={dataTestId ? `accordion-trigger-${dataTestId}` : undefined}
      >
        {title}
        <S.AccordionIcon isOpen={isOpen}>
          <ChevronDown size="medium" />
        </S.AccordionIcon>
      </S.AccordionTrigger>

      <S.AccordionContent isOpen={isOpen}>
        <S.AccordionContentInner
          id={`accordion-content-${id}`}
          data-testid={
            dataTestId ? `accordion-content-${dataTestId}` : undefined
          }
        >
          {children}
        </S.AccordionContentInner>
      </S.AccordionContent>
    </S.AccordionItemWrapper>
  );
};
