import React from 'react';

import { DEFAULT_CLARA_PROJECT_KEY } from '../../../constants/projectKeys';
import type { Message } from '../../../types';
import { useAutoScroll } from '../../../utils/useAutoScroll';
import { Loader } from '../../atoms/Loader';
import { ExecutionLog } from '../../organisms/ExecutionLog';
import { FeedbackActions } from '../FeedbackActions';
import { MessageBubble } from '../MessageBubble';
import { MessageContent } from '../MessageContent';
import {
  Container,
  Content,
  FeedbackActionsWrapper,
  Row,
  Spacer,
} from './MessagesList.styles';
import type { MessagesListProps } from './MessagesList.types';

const getStatus = (message: Message) => {
  if (message.isLoading) return 'thinking' as const;
  if (message.isAbandoned) return 'abandoned' as const;
  if (message.isError && message.role === 'user') return 'failed' as const;
  if (message.isError) return 'error' as const;
  return 'default' as const;
};

export const MessagesList = ({
  messages,
  projectKey = DEFAULT_CLARA_PROJECT_KEY,
  isLoading = false,
  onRetry,
  className,
  getFeedbackSentiment,
  onThumbUp,
  onThumbDown,
  streamingSteps = [],
  streamingStatus = 'idle',
}: MessagesListProps) => {
  const { anchorRef } = useAutoScroll({
    deps: [messages, isLoading],
    streamingDep: streamingSteps.length,
  });

  const lastMessage = messages[messages.length - 1];
  const retryMessageId = lastMessage?.isError ? lastMessage.id : null;

  return (
    <>
      <Spacer />
      <Container className={className}>
        {messages.map((message, index) => {
          const isAssistant = message.role === 'assistant';
          const isLastMessage = index === messages.length - 1;
          const showFeedback =
            isAssistant && !message.isError && !message.isLoading;

          const hasPersistedSteps =
            isAssistant &&
            !message.isError &&
            message.executionSteps &&
            message.executionSteps.length > 0;

          const showDetailsInside =
            hasPersistedSteps ||
            (isLastMessage &&
              isAssistant &&
              !isLoading &&
              streamingStatus === 'complete' &&
              streamingSteps.length > 0);

          const position = message.role === 'user' ? 'user' : 'assistant';
          const canRetry =
            message.id === retryMessageId && message.role === 'user';

          const messageExecutionSteps = message.executionSteps ?? [];

          return (
            <React.Fragment key={message.id}>
              <Row position={position}>
                <Content>
                  <MessageBubble
                    position={position}
                    status={getStatus(message)}
                  >
                    {showDetailsInside && (
                      <ExecutionLog
                        steps={
                          isLastMessage && streamingSteps.length > 0
                            ? streamingSteps
                            : messageExecutionSteps
                        }
                        status="complete"
                      />
                    )}
                    {isAssistant && !message.isError ? (
                      <MessageContent
                        message={message}
                        projectKey={projectKey}
                      />
                    ) : (
                      message.content
                    )}
                  </MessageBubble>
                  {showFeedback && (
                    <FeedbackActionsWrapper>
                      <FeedbackActions
                        activeSentiment={
                          getFeedbackSentiment?.(
                            message.id,
                            message.feedbackSentiment,
                          ) ?? null
                        }
                        onThumbUp={() =>
                          onThumbUp?.(message.id, message.requestId ?? '')
                        }
                        onThumbDown={() =>
                          onThumbDown?.(message.id, message.requestId ?? '')
                        }
                        copyContent={message.content}
                      />
                    </FeedbackActionsWrapper>
                  )}
                </Content>
              </Row>
              {canRetry && (
                <Row position="assistant">
                  <MessageBubble
                    position="assistant"
                    status="error"
                    errorMessage="Failed to send."
                    onRetry={onRetry}
                  />
                </Row>
              )}
            </React.Fragment>
          );
        })}

        {isLoading && streamingStatus === 'streaming' && (
          <Row position="assistant">
            <Content>
              <MessageBubble position="assistant">
                <ExecutionLog steps={streamingSteps} status="streaming" />
              </MessageBubble>
            </Content>
          </Row>
        )}

        {isLoading && streamingStatus !== 'streaming' && (
          <Row position="assistant">
            <MessageBubble position="assistant" status="thinking">
              <Loader />
            </MessageBubble>
          </Row>
        )}

        <div ref={anchorRef} />
      </Container>
    </>
  );
};
