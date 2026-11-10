import type { HTMLAttributes, ReactNode } from 'react';

export type MessageBubblePosition = 'user' | 'assistant';

export type MessageBubbleStatus =
  'default' | 'thinking' | 'failed' | 'error' | 'abandoned';

export interface MessageBubbleProps extends HTMLAttributes<HTMLDivElement> {
  /** Message position: user (right) or assistant (left) */
  position: MessageBubblePosition;
  /** Current status of the message */
  status?: MessageBubbleStatus;
  /** Message content - not shown when status is 'thinking' */
  children?: ReactNode;
  /** Callback for retry action in error states */
  onRetry?: () => void;
  /** Custom error message for failed/error states */
  errorMessage?: string;
}
