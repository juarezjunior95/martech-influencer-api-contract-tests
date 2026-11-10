import { type ReactNode, useState } from 'react';

import { useId } from 'hooks/useId';

import {
  ChevronIcon,
  Content,
  Details,
  Summary,
  SummaryText,
} from './Accordion.styles';

export interface AccordionProps {
  children: ReactNode;
  summary?: string;
  defaultOpen?: boolean;
  className?: string;
}

export const Accordion = ({
  children,
  summary = 'Details',
  defaultOpen = false,
  className,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId('accordion');

  const handleToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    // Sync with native <details> state to prevent desynchronization
    setIsOpen(e.currentTarget.open);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <Details
      open={isOpen || undefined}
      onToggle={handleToggle}
      className={className}
    >
      <Summary
        aria-expanded={isOpen}
        aria-controls={contentId}
        onKeyDown={handleKeyDown}
      >
        <SummaryText>{summary}</SummaryText>
        <ChevronIcon size={16} isOpen={isOpen} aria-hidden="true" />
      </Summary>
      <Content id={contentId} role="region">
        {children}
      </Content>
    </Details>
  );
};

Accordion.displayName = 'Accordion';
