import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { initialAxiosIC } from 'Api/ApiIC';
import type { AxiosError } from 'axios';

const axiosBaseQuery: BaseQueryFn<
  {
    url: string;
    method?: string;
    data?: unknown;
    params?: Record<string, unknown>;
  },
  unknown,
  { status?: number; data?: unknown }
> = async ({ url, method = 'GET', data, params }) => {
  try {
    const result = await initialAxiosIC({ url, method, data, params });
    return { data: result.data };
  } catch (err) {
    const axiosError = err as AxiosError;
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      },
    };
  }
};

export const insightsCopilotApi = createApi({
  reducerPath: 'insightsCopilotApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['FAQs', 'SmartFlows', 'Conversations'],
  endpoints: () => ({}),
});
