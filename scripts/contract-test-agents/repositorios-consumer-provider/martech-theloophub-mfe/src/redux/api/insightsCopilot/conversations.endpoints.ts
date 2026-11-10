import type {
  AddFollowUpMessageResponse,
  DeleteConversationResponse,
  ListConversationsResponse,
  RenameConversationResponse,
  StartConversationResponse,
} from 'models/InsightsCopilot';
import {
  addFollowUpMessageUseCase,
  deleteConversationUseCase,
  getConversationDetailsUseCase,
  listConversationsUseCase,
  renameConversationUseCase,
  startConversationUseCase,
} from 'usecases/InsightsCopilotUseCase';
import type { GetConversationMessagesResult } from 'usecases/InsightsCopilotUseCase';

import { insightsCopilotApi } from './insightsCopilotApi';
import { createQueryFn } from './queryFnWrapper';

const conversationsApi = insightsCopilotApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversationDetails: builder.query<
      GetConversationMessagesResult,
      { conversationId: string; projectKey: string }
    >({
      queryFn: createQueryFn(getConversationDetailsUseCase),
    }),

    listConversations: builder.query<
      ListConversationsResponse[],
      { projectKey: string; page?: number; limit?: number }
    >({
      queryFn: createQueryFn(
        (arg: { projectKey: string; page?: number; limit?: number }) =>
          listConversationsUseCase({
            projectKey: arg.projectKey,
            page: arg.page,
            limit: arg.limit,
          }),
      ),
      serializeQueryArgs: ({ queryArgs }) => queryArgs.projectKey,
      merge: (currentCache, newItems, { arg }) => {
        if (!arg.page || arg.page === 1) {
          return newItems;
        }
        const existingIds = new Set(currentCache.map((c) => c.conversation_id));
        const unique = newItems.filter(
          (c) => !existingIds.has(c.conversation_id),
        );
        currentCache.push(...unique);
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg !== previousArg,
      providesTags: ['Conversations'],
    }),

    deleteConversation: builder.mutation<
      DeleteConversationResponse,
      { conversationId: string; projectKey: string }
    >({
      queryFn: createQueryFn(deleteConversationUseCase),
      async onQueryStarted(
        { conversationId, projectKey },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          conversationsApi.util.updateQueryData(
            'listConversations',
            { projectKey },
            (draft) => {
              const index = draft.findIndex(
                (conv) => conv.conversation_id === conversationId,
              );
              if (index !== -1) {
                draft.splice(index, 1);
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    renameConversation: builder.mutation<
      RenameConversationResponse,
      { conversationId: string; projectKey: string; name: string }
    >({
      queryFn: createQueryFn(renameConversationUseCase),
      async onQueryStarted(
        { conversationId, projectKey, name },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          conversationsApi.util.updateQueryData(
            'listConversations',
            { projectKey },
            (draft) => {
              const conversation = draft.find(
                (conv) => conv.conversation_id === conversationId,
              );
              if (conversation) {
                conversation.name = name;
              }
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    startConversation: builder.mutation<
      StartConversationResponse,
      {
        query: string;
        projectKey: string;
        signal?: AbortSignal;
        isSmartflow?: boolean;
        smartflowFunctionName?: string;
        smartflowParameters?: Record<string, string[]>;
      }
    >({
      queryFn: createQueryFn(startConversationUseCase),
      invalidatesTags: ['Conversations'],
    }),

    addFollowUpMessage: builder.mutation<
      AddFollowUpMessageResponse,
      {
        conversationId: string;
        query: string;
        projectKey: string;
        signal?: AbortSignal;
        isSmartflow?: boolean;
        smartflowFunctionName?: string;
        smartflowParameters?: Record<string, string[]>;
      }
    >({
      queryFn: createQueryFn(addFollowUpMessageUseCase),
    }),
  }),
});

export const {
  useLazyGetConversationDetailsQuery,
  useListConversationsQuery,
  useDeleteConversationMutation,
  useRenameConversationMutation,
  useStartConversationMutation,
  useAddFollowUpMessageMutation,
} = conversationsApi;
