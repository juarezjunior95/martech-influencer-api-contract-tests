import { act, renderHook } from '@testing-library/react-hooks';

import { useCopyElementAsPng, usePngCopyFeedback } from './useCopyElementAsPng';

jest.mock('html2canvas', () => jest.fn());
jest.mock('hooks/useExportPdf/inlineImagesForExport', () => ({
  inlineImagesForExport: jest.fn(async () => () => undefined),
}));
jest.mock('./minimizeDomForCapture', () => ({
  minimizeDomForCapture: jest.fn(() => ({
    detachedCount: 0,
    remainingPageSections: 1,
    cleanup: () => undefined,
  })),
}));

const mockHtml2canvas = jest.requireMock('html2canvas') as jest.Mock;
const mockInlineImagesForExport = jest.requireMock(
  'hooks/useExportPdf/inlineImagesForExport',
).inlineImagesForExport as jest.Mock;
const mockMinimizeDomForCapture = jest.requireMock('./minimizeDomForCapture')
  .minimizeDomForCapture as jest.Mock;

describe('useCopyElementAsPng', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exports png successfully by default', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void, type?: string) => {
        expect(type).toBe('image/png');
        cb(blob);
      },
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    let exportResult: any;
    await act(async () => {
      exportResult = await result.current.exportPng(element);
    });

    expect(exportResult).not.toBeNull();
    expect(exportResult.blob).toBe(blob);
    expect(exportResult.mimeType).toBe('image/png');
    expect(typeof exportResult.finalize).toBe('function');
    expect(mockInlineImagesForExport).toHaveBeenCalledWith(
      element,
      expect.objectContaining({
        skipPseudoElements: true,
        imageDataFormat: 'image/jpeg',
        jpegQuality: 0.85,
      }),
    );
    expect(mockMinimizeDomForCapture).toHaveBeenCalledWith(element);
    expect(mockHtml2canvas).toHaveBeenCalledWith(
      element,
      expect.objectContaining({
        ignoreElements: expect.any(Function),
        onclone: expect.any(Function),
      }),
    );
  });

  it('returns null when element is missing', async () => {
    const { result } = renderHook(() => useCopyElementAsPng());
    let exportResult: any;

    await act(async () => {
      exportResult = await result.current.exportPng(null);
    });

    expect(exportResult).toBeNull();
    expect(result.current.error).toBe('No element provided for PNG export.');
  });

  it('skips dataUrl generation when includeDataUrl is false', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    let exportResult: any;
    await act(async () => {
      exportResult = await result.current.exportPng(element, {
        includeDataUrl: false,
      });
    });

    expect(exportResult.dataUrl).toBeUndefined();
    expect(canvas.toDataURL).not.toHaveBeenCalled();
  });

  it('forwards custom options to html2canvas', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    await act(async () => {
      await result.current.exportPng(element, {
        scale: 2,
        useCORS: false,
        imageTimeout: 1000,
      });
    });

    expect(mockHtml2canvas).toHaveBeenCalledWith(
      element,
      expect.objectContaining({
        scale: 2,
        useCORS: false,
        imageTimeout: 1000,
        ignoreElements: expect.any(Function),
      }),
    );
  });

  it('uses element scrollHeight and respects maxHeight when height is not provided', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');
    Object.defineProperty(element, 'scrollHeight', {
      value: 1800,
      configurable: true,
    });
    Object.defineProperty(element, 'offsetHeight', {
      value: 1600,
      configurable: true,
    });

    await act(async () => {
      await result.current.exportPng(element, { maxHeight: 1500 });
    });

    expect(mockHtml2canvas).toHaveBeenCalledWith(
      element,
      expect.objectContaining({
        height: 1500,
      }),
    );
  });

  it('passes ignoreElements that omits PNG copy UI from capture', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const slideRoot = document.createElement('div');
    const pngActions = document.createElement('div');
    pngActions.setAttribute('data-template-slide-png-copy-action', 'true');
    const innerButton = document.createElement('button');
    pngActions.appendChild(innerButton);
    slideRoot.appendChild(pngActions);

    await act(async () => {
      await result.current.exportPng(slideRoot);
    });

    const options = mockHtml2canvas.mock.calls[0][1] as {
      ignoreElements: (el: Element) => boolean;
    };
    const { ignoreElements } = options;

    expect(ignoreElements(pngActions)).toBe(true);
    expect(ignoreElements(innerButton)).toBe(true);
    expect(ignoreElements(slideRoot)).toBe(false);
  });

  it('strips heavy nodes and disables animations in html2canvas clone', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const slideRoot = document.createElement('div');
    const video = document.createElement('video');
    const tooltip = document.createElement('div');
    tooltip.setAttribute('role', 'tooltip');
    slideRoot.append(video, tooltip);

    await act(async () => {
      await result.current.exportPng(slideRoot);
    });

    const options = mockHtml2canvas.mock.calls[0][1] as {
      onclone: (doc: Document) => void;
    };

    const clonedDocument = document.implementation.createHTMLDocument('clone');
    const clonedVideo = clonedDocument.createElement('video');
    const clonedTooltip = clonedDocument.createElement('div');
    clonedTooltip.setAttribute('role', 'tooltip');
    clonedDocument.body.append(clonedVideo, clonedTooltip);

    options.onclone(clonedDocument);

    expect(clonedDocument.querySelector('video')).toBeNull();
    expect(clonedDocument.querySelector('[role="tooltip"]')).toBeNull();
    expect(
      clonedDocument.head.querySelectorAll('style').length,
    ).toBeGreaterThan(0);
  });

  it('uses explicit height when provided', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    await act(async () => {
      await result.current.exportPng(element, { height: 700, maxHeight: 1200 });
    });

    expect(mockHtml2canvas).toHaveBeenCalledWith(
      element,
      expect.objectContaining({
        height: 700,
      }),
    );
  });

  it('returns null and sets error when canvas blob generation fails', async () => {
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(null),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    let exportResult: any;
    await act(async () => {
      exportResult = await result.current.exportPng(element, {
        imageFormat: 'PNG',
      });
    });

    expect(exportResult).toBeNull();
    expect(result.current.error).toBe('Failed to generate PNG blob.');
  });

  it('returns null and keeps unknown error message for non-Error throw', async () => {
    mockHtml2canvas.mockRejectedValue('boom');

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    let exportResult: any;
    await act(async () => {
      exportResult = await result.current.exportPng(element);
    });

    expect(exportResult).toBeNull();
    expect(result.current.error).toBe('Unknown image export error.');
  });

  it('does not minimize DOM when option is disabled', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    await act(async () => {
      await result.current.exportPng(element, { minimizeDom: false });
    });

    expect(mockMinimizeDomForCapture).not.toHaveBeenCalled();
  });

  it('copies png to clipboard using image/png mime type', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void, type?: string) => {
        expect(type).toBe('image/png');
        cb(blob);
      },
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const write = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { write },
    });
    global.ClipboardItem = jest.fn(
      (items) => items,
    ) as unknown as typeof ClipboardItem;

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    let copyResult: any;
    await act(async () => {
      copyResult = await result.current.copyPngToClipboard(element);
    });

    expect(copyResult.success).toBe(true);
    expect(ClipboardItem).toHaveBeenCalledWith({
      'image/png': expect.any(Promise),
    });
    expect(write).toHaveBeenCalled();
  });

  it('returns clipboard unavailable error and finalizes export', async () => {
    const cleanup = jest.fn();
    mockMinimizeDomForCapture.mockReturnValue({
      detachedCount: 0,
      remainingPageSections: 1,
      cleanup,
    });
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    Object.assign(navigator, {
      clipboard: undefined,
    });
    global.ClipboardItem = undefined;

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    let copyResult: any;
    await act(async () => {
      copyResult = await result.current.copyPngToClipboard(element);
    });

    expect(copyResult).toEqual({
      success: false,
      error: 'Clipboard API not available.',
    });
    expect(cleanup).toHaveBeenCalled();
  });

  it('returns fallback clipboard error when write throws non-Error', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const write = jest.fn().mockRejectedValue('nope');
    Object.assign(navigator, {
      clipboard: { write },
    });
    global.ClipboardItem = jest.fn(
      (items) => items,
    ) as unknown as typeof ClipboardItem;

    const { result } = renderHook(() => useCopyElementAsPng());
    const element = document.createElement('div');

    let copyResult: any;
    await act(async () => {
      copyResult = await result.current.copyPngToClipboard(element);
    });

    expect(copyResult).toEqual({
      success: false,
      error: 'Unable to copy PNG to clipboard.',
    });
  });

  it('returns default copy error when export fails before clipboard step', async () => {
    const { result } = renderHook(() => useCopyElementAsPng());

    let copyResult: any;
    await act(async () => {
      copyResult = await result.current.copyPngToClipboard(null);
    });

    expect(copyResult).toEqual({
      success: false,
      error: 'Unable to export PNG.',
    });
  });
});

