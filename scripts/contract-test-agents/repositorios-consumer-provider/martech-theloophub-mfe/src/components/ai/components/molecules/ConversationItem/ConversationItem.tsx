import { forwardRef, useEffect, useRef, useState } from 'react';

import { cn } from '../../../utils/cn';
import { Dropdown } from '../../atoms/Dropdown';
import { AlertCircle, Edit, More, Trash } from '../../atoms/Icon';
import { Input } from '../../atoms/Input';
import { Tooltip } from '../../atoms/Tooltip';
import {
  ActionsWrap,
  DropdownTrigger,
  InputWrapper,
  Item,
  Title,
  Wrapper,
} from './ConversationItem.styles';
import type { ConversationItemProps } from './ConversationItem.types';

export const ConversationItem = forwardRef<
  HTMLDivElement,
  ConversationItemProps
>(
  (
    {
      id,
      title,
      hasError = false,
      isActive = false,
      onClick,
      onRename,
      onDelete,
      className,
      ...props
    },
    ref,
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(title);
    const [isTruncated, setIsTruncated] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    useEffect(() => {
      setEditValue(title);

      const checkTruncation = () => {
        if (titleRef.current) {
          const nextTruncated =
            titleRef.current.scrollWidth > titleRef.current.clientWidth;
          setIsTruncated(nextTruncated);
        }
      };

      checkTruncation();
      window.addEventListener('resize', checkTruncation);

      return () => {
        window.removeEventListener('resize', checkTruncation);
      };
    }, [title]);

    const handleRenameClick = () => {
      setIsEditing(true);
    };

    const handleSaveRename = () => {
      if (editValue.trim() && editValue !== title) {
        onRename?.(editValue.trim());
      }
      setIsEditing(false);
    };

    const handleCancelRename = () => {
      setEditValue(title);
      setIsEditing(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleSaveRename();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleCancelRename();
      }
    };

    const handleInputClick = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    return (
      <Wrapper
        ref={ref}
        className={cn(className)}
        data-conversation-id={id}
        {...props}
      >
        <Item
          onClick={isEditing ? undefined : onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              onClick?.();
            }
          }}
        >
          {isEditing ? (
            <InputWrapper>
              <Input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleInputKeyDown}
                onBlur={handleSaveRename}
                onClick={handleInputClick}
                fullWidth
                maxLength={100}
                aria-label="Rename conversation"
              />
            </InputWrapper>
          ) : (
            <Tooltip
              content={title}
              position="bottom"
              hidden={!isTruncated}
              fullWidth
            >
              <Title ref={titleRef} $active={isActive}>
                {title}
              </Title>
            </Tooltip>
          )}
          {hasError && !isEditing && (
            <AlertCircle size={16} data-testid="error-icon" />
          )}
        </Item>
        <ActionsWrap>
          <Dropdown>
            {({ open, toggle }) => (
              <>
                <DropdownTrigger open={open} onClick={toggle}>
                  <More size={16} />
                </DropdownTrigger>
                <Dropdown.Menu open={open} onClose={toggle}>
                  <Dropdown.Item
                    icon={<Edit size={16} />}
                    onClick={() => {
                      handleRenameClick();
                      toggle();
                    }}
                  >
                    Rename
                  </Dropdown.Item>
                  <Dropdown.Item
                    icon={<Trash size={16} />}
                    destructive
                    onClick={() => {
                      onDelete?.();
                      toggle();
                    }}
                  >
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </>
            )}
          </Dropdown>
        </ActionsWrap>
      </Wrapper>
    );
  },
);

ConversationItem.displayName = 'ConversationItem';
