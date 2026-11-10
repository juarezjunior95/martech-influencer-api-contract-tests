import { ReactNode, useState } from 'react';

import { useId } from 'hooks/useId';

import { Chevron, Panel, Root, Trigger } from './Collapsible.styles';

export interface CollapsibleProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
}: Readonly<CollapsibleProps>) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = useId('collapsible');

  return (
    <Root data-testid="collapsible">
      <Trigger
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <Chevron
          open={isOpen}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Chevron>
        {title}
      </Trigger>
      <Panel id={panelId} role="region" open={isOpen}>
        {children}
      </Panel>
    </Root>
  );
}