describe('usePngCopyFeedback', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('sets feedback status to success and resets after delay', async () => {
    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };
    mockHtml2canvas.mockResolvedValue(canvas);

    const write = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: { write },
    });
    global.ClipboardItem = jest.fn(
      (items) => items,
    ) as unknown as typeof ClipboardItem;

    const { result } = renderHook(() =>
      usePngCopyFeedback({ resetDelayMs: 100 }),
    );
    const element = document.createElement('div');

    await act(async () => {
      await result.current.copyElementAsPng(element);
    });

    expect(result.current.copyStatus).toBe('success');
    expect(result.current.feedbackMessage).toBe(
      'Slide ready to paste with Ctrl+V.',
    );
    expect(result.current.isActionVisible).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.copyStatus).toBe('idle');
    expect(result.current.feedbackMessage).toBe('');
  });

  it('skips copy action when element is missing', async () => {
    const { result } = renderHook(() => usePngCopyFeedback());

    await act(async () => {
      await result.current.copyElementAsPng(null);
    });

    expect(result.current.copyStatus).toBe('idle');
  });

  it('shows exporting feedback while copy is in progress', async () => {
    let resolveCanvas: (value: unknown) => void = () => undefined;
    const pendingCanvasPromise = new Promise((resolve) => {
      resolveCanvas = resolve;
    });
    mockHtml2canvas.mockReturnValue(pendingCanvasPromise);

    const { result } = renderHook(() => usePngCopyFeedback());
    const element = document.createElement('div');

    let copyPromise: Promise<void> = Promise.resolve();
    act(() => {
      copyPromise = result.current.copyElementAsPng(element);
    });

    expect(result.current.feedbackMessage).toBe('Preparing slide image...');
    expect(result.current.isActionVisible).toBe(true);

    const blob = new Blob(['png'], { type: 'image/png' });
    const canvas = {
      toBlob: (cb: (value: Blob | null) => void) => cb(blob),
      toDataURL: jest.fn(() => 'data:image/png;base64,abc'),
    };

    await act(async () => {
      resolveCanvas(canvas);
      await copyPromise;
    });
  });

  it('resets copy feedback manually', async () => {
    const { result } = renderHook(() => usePngCopyFeedback());

    act(() => {
      result.current.resetCopyFeedback();
    });

    expect(result.current.copyStatus).toBe('idle');
    expect(result.current.feedbackMessage).toBe('');
  });
});
