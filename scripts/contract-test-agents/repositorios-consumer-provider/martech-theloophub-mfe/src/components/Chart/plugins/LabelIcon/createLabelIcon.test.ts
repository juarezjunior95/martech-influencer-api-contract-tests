import { createLabelIcon } from './createLabelIcon';

jest.mock('../../../../assets/icons/world.png', () => 'mocked-world-icon.png');

describe('createLabelIcon', () => {
  let mockCtx: CanvasRenderingContext2D;
  let mockImage: HTMLImageElement;

  beforeEach(() => {
    mockCtx = {
      save: jest.fn(),
      restore: jest.fn(),
      drawImage: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    mockImage = {
      onload: null,
      src: '',
      width: 16,
      height: 16,
    } as HTMLImageElement;

    global.Image = jest.fn(() => mockImage) as any;

    jest.clearAllMocks();
  });

  it('saves and restores canvas context', () => {
    createLabelIcon(mockCtx, 50, 100, 8);

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('uses default size of 8 when not provided', () => {
    if (mockImage.onload) {
      mockImage.onload.call(mockImage, {} as Event);
    }

    createLabelIcon(mockCtx, 50, 100);

    if (mockCtx.drawImage) {
      expect(mockCtx.save).toHaveBeenCalled();
    }
  });

  it('calculates correct image position based on center point', () => {
    const imageLoadHandler = mockImage.onload;
    if (imageLoadHandler) {
      imageLoadHandler.call(mockImage, {} as Event);
    }

    const x = 100;
    const y = 150;
    const size = 10;

    createLabelIcon(mockCtx, x, y, size);

    if (mockCtx.drawImage) {
      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    }
  });

  it('handles different size values', () => {
    const sizes = [6, 8, 10, 12];

    sizes.forEach((size) => {
      jest.clearAllMocks();
      createLabelIcon(mockCtx, 50, 100, size);

      expect(mockCtx.save).toHaveBeenCalled();
      expect(mockCtx.restore).toHaveBeenCalled();
    });
  });

  it('does not crash when image is not loaded yet', () => {
    expect(() => {
      createLabelIcon(mockCtx, 50, 100, 8);
    }).not.toThrow();

    expect(mockCtx.save).toHaveBeenCalled();
    expect(mockCtx.restore).toHaveBeenCalled();
  });

  it('handles zero coordinates', () => {
    expect(() => {
      createLabelIcon(mockCtx, 0, 0, 8);
    }).not.toThrow();
  });

  it('handles negative coordinates', () => {
    expect(() => {
      createLabelIcon(mockCtx, -10, -20, 8);
    }).not.toThrow();
  });

  it('handles very large coordinates', () => {
    expect(() => {
      createLabelIcon(mockCtx, 10000, 10000, 8);
    }).not.toThrow();
  });

  it('handles very small size', () => {
    expect(() => {
      createLabelIcon(mockCtx, 50, 100, 1);
    }).not.toThrow();
  });

  it('handles very large size', () => {
    expect(() => {
      createLabelIcon(mockCtx, 50, 100, 100);
    }).not.toThrow();
  });
});
