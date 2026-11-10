import { forwardRef } from 'react';

import { BetaTag } from '../../atoms/BetaTag';
import { Button } from '../../atoms/Button';
import { Menu } from '../../atoms/Icon';
import { ActionSlot, Header } from './ChatHeader.styles';
import type { ChatHeaderProps } from './ChatHeader.types';

export const ChatHeader = forwardRef<HTMLDivElement, ChatHeaderProps>(
  ({ onMenuClick, actionButton, className, ...props }, ref) => {
    return (
      <Header
        ref={ref}
        className={className}
        data-testid="chat-header"
        {...props}
      >
        <Button
          variant="transparent"
          iconMode
          size="large"
          onClick={onMenuClick}
          aria-label="Open menu"
          startContent={<Menu size={24} />}
        />

        <BetaTag />

        {actionButton && (
          <ActionSlot data-testid="chat-header-action-slot">
            {actionButton}
          </ActionSlot>
        )}
      </Header>
    );
  },
);

ChatHeader.displayName = 'ChatHeader';
