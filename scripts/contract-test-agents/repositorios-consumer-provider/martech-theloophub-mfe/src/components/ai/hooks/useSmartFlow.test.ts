import { act, renderHook } from '@testing-library/react-hooks';
import type { QueryParameter, SmartFlowConfig } from 'models/InsightsCopilot';

import { useSmartFlow } from './useSmartFlow';

const mockSmartFlows: SmartFlowConfig[] = [
  {
    id: 1,
    engine_domain: 'test',
    function_name: 'get_sales',
    title: 'Sales Report',
    query: 'Show sales',
    query_parameters: {},
  },
];

jest.mock('redux/api/insightsCopilot', () => ({
  useGetSmartFlowsQuery: () => ({ data: mockSmartFlows, isLoading: false }),
}));

const makeParam = (
  overrides: Partial<QueryParameter> = {},
): QueryParameter => ({
  input_type: 'static',
  placeholder_text: 'Select...',
  is_mandatory: false,
  allow_multiselect: false,
  default_options: [],
  ...overrides,
});

const mockFlow: SmartFlowConfig = {
  id: 1,
  engine_domain: 'test',
  function_name: 'get_sales',
  title: 'Sales Report',
  query: 'Show sales for @brand',
  query_parameters: {
    '@brand': makeParam({
      is_mandatory: true,
      default_options: [{ label: 'Budweiser', value: 'bud' }],
    }),
    '@region': makeParam({
      is_mandatory: false,
    }),
  },
};

describe('useSmartFlow', () => {
  it('starts with idle state', () => {
    const { result } = renderHook(() => useSmartFlow());
    expect(result.current.activeFlow).toBeNull();
    expect(result.current.showOverlay).toBe(false);
    expect(result.current.showDiagnosis).toBe(false);
  });

  it('exposes items from RTK query', () => {
    const { result } = renderHook(() => useSmartFlow());
    expect(result.current.items).toBe(mockSmartFlows);
  });

  it('setShowOverlay toggles overlay view', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.setShowOverlay(true));
    expect(result.current.showOverlay).toBe(true);
    expect(result.current.showDiagnosis).toBe(false);

    act(() => result.current.setShowOverlay(false));
    expect(result.current.showOverlay).toBe(false);
  });

  it('selectFlow sets active flow and switches to diagnosis', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));

    expect(result.current.activeFlow).toBe(mockFlow);
    expect(result.current.showDiagnosis).toBe(true);
    expect(result.current.showOverlay).toBe(false);
  });

  it('selectFlow initializes params with defaults', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));

    expect(result.current.selectedParams['@brand']).toEqual([
      { label: 'Budweiser', value: 'bud' },
    ]);
    expect(result.current.selectedParams['@region']).toBeUndefined();
  });

  it('selectFlow tracks required fields', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));

    expect(result.current.requiredFields).toEqual(['@brand']);
  });

  it('isReadyToSend is true when required fields have values', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));

    expect(result.current.isReadyToSend).toBe(true);
  });

  it('isReadyToSend is false when required field is empty', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));
    act(() => result.current.setParamValues('@brand', []));

    expect(result.current.isReadyToSend).toBe(false);
  });

  it('setParamValues updates selected params', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));
    act(() =>
      result.current.setParamValues('@region', [{ label: 'US', value: 'us' }]),
    );

    expect(result.current.selectedParams['@region']).toEqual([
      { label: 'US', value: 'us' },
    ]);
  });

  it('resolvedQuery resolves template with selected values', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));

    expect(result.current.resolvedQuery).toBe('Show sales for Budweiser');
  });

  it('smartFlowSendParams builds correct payload', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));

    expect(result.current.smartFlowSendParams).toEqual({
      is_smartflow: true,
      smartflow_function_name: 'get_sales',
      smartflow_parameters: {
        brand: ['bud'],
      },
    });
  });

  it('clearFlow resets all state', () => {
    const { result } = renderHook(() => useSmartFlow());
    act(() => result.current.selectFlow(mockFlow));
    act(() => result.current.clearFlow());

    expect(result.current.activeFlow).toBeNull();
    expect(result.current.showDiagnosis).toBe(false);
    expect(result.current.selectedParams).toEqual({});
    expect(result.current.requiredFields).toEqual([]);
    expect(result.current.resolvedQuery).toBe('');
    expect(result.current.isReadyToSend).toBe(false);
    expect(result.current.smartFlowSendParams).toBeNull();
  });

  describe('trySend', () => {
    it('should call onSend and clear flow when ready', () => {
      const onSend = jest.fn();
      const { result } = renderHook(() => useSmartFlow({ onSend }));

      act(() => result.current.selectFlow(mockFlow));

      let sent: boolean;
      act(() => {
        sent = result.current.trySend();
      });

      expect(sent!).toBe(true);
      expect(onSend).toHaveBeenCalledWith('Show sales for Budweiser', {
        is_smartflow: true,
        smartflow_function_name: 'get_sales',
        smartflow_parameters: { brand: ['bud'] },
      });
      expect(result.current.activeFlow).toBeNull();
    });

    it('should return false when no active flow', () => {
      const onSend = jest.fn();
      const { result } = renderHook(() => useSmartFlow({ onSend }));

      let sent: boolean;
      act(() => {
        sent = result.current.trySend();
      });

      expect(sent!).toBe(false);
      expect(onSend).not.toHaveBeenCalled();
    });

    it('should return false when not ready to send', () => {
      const onSend = jest.fn();
      const { result } = renderHook(() => useSmartFlow({ onSend }));

      act(() => result.current.selectFlow(mockFlow));
      act(() => result.current.setParamValues('@brand', []));

      let sent: boolean;
      act(() => {
        sent = result.current.trySend();
      });

      expect(sent!).toBe(false);
      expect(onSend).not.toHaveBeenCalled();
    });
  });
});
