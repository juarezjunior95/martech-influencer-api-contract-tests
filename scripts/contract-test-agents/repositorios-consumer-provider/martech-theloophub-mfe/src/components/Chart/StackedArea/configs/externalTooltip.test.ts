import {
  removeStackedAreaTooltip,
  stackedAreaExternalTooltip,
} from './externalTooltip';

const TOOLTIP_ID = 'stacked-area-tooltip';

function createMockDatasets() {
  return [
    {
      label: 'Wine',
      backgroundColor: '#DC143C',
      originalValues: [3.4, 3.1],
    },
    {
      label: 'Spirits',
      backgroundColor: '#4682B4',
      originalValues: [3.1, 2.8],
    },
    {
      label: 'Beyond Beer',
      backgroundColor: '#228B22',
      originalValues: [0.2, 0.3],
    },
    {
      label: 'Beer',
      backgroundColor: '#FFD700',
      originalValues: [93.3, 93.8],
    },
  ];
}

function createMockContext(overrides: Record<string, any> = {}) {
  const defaults = {
    opacity: 1,
    caretX: 50,
    caretY: 100,
    dataPoints: [{ datasetIndex: 0, dataIndex: 0 }],
    title: ['2021'],
    body: [{ lines: ['Beer: 93.3'] }],
    labelColors: [{ backgroundColor: '#FFD700', borderColor: '#FFD700' }],
  };

  const tooltip = { ...defaults, ...overrides };

  return {
    chart: {
      canvas: {
        getBoundingClientRect: jest.fn(() => ({
          left: 100,
          top: 200,
          width: 800,
          height: 400,
        })),
      },
      data: {
        datasets: overrides.datasets ?? createMockDatasets(),
      },
    },
    tooltip,
  };
}

