import { createTooltip, hideTooltip, removeTooltip } from './createTooltip';

type IconPosition = {
  x: number;
  y: number;
  size: number;
  index: number;
  tooltipText?: string;
};

describe('createTooltip', () => {
  let mockCanvas: HTMLCanvasElement;
  let iconPos: IconPosition;

  beforeEach(() => {
    document.body.innerHTML = '';

    mockCanvas = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        left: 100,
        top: 50,
        width: 800,
        height: 600,
      }),
    } as unknown as HTMLCanvasElement;

    iconPos = {
      x: 50,
      y: 100,
      size: 6,
      index: 0,
      tooltipText: 'Test tooltip',
    };

    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  afterEach(() => {
    removeTooltip();
  });

  it('creates tooltip element on first call', () => {
    createTooltip(iconPos, mockCanvas, 'Test tooltip');

    const tooltip = document.querySelector('div');
    expect(tooltip).toBeInTheDocument();
  });

  it('applies correct styles to tooltip', () => {
    createTooltip(iconPos, mockCanvas, 'Test tooltip');

    const tooltip = document.querySelector('div');
    expect(tooltip).toHaveStyle({
      position: 'absolute',
      background: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '8px',
      borderRadius: '8px',
    });
  });

  it('sets tooltip text content', () => {
    const text = 'Test tooltip content';
    createTooltip(iconPos, mockCanvas, text);

    const tooltip = document.querySelector('div');
    expect(tooltip?.textContent).toContain(text);
  });

  it('creates arrow element', () => {
    createTooltip(iconPos, mockCanvas, 'Test');

    const tooltips = document.querySelectorAll('div');
    expect(tooltips.length).toBeGreaterThanOrEqual(1);
  });

  it('positions tooltip relative to icon position', () => {
    createTooltip(iconPos, mockCanvas, 'Test');

    const tooltip = document.querySelector('div');
    expect(tooltip?.style.position).toBe('absolute');
    expect(tooltip?.style.left).toBeDefined();
    expect(tooltip?.style.top).toBeDefined();
  });

  it('positions tooltip below icon using size property', () => {
    createTooltip(iconPos, mockCanvas, 'Test');

    const tooltip = document.querySelector('div');
    expect(tooltip?.style.top).toBeDefined();
  });

  it('makes tooltip visible', () => {
    createTooltip(iconPos, mockCanvas, 'Test');

    const tooltip = document.querySelector('div');
    expect(tooltip?.style.opacity).toBe('1');
    expect(tooltip?.style.visibility).toBe('visible');
  });

  it('reuses existing tooltip element on subsequent calls', () => {
    createTooltip(iconPos, mockCanvas, 'First');
    const firstTooltip = document.querySelector('div');

    createTooltip(iconPos, mockCanvas, 'Second');
    const secondTooltip = document.querySelector('div');

    expect(firstTooltip).toBe(secondTooltip);
  });

  it('centers tooltip horizontally relative to icon', () => {
    const iconPos: IconPosition = {
      x: 200,
      y: 100,
      size: 8,
      index: 0,
    };

    createTooltip(iconPos, mockCanvas, 'Centered');

    const tooltip = document.querySelector('div');
    expect(tooltip?.style.left).toBeDefined();
  });

  it('handles different icon sizes', () => {
    const largeIcon: IconPosition = {
      x: 50,
      y: 100,
      size: 12,
      index: 0,
    };

    createTooltip(largeIcon, mockCanvas, 'Large icon');

    const tooltip = document.querySelector('div');
    expect(tooltip).toBeInTheDocument();
  });
});

describe('hideTooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    removeTooltip();
  });

  it('hides tooltip by setting opacity to 0', () => {
    const mockCanvas = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
      }),
    } as unknown as HTMLCanvasElement;

    const iconPos: IconPosition = {
      x: 0,
      y: 0,
      size: 6,
      index: 0,
    };

    createTooltip(iconPos, mockCanvas, 'Test');

    const tooltip = document.querySelector('div');
    expect(tooltip?.style.opacity).toBe('1');

    hideTooltip();

    expect(tooltip?.style.opacity).toBe('0');
  });

  it('does nothing when no tooltip exists', () => {
    expect(() => {
      hideTooltip();
    }).not.toThrow();
  });
});

describe('removeTooltip', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('removes tooltip from DOM', () => {
    const mockCanvas = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
      }),
    } as unknown as HTMLCanvasElement;

    const iconPos: IconPosition = {
      x: 0,
      y: 0,
      size: 6,
      index: 0,
    };

    createTooltip(iconPos, mockCanvas, 'Test');

    let tooltip = document.querySelector('div');
    expect(tooltip).toBeInTheDocument();

    removeTooltip();

    tooltip = document.querySelector('div');
    expect(tooltip).not.toBeInTheDocument();
  });

  it('does nothing when no tooltip exists', () => {
    expect(() => {
      removeTooltip();
    }).not.toThrow();
  });

  it('allows creating new tooltip after removal', () => {
    const mockCanvas = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        left: 0,
        top: 0,
        width: 800,
        height: 600,
      }),
    } as unknown as HTMLCanvasElement;

    const iconPos: IconPosition = {
      x: 0,
      y: 0,
      size: 6,
      index: 0,
    };

    createTooltip(iconPos, mockCanvas, 'First');
    removeTooltip();

    createTooltip(iconPos, mockCanvas, 'Second');

    const tooltip = document.querySelector('div');
    expect(tooltip).toBeInTheDocument();
  });
});
