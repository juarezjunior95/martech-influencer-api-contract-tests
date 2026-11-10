import { forwardRef } from 'react';

import { Button } from '../../atoms/Button';
import { AlertCircle, Refresh } from '../../atoms/Icon';
import { Loader } from '../../atoms/Loader';
import {
  AbandonedBubble,
  AbandonedMessage,
  AlertIcon,
  Bubble,
  ErrorContent,
  ErrorMessage,
  FailedBubble,
  MessageRow,
  ThinkingBubble,
  ThinkingText,
} from './MessageBubble.styles';
import type { MessageBubbleProps } from './MessageBubble.types';

const DEFAULT_ERROR_MESSAGES = {
  failed: 'Failed to send.',
  error: 'Sorry, something went wrong.',
  abandoned:
    "This conversation was interrupted and can't continue. Please start a new chat.",
};

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  (
    {
      position,
      status = 'default',
      children,
      onRetry,
      errorMessage,
      className,
      ...props
    },
    ref,
  ) => {
    const isThinking = status === 'thinking' && position === 'assistant';
    const isFailed = status === 'failed' && position === 'user';
    const isError = status === 'error' && position === 'assistant';
    const isAbandoned = status === 'abandoned' && position === 'assistant';

    const getErrorMessage = () => {
      if (errorMessage) return errorMessage;
      if (isFailed) return DEFAULT_ERROR_MESSAGES.failed;
      if (isAbandoned) return DEFAULT_ERROR_MESSAGES.abandoned;
      return DEFAULT_ERROR_MESSAGES.error;
    };

    if (isThinking) {
      return (
        <ThinkingBubble
          ref={ref}
          $position={position}
          className={className}
          data-testid="message-bubble-thinking"
          {...props}
        >
          <ThinkingText data-testid="thinking-text">
            Thinking and discussing with Insights Copilot
          </ThinkingText>
          <Loader size="sm" />
        </ThinkingBubble>
      );
    }

    if (isFailed) {
      return (
        <FailedBubble
          ref={ref}
          $position={position}
          className={className}
          data-testid="message-bubble-failed"
          {...props}
        >
          <MessageRow>
            <span data-testid="failed-message">{children}</span>
            <AlertIcon>
              <AlertCircle size={24} />
            </AlertIcon>
          </MessageRow>
        </FailedBubble>
      );
    }

    if (isError) {
      return (
        <Bubble
          ref={ref}
          $position={position}
          className={className}
          data-testid="message-bubble-error"
          {...props}
        >
          <ErrorContent data-error-content>
            <ErrorMessage data-testid="error-message">
              {getErrorMessage()}
            </ErrorMessage>
            {onRetry && (
              <Button
                variant="tertiary"
                startContent={<Refresh size={14} />}
                onClick={onRetry}
              >
                Try again
              </Button>
            )}
          </ErrorContent>
        </Bubble>
      );
    }

    if (isAbandoned) {
      return (
        <AbandonedBubble
          ref={ref}
          $position={position}
          className={className}
          data-testid="message-bubble-abandoned"
          {...props}
        >
          <AbandonedMessage data-testid="abandoned-message">
            {errorMessage || DEFAULT_ERROR_MESSAGES.abandoned}
          </AbandonedMessage>
        </AbandonedBubble>
      );
    }

    return (
      <Bubble
        ref={ref}
        $position={position}
        className={className}
        data-testid="message-bubble-default"
        {...props}
      >
        {children}
      </Bubble>
    );
  },
);

MessageBubble.displayName = 'MessageBubble';