describe('externalTooltip', () => {
  beforeEach(() => {
    removeStackedAreaTooltip();
    jest.clearAllMocks();

    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  afterEach(() => {
    removeStackedAreaTooltip();
  });

  describe('stackedAreaExternalTooltip', () => {
    it('should create a tooltip element on first call', () => {
      const context = createMockContext();

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID);
      expect(tooltipEl).not.toBeNull();
    });

    it('should reuse the same tooltip element on subsequent calls', () => {
      const context = createMockContext();

      stackedAreaExternalTooltip(context as any);
      const firstEl = document.getElementById(TOOLTIP_ID);

      stackedAreaExternalTooltip(context as any);
      const secondEl = document.getElementById(TOOLTIP_ID);

      expect(firstEl).toBe(secondEl);
    });

    it('should append tooltip to document.body', () => {
      const context = createMockContext();

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID);
      expect(tooltipEl?.parentElement).toBe(document.body);
    });

    it('should apply correct styles to tooltip element', () => {
      const context = createMockContext();

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.style.position).toBe('absolute');
      expect(tooltipEl.style.pointerEvents).toBe('none');
      expect(tooltipEl.style.zIndex).toBe('9999');
      expect(tooltipEl.style.borderRadius).toBe('4px');
      expect(tooltipEl.style.padding).toBe('8px 12px');
      expect(tooltipEl.style.fontSize).toBe('12px');
    });

    it('should hide tooltip when opacity is 0', () => {
      const context = createMockContext();
      stackedAreaExternalTooltip(context as any);

      const hiddenContext = createMockContext({ opacity: 0 });
      stackedAreaExternalTooltip(hiddenContext as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.style.opacity).toBe('0');
    });

    it('should hide tooltip when dataPoints is empty', () => {
      const context = createMockContext();
      stackedAreaExternalTooltip(context as any);

      const emptyContext = createMockContext({ dataPoints: [] });
      stackedAreaExternalTooltip(emptyContext as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.style.opacity).toBe('0');
    });

    it('should hide tooltip when dataPoints is undefined', () => {
      const context = createMockContext();
      stackedAreaExternalTooltip(context as any);

      const noDataPointsContext = createMockContext({ dataPoints: undefined });
      stackedAreaExternalTooltip(noDataPointsContext as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.style.opacity).toBe('0');
    });

    it('should set opacity to 1 when tooltip has data', () => {
      const context = createMockContext();

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.style.opacity).toBe('1');
    });

    it('should render title in tooltip content', () => {
      const context = createMockContext({ title: ['2023'] });

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.innerHTML).toContain('2023');
      expect(tooltipEl.innerHTML).toContain('font-weight:600');
    });

    it('should render all dataset segments in unified tooltip', () => {
      const context = createMockContext();

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.innerHTML).toContain('Beer');
      expect(tooltipEl.innerHTML).toContain('93.3%');
      expect(tooltipEl.innerHTML).toContain('Beyond Beer');
      expect(tooltipEl.innerHTML).toContain('0.2%');
      expect(tooltipEl.innerHTML).toContain('Spirits');
      expect(tooltipEl.innerHTML).toContain('3.1%');
      expect(tooltipEl.innerHTML).toContain('Wine');
      expect(tooltipEl.innerHTML).toContain('3.4%');
    });

    it('should render color boxes matching dataset backgroundColor', () => {
      const context = createMockContext();

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.innerHTML).toContain('background:#FFD700');
      expect(tooltipEl.innerHTML).toContain('background:#228B22');
      expect(tooltipEl.innerHTML).toContain('background:#4682B4');
      expect(tooltipEl.innerHTML).toContain('background:#DC143C');
    });

    it('should use data from correct column index', () => {
      const context = createMockContext({
        dataPoints: [{ datasetIndex: 0, dataIndex: 1 }],
        title: ['2022'],
      });

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.innerHTML).toContain('93.8%');
      expect(tooltipEl.innerHTML).toContain('0.3%');
      expect(tooltipEl.innerHTML).toContain('2.8%');
      expect(tooltipEl.innerHTML).toContain('3.1%');
    });

    it('should skip datasets without originalValues', () => {
      const context = createMockContext({
        datasets: [
          { label: 'Beer', backgroundColor: '#FFD700', originalValues: [90] },
          { label: 'NoData', backgroundColor: '#000' },
        ],
      });

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.innerHTML).toContain('Beer');
      expect(tooltipEl.innerHTML).not.toContain('NoData');
    });

    it('should handle empty title array', () => {
      const context = createMockContext({ title: [] });

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.innerHTML).not.toContain('font-weight:600');
    });

    it('should handle undefined title', () => {
      const context = createMockContext({ title: undefined });

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl).toBeDefined();
    });

    it('should position tooltip based on canvas rect and caret', () => {
      const context = createMockContext({ caretX: 50, caretY: 100 });

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.style.left).toBe('150px');
      expect(tooltipEl.style.top).toBe('300px');
    });

    it('should account for window scroll in positioning', () => {
      Object.defineProperty(window, 'scrollX', { value: 20, writable: true });
      Object.defineProperty(window, 'scrollY', { value: 30, writable: true });

      const context = createMockContext({ caretX: 50, caretY: 100 });

      stackedAreaExternalTooltip(context as any);

      const tooltipEl = document.getElementById(TOOLTIP_ID) as HTMLDivElement;
      expect(tooltipEl.style.left).toBe('170px');
      expect(tooltipEl.style.top).toBe('330px');
    });
  });

  describe('removeStackedAreaTooltip', () => {
    it('should remove the tooltip element from the DOM', () => {
      const context = createMockContext();
      stackedAreaExternalTooltip(context as any);

      expect(document.getElementById(TOOLTIP_ID)).not.toBeNull();

      removeStackedAreaTooltip();

      expect(document.getElementById(TOOLTIP_ID)).toBeNull();
    });

    it('should not throw when tooltip does not exist', () => {
      expect(() => removeStackedAreaTooltip()).not.toThrow();
    });

    it('should not throw when called multiple times', () => {
      const context = createMockContext();
      stackedAreaExternalTooltip(context as any);

      expect(() => {
        removeStackedAreaTooltip();
        removeStackedAreaTooltip();
      }).not.toThrow();
    });

    it('should allow a new tooltip to be created after removal', () => {
      const context = createMockContext();

      stackedAreaExternalTooltip(context as any);
      const firstEl = document.getElementById(TOOLTIP_ID);
      expect(firstEl).not.toBeNull();

      removeStackedAreaTooltip();
      expect(document.getElementById(TOOLTIP_ID)).toBeNull();

      stackedAreaExternalTooltip(context as any);
      const newEl = document.getElementById(TOOLTIP_ID);
      expect(newEl).not.toBeNull();
      expect(newEl).not.toBe(firstEl);
    });
  });
});
