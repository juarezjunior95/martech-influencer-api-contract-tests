import { useMemo } from 'react';

import { UseBffDataResponse } from 'hooks/useBffData/useBffData';

import {
  BigNumbersSectionData,
  LineBarChartsSectionData,
  WaterfallData,
  WaterfallSectionData,
} from '../types';

export type ComponentDataMap = {
  'overtime-performance': BigNumbersSectionData[];
  'overtime-trends': LineBarChartsSectionData;
  contribution: WaterfallSectionData;
  composition: WaterfallData;
};

export type ComponentId = keyof ComponentDataMap;

export interface PerformanceToolComponent {
  id: ComponentId;
  data: unknown;
}

export interface PerformanceToolResponse {
  view: string;
  components: PerformanceToolComponent[];
}

export type UsePerformanceToolDataResult<T extends ComponentId[]> = {
  [K in T[number]]: ComponentDataMap[K] | null | undefined;
};

export const usePerformanceToolData = <T extends ComponentId[]>(
  ids: T,
  response?: UseBffDataResponse,
): UsePerformanceToolDataResult<T> => {
  return useMemo(() => {
    if (!response?.data) {
      return {} as UsePerformanceToolDataResult<T>;
    }

    return ids.reduce((result, id) => {
      return {
        ...result,
        [id]: response.data?.[id] ?? null,
      };
    }, {} as UsePerformanceToolDataResult<T>);
  }, [ids, response]);
};
