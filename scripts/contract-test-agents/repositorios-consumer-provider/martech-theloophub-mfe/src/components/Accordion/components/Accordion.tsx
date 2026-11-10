import React, { forwardRef, useImperativeHandle, useState } from 'react';

import * as S from './Accordion.styles';
import { AccordionItemProps } from './AccordionItem';

// Types
type AccordionMode = 'single' | 'multiple';

interface AccordionProps {
  children: React.ReactNode;
  mode?: AccordionMode;
  defaultOpen?: string[];
  className?: string;
  dataTestId?: string;
}

export interface AccordionRef {
  expandAll: () => void;
  collapseAll: () => void;
  openItems: string[];
}

export const Accordion = forwardRef<AccordionRef, AccordionProps>(
  (
    { children, mode = 'single', defaultOpen = [], className, dataTestId },
    ref,
  ) => {
    const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

    const toggleItem = (id: string) => {
      setOpenItems((prev) => {
        if (mode === 'single') {
          return prev.includes(id) ? [] : [id];
        } else {
          return prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id];
        }
      });
    };

    const expandAll = () => {
      if (mode === 'multiple') {
        const allIds = React.Children.toArray(children)
          .filter(
            (child): child is React.ReactElement<AccordionItemProps> =>
              React.isValidElement(child) && typeof child.props.id === 'string',
          )
          .map((child) => child.props.id);
        setOpenItems(allIds);
      }
    };

    const collapseAll = () => {
      setOpenItems([]);
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      expandAll,
      collapseAll,
      openItems,
    }));

    return (
      <S.AccordionContainer
        className={className}
        data-testid={dataTestId ? `accordion-${dataTestId}` : undefined}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<AccordionItemProps>(child)) {
            return React.cloneElement(child, {
              isOpen: openItems.includes(child.props.id),
              onToggle: () => toggleItem(child.props.id),
            });
          }
          return child;
        })}
      </S.AccordionContainer>
    );
  },
);

Accordion.displayName = 'Accordion';
