import { useCallback, useEffect, useRef, useState } from 'react';

import { inlineImagesForExport } from 'hooks/useExportPdf/inlineImagesForExport';
import html2canvas from 'html2canvas';

import { minimizeDomForCapture } from './minimizeDomForCapture';

export type ExportPngOptions = {
  scale?: number;
  maxWidth?: number;
  maxHeight?: number;
  backgroundColor?: string;
  useCORS?: boolean;
  allowTaint?: boolean;
  imageTimeout?: number;
  width?: number;
  height?: number;
  imageFormat?: 'PNG' | 'JPEG';
  quality?: number;
  includeDataUrl?: boolean;
  minimizeDom?: boolean;
  deferCleanup?: boolean;
};

export type ExportPngResult = {
  blob: Blob;
  dataUrl?: string;
  canvas: HTMLCanvasElement;
  mimeType: string;
  finalize: () => void;
};

export type CopyPngResult = {
  success: boolean;
  error?: string;
};

export type PngCopyStatus = 'idle' | 'success' | 'error';

export type UsePngCopyFeedbackOptions = {
  resetDelayMs?: number;
  exportingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
};

const DEFAULT_CANVAS_WIDTH = 1668;
const DEFAULT_CANVAS_HEIGHT = 938;
const DEFAULT_RESET_DELAY_MS = 5000;
const DEFAULT_EXPORTING_MESSAGE = 'Preparing slide image...';
const DEFAULT_SUCCESS_MESSAGE = 'Slide ready to paste with Ctrl+V.';
const DEFAULT_ERROR_MESSAGE = 'Unable to copy slide.';

const getImageMimeType = (imageFormat: 'PNG' | 'JPEG'): string =>
  imageFormat === 'JPEG' ? 'image/jpeg' : 'image/png';

const stripHeavyElementsFromClone = (clonedDocument: Document): void => {
  clonedDocument
    .querySelectorAll(
      'video, iframe, [data-no-export="true"], [role="tooltip"], [data-radix-popper-content-wrapper]',
    )
    .forEach((node) => node.remove());

  const style = clonedDocument.createElement('style');
  style.textContent =
    '*, *::before, *::after { animation: none !important; transition: none !important; }';
  clonedDocument.head.appendChild(style);
};

const shouldIgnoreElementForPngExport = (element: Element): boolean => {
  if (!(element instanceof HTMLElement)) return false;

  return (
    Boolean(element.closest('[data-template-slide-png-copy-action="true"]')) ||
    element.closest('[role="tooltip"]') !== null ||
    element.closest('[data-radix-popper-content-wrapper]') !== null
  );
};

const applyExportStyles = (element: HTMLElement): (() => void) => {
  const originalMinHeight = element.style.minHeight;
  element.style.minHeight = `${DEFAULT_CANVAS_HEIGHT}px`;

  const firstChild =
    element.children.length > 0 ? (element.children[0] as HTMLElement) : null;
  const originalChildMinHeight = firstChild?.style?.minHeight;

  if (firstChild?.style) {
    firstChild.style.minHeight = `${DEFAULT_CANVAS_HEIGHT}px`;
  }

  return () => {
    element.style.minHeight = originalMinHeight || 'auto';
    if (firstChild?.style) {
      firstChild.style.minHeight = originalChildMinHeight || 'auto';
    }
  };
};

const getCaptureHeight = (
  element: HTMLElement,
  explicitHeight: number | undefined,
  maxHeight: number,
): number => {
  if (typeof explicitHeight === 'number') {
    return Math.min(explicitHeight, maxHeight);
  }

  const measuredHeight = Math.max(
    DEFAULT_CANVAS_HEIGHT,
    element.scrollHeight,
    element.offsetHeight,
    Math.ceil(element.getBoundingClientRect().height),
  );

  return Math.min(measuredHeight, maxHeight);
};

