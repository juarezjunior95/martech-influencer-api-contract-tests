export type FeedbackSentiment = 'positive' | 'negative' | null;

export interface FeedbackActionsProps {
  /** Current active sentiment for this message */
  activeSentiment: FeedbackSentiment;
  /** Called when user clicks thumb up */
  onThumbUp: () => void;
  /** Called when user clicks thumb down */
  onThumbDown: () => void;
  /** Raw message content for clipboard copy */
  copyContent: string;
  className?: string;
}
