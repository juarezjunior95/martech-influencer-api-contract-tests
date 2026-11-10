import type { SendFeedbackResponse } from 'models/InsightsCopilot';
import { sendFeedbackUseCase } from 'usecases/InsightsCopilotUseCase';

import { insightsCopilotApi } from './insightsCopilotApi';
import { createQueryFn } from './queryFnWrapper';

const feedbackApi = insightsCopilotApi.injectEndpoints({
  endpoints: (builder) => ({
    sendFeedback: builder.mutation<
      SendFeedbackResponse,
      {
        requestId: string;
        sentiment: 'positive' | 'negative' | 'neutral';
        scenario: string;
        selectedOptions: string[];
        comments?: string;
      }
    >({
      queryFn: createQueryFn(sendFeedbackUseCase),
    }),
  }),
});

export const { useSendFeedbackMutation } = feedbackApi;