export const useCopyElementAsPng = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportPng = useCallback(
    async (
      element: HTMLElement | null,
      options: ExportPngOptions = {},
    ): Promise<ExportPngResult | null> => {
      if (!element) {
        setError('No element provided for PNG export.');
        return null;
      }

      const {
        scale = 1.5,
        maxWidth = 1920,
        maxHeight = 1080,
        backgroundColor = '#ffffff',
        useCORS = true,
        allowTaint = false,
        imageTimeout = 12000,
        width,
        height,
        imageFormat = 'PNG',
        quality = 0.85,
        includeDataUrl = true,
        minimizeDom = true,
        deferCleanup = false,
      } = options;

      const mimeType = getImageMimeType(imageFormat);
      const blobQuality = imageFormat === 'JPEG' ? quality : undefined;

      setIsExporting(true);
      setError(null);

      const restoreStyles = applyExportStyles(element);

      const restoreImages = await inlineImagesForExport(element, {
        skipPseudoElements: true,
        imageDataFormat: 'image/jpeg',
        jpegQuality: 0.85,
      });

      let cleanupMinimizedDom = () => undefined;
      let finalizeCapture = () => {
        cleanupMinimizedDom();
        restoreImages();
        restoreStyles();
      };

      if (minimizeDom) {
        const minimized = minimizeDomForCapture(element);
        cleanupMinimizedDom = minimized.cleanup;
      }

      try {
        const canvasWidth = width ?? Math.min(maxWidth, DEFAULT_CANVAS_WIDTH);
        const actualHeight = getCaptureHeight(element, height, maxHeight);

        const canvas = await html2canvas(element, {
          scale,
          useCORS,
          allowTaint,
          backgroundColor,
          removeContainer: true,
          imageTimeout,
          width: canvasWidth,
          height: actualHeight,
          logging: false,
          ignoreElements: shouldIgnoreElementForPngExport,
          onclone: stripHeavyElementsFromClone,
          scrollX: 0,
          scrollY: -globalThis.scrollY,
        });

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((value) => resolve(value), mimeType, blobQuality),
        );

        if (!blob) {
          finalizeCapture();
          setError(`Failed to generate ${imageFormat} blob.`);
          return null;
        }

        return {
          blob,
          dataUrl: includeDataUrl
            ? canvas.toDataURL(mimeType, blobQuality)
            : undefined,
          canvas,
          mimeType,
          finalize: finalizeCapture,
        };
      } catch (err) {
        finalizeCapture();
        const message =
          err instanceof Error ? err.message : 'Unknown image export error.';
        setError(message);
        return null;
      } finally {
        if (!deferCleanup) {
          finalizeCapture();
          finalizeCapture = () => undefined;
        }
        setIsExporting(false);
      }
    },
    [],
  );

  const copyPngToClipboard = useCallback(
    async (
      element: HTMLElement | null,
      options: ExportPngOptions = {},
    ): Promise<CopyPngResult> => {
      const result = await exportPng(element, {
        ...options,
        imageFormat: 'PNG',
        includeDataUrl: options.includeDataUrl ?? false,
        deferCleanup: true,
      });

      if (!result) {
        return { success: false, error: error || 'Unable to export PNG.' };
      }

      if (
        !navigator?.clipboard?.write ||
        typeof ClipboardItem === 'undefined'
      ) {
        result.finalize();
        return { success: false, error: 'Clipboard API not available.' };
      }

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': Promise.resolve(result.blob),
          }),
        ]);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error:
            err instanceof Error
              ? err.message
              : 'Unable to copy PNG to clipboard.',
        };
      } finally {
        result.finalize();
      }
    },
    [error, exportPng],
  );

  return {
    exportPng,
    copyPngToClipboard,
    isExporting,
    error,
  };
};

export const usePngCopyFeedback = ({
  resetDelayMs = DEFAULT_RESET_DELAY_MS,
  exportingMessage = DEFAULT_EXPORTING_MESSAGE,
  successMessage = DEFAULT_SUCCESS_MESSAGE,
  errorMessage = DEFAULT_ERROR_MESSAGE,
}: UsePngCopyFeedbackOptions = {}) => {
  const { copyPngToClipboard, isExporting } = useCopyElementAsPng();
  const [copyStatus, setCopyStatus] = useState<PngCopyStatus>('idle');
  const [isCopying, setIsCopying] = useState(false);
  const feedbackTimeoutRef = useRef<
    ReturnType<typeof globalThis.setTimeout> | undefined
  >();

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current !== undefined) {
      globalThis.clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = undefined;
    }
  }, []);

  const scheduleReset = useCallback(() => {
    clearFeedbackTimeout();
    feedbackTimeoutRef.current = globalThis.setTimeout(() => {
      setCopyStatus('idle');
    }, resetDelayMs);
  }, [clearFeedbackTimeout, resetDelayMs]);

  const copyElementAsPng = useCallback(
    async (element: HTMLElement | null, options: ExportPngOptions = {}) => {
      if (!element || isCopying || isExporting) return;

      setIsCopying(true);
      clearFeedbackTimeout();
      setCopyStatus('idle');

      try {
        const result = await copyPngToClipboard(element, options);
        setCopyStatus(result.success ? 'success' : 'error');
        scheduleReset();
      } finally {
        setIsCopying(false);
      }
    },
    [
      clearFeedbackTimeout,
      copyPngToClipboard,
      isCopying,
      isExporting,
      scheduleReset,
    ],
  );

  const resetCopyFeedback = useCallback(() => {
    clearFeedbackTimeout();
    setCopyStatus('idle');
    setIsCopying(false);
  }, [clearFeedbackTimeout]);

  useEffect(() => () => clearFeedbackTimeout(), [clearFeedbackTimeout]);

  const isBusy = isCopying || isExporting;
  const isActionVisible = isBusy || copyStatus !== 'idle';
  let feedbackMessage = '';

  if (isBusy) {
    feedbackMessage = exportingMessage;
  } else if (copyStatus === 'success') {
    feedbackMessage = successMessage;
  } else if (copyStatus === 'error') {
    feedbackMessage = errorMessage;
  }

  return {
    copyElementAsPng,
    resetCopyFeedback,
    copyStatus,
    isExporting,
    isActionVisible,
    feedbackMessage,
  };
};
