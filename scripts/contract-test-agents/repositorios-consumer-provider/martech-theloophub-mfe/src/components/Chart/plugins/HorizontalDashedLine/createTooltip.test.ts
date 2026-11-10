import { createTooltip, hideTooltip, removeTooltip } from './createTooltip';

describe('createTooltip', () => {
  const mockCanvas = {
    getBoundingClientRect: jest.fn(() => ({
      left: 100,
      top: 50,
      width: 400,
      height: 300,
    })),
  } as unknown as HTMLCanvasElement;

  const boxPos = { x: 10, y: 20, width: 100, height: 40 };

  beforeEach(() => {
    removeTooltip();
    jest.clearAllMocks();

    Object.defineProperty(globalThis, 'scrollX', { value: 0, writable: true });
    Object.defineProperty(globalThis, 'scrollY', { value: 0, writable: true });
  });

  afterEach(() => {
    removeTooltip();
  });

  describe('createTooltip', () => {
    it('should create a tooltip element on first call', () => {
      createTooltip(boxPos, mockCanvas, 'Hello.');

      const tooltipEl = document.body.querySelector(
        'div[style*="position: absolute"]',
      );

      expect(tooltipEl).not.toBeNull();
    });

    it('should reuse the same tooltip element on subsequent calls', () => {
      createTooltip(boxPos, mockCanvas, 'First.');
      const firstTooltip = document.body.querySelector(
        'div[style*="position: absolute"]',
      );

      createTooltip(boxPos, mockCanvas, 'Second.');
      const secondTooltip = document.body.querySelector(
        'div[style*="position: absolute"]',
      );

      expect(firstTooltip).toBe(secondTooltip);
    });

    it('should split text by "." and join with newlines', () => {
      createTooltip(boxPos, mockCanvas, 'First sentence. Second sentence.');

      const tooltipEl = document.body.querySelector(
        'div[style*="position: absolute"]',
      );

      expect(tooltipEl?.textContent).toContain('First sentence.');
      expect(tooltipEl?.textContent).toContain('Second sentence.');
    });

    it('should set tooltip to visible after creation', () => {
      createTooltip(boxPos, mockCanvas, 'Test text.');

      const tooltipEl = document.body.querySelector(
        'div[style*="position: absolute"]',
      ) as HTMLDivElement;

      expect(tooltipEl?.style.opacity).toBe('1');
      expect(tooltipEl?.style.visibility).toBe('visible');
    });

    it('should handle text without periods by appending a period', () => {
      createTooltip(boxPos, mockCanvas, 'No period text');

      const tooltipEl = document.body.querySelector(
        'div[style*="position: absolute"]',
      );

      expect(tooltipEl?.textContent).toContain('No period text.');
    });

    it('should filter out empty strings after split', () => {
      createTooltip(boxPos, mockCanvas, 'Sentence one.   . Sentence two.');

      const tooltipEl = document.body.querySelector(
        'div[style*="position: absolute"]',
      );

      expect(tooltipEl?.textContent).toContain('Sentence one.');
      expect(tooltipEl?.textContent).toContain('Sentence two.');
    });
  });

  describe('hideTooltip', () => {
    it('should set opacity to 0', () => {
      createTooltip(boxPos, mockCanvas, 'Text.');

      hideTooltip();

      const tooltipEl = document.body.querySelector(
        'div[style*="position: absolute"]',
      ) as HTMLDivElement;

      expect(tooltipEl?.style.opacity).toBe('0');
    });

    it('should not throw if called before tooltip is created', () => {
      expect(() => hideTooltip()).not.toThrow();
    });
  });

  describe('removeTooltip', () => {
    it('should remove the tooltip element from the DOM', () => {
      createTooltip(boxPos, mockCanvas, 'Text.');

      removeTooltip();

      const tooltipEl = document.body.querySelector(
        'div[style*="position: absolute"]',
      );

      expect(tooltipEl).toBeNull();
    });

    it('should not throw if called multiple times', () => {
      createTooltip(boxPos, mockCanvas, 'Text.');

      expect(() => {
        removeTooltip();
        removeTooltip();
      }).not.toThrow();
    });

    it('should not throw if called before tooltip is created', () => {
      expect(() => removeTooltip()).not.toThrow();
    });
  });
});
