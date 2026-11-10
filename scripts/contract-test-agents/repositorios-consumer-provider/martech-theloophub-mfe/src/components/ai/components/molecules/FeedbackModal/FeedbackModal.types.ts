import type { FeedbackSentiment } from '../FeedbackActions';

export interface FeedbackModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback to close/open the modal */
  onOpenChange: (open: boolean) => void;
  /** The sentiment type that triggered the modal */
  sentiment: NonNullable<FeedbackSentiment>;
  /** Called when user submits feedback - should return a promise */
  onSubmit: (
    selectedOptions: string[],
    comments: string,
  ) => void | Promise<void>;
}
