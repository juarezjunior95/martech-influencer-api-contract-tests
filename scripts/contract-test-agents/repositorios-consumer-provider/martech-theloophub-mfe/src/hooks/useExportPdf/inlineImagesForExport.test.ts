import { inlineImagesForExport } from './inlineImagesForExport';

describe('inlineImagesForExport', () => {
  const originalFetch = global.fetch;
  const originalFileReader = global.FileReader;
  const originalGetComputedStyle = window.getComputedStyle;

  const mockFileReader = () => {
    class MockFileReader {
      result: string | null = 'data:image/png;base64,ZmFrZQ==';

      onloadend: (() => void) | null = null;

      onerror: (() => void) | null = null;

      readAsDataURL() {
        this.onloadend?.();
      }
    }

    global.FileReader = MockFileReader as unknown as typeof global.FileReader;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileReader();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    global.FileReader = originalFileReader;
    window.getComputedStyle = originalGetComputedStyle;
    jest.useRealTimers();
    document
      .querySelectorAll('style[data-export-inline-styles="true"]')
      .forEach((style) => style.remove());
  });

  it('returns a no-op cleanup when there are no images', async () => {
    const element = document.createElement('div');
    const restore = await inlineImagesForExport(element);

    expect(typeof restore).toBe('function');
    expect(() => restore()).not.toThrow();
  });

  it('skips images that are already data URLs', async () => {
    const element = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'data:image/png;base64,abc';
    element.appendChild(img);

    global.fetch = jest.fn();

    const restore = await inlineImagesForExport(element);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(img.src).toContain('data:image/png;base64,abc');
    restore();
  });

  it('inlines external <img> sources and restores the original source', async () => {
    const element = document.createElement('div');
    const img = document.createElement('img');
    const originalSrc =
      'https://onewaymartech-assets.mybees-platform.com/brands/guarana/square.png';
    img.src = originalSrc;
    element.appendChild(img);

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['png'], { type: 'image/png' }),
    });
    global.fetch = mockFetch as typeof fetch;

    const restore = await inlineImagesForExport(element);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('_pdfExport='),
      {
        mode: 'cors',
        credentials: 'omit',
        cache: 'force-cache',
      },
    );
    expect(mockFetch.mock.calls[0][0]).toContain(originalSrc);
    expect(img.src).toBe('data:image/png;base64,ZmFrZQ==');

    restore();

    expect(img.src).toBe(originalSrc);
  });

  it('inlines background-image URLs from computed styles', async () => {
    const element = document.createElement('div');
    const originalSrc =
      'https://onewaymartech-assets.mybees-platform.com/brands/guarana/square-background.png';

    window.getComputedStyle = jest.fn().mockImplementation((el, pseudo) => {
      if (pseudo) {
        return originalGetComputedStyle(el, pseudo);
      }

      return {
        backgroundImage: `url("${originalSrc}")`,
        content: 'normal',
      } as CSSStyleDeclaration;
    });

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['png'], { type: 'image/png' }),
    });
    global.fetch = mockFetch as typeof fetch;

    const restore = await inlineImagesForExport(element);

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('_pdfExport='),
      {
        mode: 'cors',
        credentials: 'omit',
        cache: 'force-cache',
      },
    );
    expect(mockFetch.mock.calls[0][0]).toContain(originalSrc);
    expect(element.style.backgroundImage).toContain(
      'data:image/png;base64,ZmFrZQ==',
    );

    restore();

    expect(element.style.backgroundImage).toBe('');
  });

  it('inlines pseudo-element content URLs via a temporary style tag', async () => {
    const element = document.createElement('div');
    const originalSrc =
      'https://onewaymartech-assets.mybees-platform.com/brands/guarana/square.png';

    window.getComputedStyle = jest.fn().mockImplementation((el, pseudo) => {
      if (pseudo === '::before') {
        return {
          backgroundImage: 'none',
          content: `url("${originalSrc}")`,
        } as CSSStyleDeclaration;
      }

      return {
        backgroundImage: 'none',
        content: 'normal',
      } as CSSStyleDeclaration;
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['png'], { type: 'image/png' }),
    });

    const restore = await inlineImagesForExport(element);

    const styleTag = document.querySelector(
      'style[data-export-inline-styles="true"]',
    );

    expect(styleTag?.textContent).toContain(
      'content: url("data:image/png;base64,ZmFrZQ==") !important',
    );
    expect(element.className).toContain('export-pseudo-0');

    restore();

    expect(
      document.querySelector('style[data-export-inline-styles="true"]'),
    ).toBeNull();
    expect(element.className).not.toContain('export-pseudo-0');
  });

  it('keeps the original source when fetch fails', async () => {
    jest.useFakeTimers();

    const element = document.createElement('div');
    const img = document.createElement('img');
    const originalSrc = 'https://example.com/missing.png';
    img.src = originalSrc;
    element.appendChild(img);

    global.fetch = jest.fn().mockRejectedValue(new Error('CORS blocked'));
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const originalImage = global.Image;

    class MockImage {
      crossOrigin = '';

      onload: (() => void) | null = null;

      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onerror?.();
      }
    }

    global.Image = MockImage as unknown as typeof Image;

    try {
      const restorePromise = inlineImagesForExport(element);
      await jest.runAllTimersAsync();
      const restore = await restorePromise;

      expect(img.src).toContain('_pdfExport=');
      expect(warnSpy).toHaveBeenCalled();
      restore();
      expect(img.src).toBe(originalSrc);
    } finally {
      warnSpy.mockRestore();
      global.Image = originalImage;
      jest.useRealTimers();
    }
  });

  it('restores srcset after inlining an image', async () => {
    const element = document.createElement('div');
    const img = document.createElement('img');
    const originalSrc =
      'https://onewaymartech-assets.mybees-platform.com/brands/guarana/square.png';
    img.src = originalSrc;
    img.srcset = `${originalSrc} 2x`;
    element.appendChild(img);

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['png'], { type: 'image/png' }),
    }) as typeof fetch;

    const restore = await inlineImagesForExport(element);

    expect(img.srcset).toBe('');
    restore();
    expect(img.srcset).toBe(`${originalSrc} 2x`);
  });

  it('inlines pseudo-element background-image URLs', async () => {
    const element = document.createElement('div');
    const originalSrc =
      'https://onewaymartech-assets.mybees-platform.com/countries/rounded_flags/BRA.png';

    window.getComputedStyle = jest.fn().mockImplementation((el, pseudo) => {
      if (pseudo === '::before') {
        return {
          backgroundImage: `url("${originalSrc}")`,
          content: 'normal',
        } as CSSStyleDeclaration;
      }

      return {
        backgroundImage: 'none',
        content: 'normal',
      } as CSSStyleDeclaration;
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      blob: async () => new Blob(['png'], { type: 'image/png' }),
    });

    const restore = await inlineImagesForExport(element);

    const styleTag = document.querySelector(
      'style[data-export-inline-styles="true"]',
    );

    expect(styleTag?.textContent).toContain('background-image:');
    expect(styleTag?.textContent).toContain('data:image/png;base64,ZmFrZQ==');
    restore();
  });

  it('falls back to Image loading when fetch is not ok', async () => {
    const originalImage = global.Image;
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;

    class MockImage {
      crossOrigin = '';

      naturalWidth = 16;

      naturalHeight = 16;

      width = 16;

      height = 16;

      onload: (() => void) | null = null;

      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onload?.();
      }
    }

    global.Image = MockImage as unknown as typeof Image;
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue({ drawImage: jest.fn() }) as never;
    HTMLCanvasElement.prototype.toDataURL = jest
      .fn()
      .mockReturnValue('data:image/png;base64,fallback') as never;

    const element = document.createElement('div');
    const img = document.createElement('img');
    img.src =
      'https://onewaymartech-assets.mybees-platform.com/brands/guarana/square-fallback.png';
    element.appendChild(img);

    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as typeof fetch;

    try {
      const restore = await inlineImagesForExport(element);
      expect(img.src).toBe('data:image/png;base64,fallback');
      restore();
    } finally {
      global.Image = originalImage;
      HTMLCanvasElement.prototype.getContext = originalGetContext;
      HTMLCanvasElement.prototype.toDataURL = originalToDataURL;
    }
  });

  it('resolves image load through waitForImg when every loader fails', async () => {
    const originalImage = global.Image;

    class MockImage {
      crossOrigin = '';

      onload: (() => void) | null = null;

      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onerror?.();
      }
    }

    global.Image = MockImage as unknown as typeof Image;

    const element = document.createElement('div');
    const img = document.createElement('img');
    const originalSrc = 'https://example.com/missing.png';
    img.src = originalSrc;
    Object.defineProperty(img, 'complete', {
      value: false,
      configurable: true,
    });
    element.appendChild(img);

    global.fetch = jest.fn().mockRejectedValue(new Error('CORS blocked'));

    const loadListener = jest.fn();
    img.addEventListener('load', loadListener);

    const restorePromise = inlineImagesForExport(element);
    img.dispatchEvent(new Event('load'));
    const restore = await restorePromise;

    expect(loadListener).toHaveBeenCalled();
    restore();
    global.Image = originalImage;
  });

  it('skips blob URLs and does not fetch them', async () => {
    const element = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'blob:https://example.com/1234-5678';
    element.appendChild(img);

    const mockFetch = jest.fn();
    global.fetch = mockFetch as typeof fetch;

    const restore = await inlineImagesForExport(element);

    expect(mockFetch).not.toHaveBeenCalled();
    restore();
  });

  it('keeps original URL when src is invalid and cannot be cache-busted', async () => {
    const originalImage = global.Image;
    class MockImage {
      crossOrigin = '';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onerror?.();
      }
    }
    global.Image = MockImage as unknown as typeof Image;

    const element = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'not-a-valid-url';
    element.appendChild(img);

    const mockFetch = jest.fn().mockRejectedValue(new Error('invalid url'));
    global.fetch = mockFetch as typeof fetch;

    try {
      const restore = await inlineImagesForExport(element);
      expect(img.src).toContain('not-a-valid-url');
      restore();
    } finally {
      global.Image = originalImage;
    }
  });

  it('uses fallback image loader when canvas context is unavailable', async () => {
    const originalImage = global.Image;
    const originalGetContext = HTMLCanvasElement.prototype.getContext;

    class MockImage {
      crossOrigin = '';
      naturalWidth = 10;
      naturalHeight = 10;
      width = 10;
      height = 10;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onload?.();
      }
    }

    global.Image = MockImage as unknown as typeof Image;
    HTMLCanvasElement.prototype.getContext = jest
      .fn()
      .mockReturnValue(null) as never;
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as typeof fetch;

    const element = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'https://example.com/context-null.png';
    element.appendChild(img);

    try {
      const restore = await inlineImagesForExport(element);
      expect(img.src).toContain('_pdfExport=');
      restore();
    } finally {
      global.Image = originalImage;
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    }
  });

  it('resolves immediately when image is already complete in waitForImg path', async () => {
    const originalImage = global.Image;

    class MockImage {
      crossOrigin = '';
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;

      set src(_value: string) {
        this.onerror?.();
      }
    }

    global.Image = MockImage as unknown as typeof Image;
    global.fetch = jest.fn().mockRejectedValue(new Error('CORS blocked'));

    const element = document.createElement('div');
    const img = document.createElement('img');
    img.src = 'https://example.com/complete.png';
    Object.defineProperty(img, 'complete', {
      value: true,
      configurable: true,
    });
    element.appendChild(img);

    try {
      const restore = await inlineImagesForExport(element);
      restore();
      expect(global.fetch).toHaveBeenCalled();
    } finally {
      global.Image = originalImage;
    }
  });

  it('skips pseudo style tag when replacements are not generated', async () => {
    const element = document.createElement('div');
    const dataUrl = 'data:image/png;base64,already-inline';

    window.getComputedStyle = jest.fn().mockImplementation((_el, pseudo) => {
      if (pseudo === '::before') {
        return {
          backgroundImage: `url("${dataUrl}")`,
          content: 'normal',
        } as CSSStyleDeclaration;
      }

      return {
        backgroundImage: 'none',
        content: 'normal',
      } as CSSStyleDeclaration;
    });

    global.fetch = jest.fn() as typeof fetch;

    const restore = await inlineImagesForExport(element);
    expect(
      document.querySelector('style[data-export-inline-styles="true"]'),
    ).toBeNull();
    restore();
  });
});
