import { useCallback } from 'react';

import { FilterDataStructure, FilterForm } from 'models';
import { volumeWaterfallConfig } from 'pages/pillars/ValueCreation/PerformanceTool/config';
import { useWaterfallViewBySync } from 'pages/pillars/ValueCreation/PerformanceTool/hooks/useWaterfallViewBySync';

import { commercialResultsWaterfallData } from '../../__mocks__/Waterfall';
import { UseWaterfallData } from '../../types';

interface UseWaterfallDataProps {
  formatMessage: (descriptor: { id: string }) => string;
  activeSubFilters: Record<string, unknown>;
  dataFilters: FilterDataStructure;
  applied: FilterForm;
  isGlobalZone: boolean;
  updateForm: (key: string, value: string) => void;
  apply: () => void;
}

export const useWaterfallData = ({
  formatMessage,
  activeSubFilters,
  dataFilters,
  applied,
  isGlobalZone,
  updateForm,
  apply,
}: UseWaterfallDataProps): UseWaterfallData => {
  const contextKey = volumeWaterfallConfig.getContextKey(applied, isGlobalZone);
  const isViewByDisabled = volumeWaterfallConfig.isViewByDisabled(
    contextKey,
    activeSubFilters,
    applied,
  );
  const handleBarClick = useCallback(
    (index: number | null) => {
      if (index === null) return;
      volumeWaterfallConfig.handleBarClick({
        index,
        labels: commercialResultsWaterfallData?.labels,
        activeSubFilters,
        dataFilters,
        applied,
        updateForm,
        apply,
      });
    },
    [activeSubFilters, dataFilters, applied, updateForm, apply],
  );

  const { handleViewByChange } = useWaterfallViewBySync({
    config: volumeWaterfallConfig,
    contextKey,
  });

  return {
    waterfallData: commercialResultsWaterfallData,
    title: formatMessage({
      id: 'ValueCreation.CommercialResults.performance.waterfallTitle',
    }),
    handleBarClick,
    loading: false,
    error: null,
    isViewByDisabled,
    contextKey,
    handleViewByChange,
  };
};
