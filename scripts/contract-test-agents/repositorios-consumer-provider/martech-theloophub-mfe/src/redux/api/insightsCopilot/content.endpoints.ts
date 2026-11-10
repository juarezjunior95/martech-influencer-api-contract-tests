import type {
  GetBlobMarkdownResponse,
  GetFAQsResponse,
  LabelValuePair,
  SmartFlowConfig,
  SourceTable,
} from 'models/InsightsCopilot';
import {
  getBlobMarkdownUseCase,
  getExhaustiveValuesUseCase,
  getFAQsUseCase,
  getSmartFlowsUseCase,
} from 'usecases/InsightsCopilotUseCase';

import { insightsCopilotApi } from './insightsCopilotApi';
import { createQueryFn } from './queryFnWrapper';

const contentApi = insightsCopilotApi.injectEndpoints({
  endpoints: (builder) => ({
    getExhaustiveValues: builder.query<
      LabelValuePair[],
      { projectKey: string; sourceTables: SourceTable[] }
    >({
      queryFn: createQueryFn(getExhaustiveValuesUseCase),
    }),

    getBlobMarkdown: builder.query<
      GetBlobMarkdownResponse,
      { blobPath: string; projectKey: string; attachment?: boolean }
    >({
      queryFn: createQueryFn(getBlobMarkdownUseCase),
    }),

    getFAQs: builder.query<
      GetFAQsResponse[],
      { projectKey: string; language?: string }
    >({
      queryFn: createQueryFn((arg: { projectKey: string; language?: string }) =>
        getFAQsUseCase({
          projectKey: arg.projectKey,
          language: arg.language,
        }),
      ),
      providesTags: ['FAQs'],
    }),

    getSmartFlows: builder.query<SmartFlowConfig[], { projectKey: string }>({
      queryFn: createQueryFn((arg: { projectKey: string }) =>
        getSmartFlowsUseCase({ projectKey: arg.projectKey }),
      ),
      providesTags: ['SmartFlows'],
    }),
  }),
});

export const {
  useGetExhaustiveValuesQuery,
  useLazyGetBlobMarkdownQuery,
  useGetFAQsQuery,
  useGetSmartFlowsQuery,
} = contentApi;
