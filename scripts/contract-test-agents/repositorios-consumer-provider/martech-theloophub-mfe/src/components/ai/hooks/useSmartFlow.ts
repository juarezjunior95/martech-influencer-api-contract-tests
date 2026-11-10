import { useCallback, useMemo, useState } from 'react';

import type {
  LabelValuePair,
  SmartFlowConfig,
  SmartFlowSendParams,
} from 'models/InsightsCopilot';
import { useGetSmartFlowsQuery } from 'redux/api/insightsCopilot';

import { resolveTemplate } from '../components/molecules/SmartFlowDiagnosis/templateParser';
import { DEFAULT_CLARA_PROJECT_KEY } from '../constants/projectKeys';

interface UseSmartFlowOptions {
  projectKey?: string;
  onSend?: (query: string, params?: SmartFlowSendParams) => void;
}

export function useSmartFlow(options: UseSmartFlowOptions = {}) {
  const { projectKey = DEFAULT_CLARA_PROJECT_KEY, onSend } = options;
  const {
    data: items = [],
    isFetching: loadingItems,
    isError: isItemsError,
    refetch: refetchItems,
  } = useGetSmartFlowsQuery({ projectKey });

  const [activeFlow, setActiveFlow] = useState<SmartFlowConfig | null>(null);
  const [selectedParams, setSelectedParams] = useState<
    Record<string, LabelValuePair[]>
  >({});
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [view, setView] = useState<'idle' | 'overlay' | 'diagnosis'>('idle');

  const showOverlay = view === 'overlay';
  const showDiagnosis = view === 'diagnosis';

  const setShowOverlay = useCallback(
    (show: boolean) => setView(show ? 'overlay' : 'idle'),
    [],
  );

  const selectFlow = useCallback((flow: SmartFlowConfig) => {
    setActiveFlow(flow);
    setView('diagnosis');

    const params = flow.query_parameters || {};
    const initialSelected: Record<string, LabelValuePair[]> = {};
    const required: string[] = [];

    Object.entries(params).forEach(([key, param]) => {
      if (param.default_options?.length > 0) {
        initialSelected[key] = param.default_options;
      }
      if (param.is_mandatory) {
        required.push(key);
      }
    });

    setSelectedParams(initialSelected);
    setRequiredFields(required);
  }, []);

  const clearFlow = useCallback(() => {
    setActiveFlow(null);
    setSelectedParams({});
    setRequiredFields([]);
    setView('idle');
  }, []);

  const setParamValues = useCallback(
    (key: string, values: LabelValuePair[]) => {
      setSelectedParams((prev) => ({
        ...prev,
        [key]: values,
      }));
    },
    [],
  );

  const resolvedQuery = useMemo(() => {
    if (!activeFlow) return '';
    return resolveTemplate(
      activeFlow.query,
      activeFlow.query_parameters || {},
      selectedParams,
    );
  }, [activeFlow, selectedParams]);

  const isReadyToSend = useMemo(() => {
    if (!activeFlow) return false;
    return requiredFields.every((field) => selectedParams[field]?.length > 0);
  }, [activeFlow, requiredFields, selectedParams]);

  const smartFlowSendParams = useMemo((): SmartFlowSendParams | null => {
    if (!activeFlow) return null;

    const parameters: Record<string, string[]> = {};
    Object.entries(selectedParams).forEach(([key, values]) => {
      if (values.length > 0) {
        const paramKey = key.startsWith('@') ? key.slice(1) : key;
        parameters[paramKey] = values.map((v) => v.value);
      }
    });

    return {
      is_smartflow: true,
      smartflow_function_name: activeFlow.function_name,
      smartflow_parameters: parameters,
    };
  }, [activeFlow, selectedParams]);

  const trySend = useCallback(() => {
    if (!activeFlow || !isReadyToSend) return false;
    onSend?.(resolvedQuery, smartFlowSendParams ?? undefined);
    clearFlow();
    return true;
  }, [
    activeFlow,
    isReadyToSend,
    onSend,
    resolvedQuery,
    smartFlowSendParams,
    clearFlow,
  ]);

  return {
    items,
    loadingItems,
    isItemsError,
    refetchItems,
    activeFlow,
    selectFlow,
    clearFlow,
    selectedParams,
    setParamValues,
    requiredFields,
    resolvedQuery,
    isReadyToSend,
    smartFlowSendParams,
    showOverlay,
    setShowOverlay,
    showDiagnosis,
    trySend,
  };
}
