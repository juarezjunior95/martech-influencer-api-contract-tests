import type { Message } from '../../../types';
import type { AgentStepEvent } from '../../organisms/ExecutionLog';
import type { FeedbackSentiment } from '../FeedbackActions';

export interface MessagesListProps {
  messages: Message[];
  projectKey?: string;
  isLoading?: boolean;
  onRetry?: () => void;
  className?: string;
  getFeedbackSentiment?: (
    messageId: string,
    serverSentiment?: FeedbackSentiment,
  ) => FeedbackSentiment;
  onThumbUp?: (messageId: string, requestId: string) => void;
  onThumbDown?: (messageId: string, requestId: string) => void;
  streamingSteps?: AgentStepEvent[];
  streamingStatus?: 'idle' | 'streaming' | 'complete';
}
