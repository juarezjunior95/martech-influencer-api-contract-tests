import { useCallback, useState } from 'react';

import { useSendFeedbackMutation } from 'redux/api/insightsCopilot';

import type { FeedbackSentiment } from '../components/molecules/FeedbackActions';
import { toast } from '../utils/toastStore';

interface FeedbackState {
  sentiment: FeedbackSentiment;
}

interface ModalState {
  messageId: string;
  requestId: string;
  sentiment: NonNullable<FeedbackSentiment>;
}

export function useFeedback() {
  const [feedbackMut] = useSendFeedbackMutation();
  const [feedbackByMessage, setFeedbackByMessage] = useState<
    Record<string, FeedbackState>
  >({});
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const getSentiment = useCallback(
    (
      messageId: string,
      serverSentiment?: FeedbackSentiment,
    ): FeedbackSentiment =>
      feedbackByMessage[messageId]?.sentiment ?? serverSentiment ?? null,
    [feedbackByMessage],
  );

  const openModal = useCallback(
    (
      messageId: string,
      requestId: string,
      sentiment: NonNullable<FeedbackSentiment>,
    ) => {
      setModalState({ messageId, requestId, sentiment });
    },
    [],
  );

  const handleThumbUp = useCallback(
    (messageId: string, requestId: string) => {
      const current = feedbackByMessage[messageId]?.sentiment;
      if (current) return;
      openModal(messageId, requestId, 'positive');
    },
    [feedbackByMessage, openModal],
  );

  const handleThumbDown = useCallback(
    (messageId: string, requestId: string) => {
      const current = feedbackByMessage[messageId]?.sentiment;
      if (current) return;
      openModal(messageId, requestId, 'negative');
    },
    [feedbackByMessage, openModal],
  );

  const handleModalSubmit = useCallback(
    async (selectedOptions: string[], comments: string) => {
      if (!modalState) return;

      try {
        await feedbackMut({
          requestId: modalState.requestId,
          sentiment: modalState.sentiment,
          scenario: 'response',
          selectedOptions,
          comments: comments || undefined,
        }).unwrap();

        setFeedbackByMessage((prev) => ({
          ...prev,
          [modalState.messageId]: { sentiment: modalState.sentiment },
        }));
        toast({
          type: 'success',
          message: 'Feedback submitted successfully.',
        });
      } catch {
        toast({
          type: 'error',
          message: "Couldn't submit feedback. Please try again later.",
        });
      }

      setModalState(null);
    },
    [modalState, feedbackMut],
  );

  const handleModalClose = useCallback(() => {
    setModalState(null);
  }, []);

  return {
    getSentiment,
    handleThumbUp,
    handleThumbDown,
    handleModalSubmit,
    handleModalClose,
    modalState,
  };
}
