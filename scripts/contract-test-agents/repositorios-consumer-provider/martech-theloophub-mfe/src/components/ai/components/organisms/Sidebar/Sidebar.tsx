import { forwardRef, useEffect, useRef } from 'react';

import { Button } from '../../atoms/Button';
import { Close, ErrorStateIcon } from '../../atoms/Icon';
import { Loader } from '../../atoms/Loader';
import { ConversationItem } from '../../molecules/ConversationItem';
import { EmptyState } from '../../molecules/EmptyState';
import {
  Content,
  ConversationsList,
  Divider,
  EmptyStateWrapper,
  Header,
  LoadingMore,
  NewChatButton,
  SectionHeader,
  SectionTitle,
  Sentinel,
  SidebarCloseButton,
  StyledSidebar,
} from './Sidebar.styles';
import type { SidebarProps } from './Sidebar.types';

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      conversations,
      activeConversationId,
      onNewChat,
      onConversationClick,
      onConversationRename,
      onConversationDelete,
      onRetryLoadHistory,
      loadingHistory = false,
      hasHistoryError = false,
      onClose,
      onLoadMore,
      hasMore,
      loadingMore,
      newChatIcon,
      className,
      ...props
    },
    ref,
  ) => {
    const sentinelRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!hasMore || loadingMore) return;
      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onLoadMore?.();
          }
        },
        { root: listRef.current, threshold: 0 },
      );

      observer.observe(sentinel);
      return () => observer.disconnect();
    }, [hasMore, loadingMore, onLoadMore]);

    return (
      <StyledSidebar ref={ref} className={className} {...props}>
        <Header>
          <SidebarCloseButton
            type="button"
            variant="transparent"
            size="medium"
            iconMode
            onClick={onClose}
            aria-label="Close sidebar"
            startContent={<Close size={16} />}
          />
        </Header>

        <Content>
          <NewChatButton>
            <Button
              variant="action"
              fullWidth
              startContent={newChatIcon}
              onClick={onNewChat}
            >
              New Chat
            </Button>
          </NewChatButton>

          {hasHistoryError || conversations.length > 0 ? (
            <>
              <SectionHeader>
                <SectionTitle>Conversations</SectionTitle>
                <Divider />
              </SectionHeader>

              <ConversationsList ref={listRef}>
                {hasHistoryError ? (
                  <EmptyStateWrapper>
                    <EmptyState
                      icon={<ErrorStateIcon size={126} />}
                      title="Unable to load history"
                      description="Previous conversations could not be loaded due to temporary instability. Please try again in some minutes."
                      onRetry={() => onRetryLoadHistory?.()}
                      retryLabel="Try Again"
                      loading={loadingHistory}
                    />
                  </EmptyStateWrapper>
                ) : (
                  <>
                    {conversations.map((conversation) => (
                      <ConversationItem
                        key={conversation.id}
                        id={conversation.id}
                        title={conversation.title}
                        hasError={conversation.hasError}
                        isActive={conversation.id === activeConversationId}
                        onClick={() => onConversationClick?.(conversation)}
                        onRename={(newName) =>
                          onConversationRename?.(conversation, newName)
                        }
                        onDelete={() => onConversationDelete?.(conversation)}
                      />
                    ))}
                    {loadingMore && (
                      <LoadingMore>
                        <Loader variant="spinner" size="sm" />
                      </LoadingMore>
                    )}
                    {hasMore && !loadingMore && <Sentinel ref={sentinelRef} />}
                  </>
                )}
              </ConversationsList>
            </>
          ) : null}
        </Content>
      </StyledSidebar>
    );
  },
);

Sidebar.displayName = 'Sidebar';
