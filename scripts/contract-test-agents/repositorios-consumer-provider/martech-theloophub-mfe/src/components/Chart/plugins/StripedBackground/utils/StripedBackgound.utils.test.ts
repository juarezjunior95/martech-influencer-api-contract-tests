import {
  DEFAULT_CONFIG,
  drawPaddedRoundedRect,
  shouldApplyStripedPattern,
} from './StripedBackgound.utils';

describe('StripedBackgound.utils', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCanvas = {
      offsetWidth: 600,
      offsetHeight: 400,
    } as HTMLCanvasElement;

    mockCtx = {
      canvas: mockCanvas,
      createPattern: jest.fn().mockReturnValue('mock-pattern'),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      quadraticCurveTo: jest.fn(),
      closePath: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    global.document.createElement = jest.fn((tagName) => {
      if (tagName === 'canvas') {
        return {
          width: 0,
          height: 0,
          getContext: jest.fn(() => ({
            fillStyle: '',
            lineCap: '',
            lineJoin: '',
            save: jest.fn(),
            restore: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
            fillRect: jest.fn(),
          })),
        } as any;
      }
      return {} as any;
    });

    jest.clearAllMocks();
  });

  describe('DEFAULT_CONFIG', () => {
    it('has correct default values', () => {
      expect(DEFAULT_CONFIG).toEqual({
        color: 'red',
        angle: 45,
        thickness: 2,
        spacing: 5,
      });
    });
  });

  describe('drawPaddedRoundedRect', () => {
    it('draws rounded rectangle path', () => {
      drawPaddedRoundedRect(mockCtx, 10, 20, 100, 80, 5, 2);

      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.moveTo).toHaveBeenCalled();
      expect(mockCtx.lineTo).toHaveBeenCalled();
      expect(mockCtx.quadraticCurveTo).toHaveBeenCalledTimes(4);
      expect(mockCtx.closePath).toHaveBeenCalled();
    });

    it('handles zero padding', () => {
      expect(() => {
        drawPaddedRoundedRect(mockCtx, 10, 20, 100, 80, 5, 0);
      }).not.toThrow();
    });

    it('handles zero radius', () => {
      expect(() => {
        drawPaddedRoundedRect(mockCtx, 10, 20, 100, 80, 0, 2);
      }).not.toThrow();
    });

    it('validates and corrects zero width to MIN_SIZE_VALUE', () => {
      jest.clearAllMocks();
      drawPaddedRoundedRect(mockCtx, 10, 20, 0, 80, 5, 2);

      expect(mockCtx.beginPath).toHaveBeenCalled();
    });

    it('validates and corrects zero height to MIN_SIZE_VALUE', () => {
      jest.clearAllMocks();
      drawPaddedRoundedRect(mockCtx, 10, 20, 100, 0, 5, 2);

      expect(mockCtx.beginPath).toHaveBeenCalled();
    });

    it('validates and constrains radius to reasonable values', () => {
      expect(() => {
        drawPaddedRoundedRect(mockCtx, 10, 20, 100, 80, 100, 0);
      }).not.toThrow();
    });

    it('validates and constrains padding to reasonable values', () => {
      expect(() => {
        drawPaddedRoundedRect(mockCtx, 10, 20, 100, 80, 5, 50);
      }).not.toThrow();
    });

    it('validates and corrects negative dimensions', () => {
      jest.clearAllMocks();
      drawPaddedRoundedRect(mockCtx, 10, 20, -100, -80, 5, 2);

      expect(mockCtx.beginPath).toHaveBeenCalled();
    });

    it('validates and constrains padding to maximum allowed value', () => {
      jest.clearAllMocks();
      drawPaddedRoundedRect(mockCtx, 10, 20, 100, 80, 5, 50);

      expect(mockCtx.beginPath).toHaveBeenCalled();
    });
  });

  describe('shouldApplyStripedPattern', () => {
    it('returns true when pattern is valid and barIndex is in flags', () => {
      const pattern = {
        type: 'striped',
        flags: [0, 2, 4],
        params: {},
      };

      expect(shouldApplyStripedPattern(pattern, 0)).toBe(true);
      expect(shouldApplyStripedPattern(pattern, 2)).toBe(true);
      expect(shouldApplyStripedPattern(pattern, 4)).toBe(true);
    });

    it('returns false when barIndex is not in flags', () => {
      const pattern = {
        type: 'striped',
        flags: [0, 2, 4],
        params: {},
      };

      expect(shouldApplyStripedPattern(pattern, 1)).toBe(false);
      expect(shouldApplyStripedPattern(pattern, 3)).toBe(false);
      expect(shouldApplyStripedPattern(pattern, 5)).toBe(false);
    });

    it('returns false when pattern type is not striped', () => {
      const pattern = {
        type: 'solid',
        flags: [0, 1, 2],
        params: {},
      };

      expect(shouldApplyStripedPattern(pattern, 0)).toBe(false);
    });

    it('returns falsy when pattern is null', () => {
      expect(shouldApplyStripedPattern(null as any, 0)).toBeFalsy();
    });

    it('returns falsy when pattern is undefined', () => {
      expect(shouldApplyStripedPattern(undefined as any, 0)).toBeFalsy();
    });

    it('returns falsy when flags are undefined', () => {
      const pattern = {
        type: 'striped',
        flags: undefined,
        params: {},
      };

      expect(shouldApplyStripedPattern(pattern as any, 0)).toBeFalsy();
    });

    it('returns false when flags array is empty', () => {
      const pattern = {
        type: 'striped',
        flags: [],
        params: {},
      };

      expect(shouldApplyStripedPattern(pattern, 0)).toBe(false);
    });

    it('handles negative barIndex', () => {
      const pattern = {
        type: 'striped',
        flags: [0, 1, 2],
        params: {},
      };

      expect(shouldApplyStripedPattern(pattern, -1)).toBe(false);
    });

    it('returns false when flags array is empty', () => {
      const pattern = {
        type: 'striped',
        flags: [],
        params: {},
      };

      expect(shouldApplyStripedPattern(pattern, 0)).toBe(false);
    });

    it('handles negative barIndex', () => {
      const pattern = {
        type: 'striped',
        flags: [0, 1, 2],
        params: {},
      };

      expect(shouldApplyStripedPattern(pattern, -1)).toBe(false);
    });
  });
});
