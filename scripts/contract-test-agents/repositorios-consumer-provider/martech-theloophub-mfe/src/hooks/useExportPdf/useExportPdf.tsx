import { useCallback, useState } from 'react';

import { useEnvService } from 'admin-portal-shared-services';
import { useCurrentPage, usePageFilterApplied } from 'hooks';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { inlineImagesForExport } from './inlineImagesForExport';

export interface UsePDFExportOptions {
  scale?: number;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  preserveLinks?: boolean;
  quality?: number;
  compression?: boolean;
  imageFormat?: 'PNG' | 'JPEG';
  maxWidth?: number;
  maxHeight?: number;
  filename?: string;
  improveCanvasQuality?: boolean;
}

export interface PDFExportResult {
  success: boolean;
  filename?: string;
  error?: string;
}

export const useExportPdf = (options: UsePDFExportOptions = {}) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const env = useEnvService().getEnv();

  const {
    scale = 1.5,
    preserveLinks = true,
    quality = 0.7,
    compression = true,
    imageFormat = 'JPEG',
    maxWidth = 1920,
    maxHeight = 1080,
    improveCanvasQuality = false,
  } = options;

  // Dimensions for export in 16:9 format (PowerPoint slide)
  // 1668x938 pixels (16:9 aspect ratio), equivalent to approximately 441mm x 248mm at 96 DPI
  const DEFAULT_CANVAS_WIDTH = 1668;
  const DEFAULT_CANVAS_HEIGHT = 938;

  // Pixel to millimeter conversion (1px = 0.2mm)
  // PDF_WIDTH_MM = 1668px * 0.2 = 333.6mm
  // PDF_HEIGHT_MM = 938px * 0.2 = 187.6mm
  const PX_TO_MM = 0.2;
  const PDF_WIDTH_MM = DEFAULT_CANVAS_WIDTH * PX_TO_MM; // 1668px * 0.2 = 333.6mm
  const PDF_HEIGHT_MM = DEFAULT_CANVAS_HEIGHT * PX_TO_MM; // 938px * 0.2 = 187.6mm

  const generateFilename = useCallback((): string => {
    if (options.filename) return `${options.filename}.pdf`;

    const country = applied?.country || 'Unknown Country';
    const zone = applied?.zone || 'Unknown Zone';
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replaceAll(':', '-');
    return `${currentPage}_${zone}_${country}_${timestamp}.pdf`;
  }, [applied, currentPage, options.filename]);

  const extractClickableLinks = useCallback(
    (
      element: HTMLElement,
    ): Array<{ text: string; url: string; rect: DOMRect }> => {
      if (!preserveLinks) return [];

      const links: Array<{ text: string; url: string; rect: DOMRect }> = [];
      const clickableElements = element.querySelectorAll(
        'a[href], button[onclick], [data-link]',
      );

      const parentRect = element.getBoundingClientRect();

      clickableElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        let url = '';

        if (htmlEl.tagName.toLowerCase() === 'a') {
          url = (htmlEl as HTMLAnchorElement).href;
        } else if (htmlEl.dataset.link) {
          url = htmlEl.dataset.link || '';
        } else if (htmlEl.onclick) {
          const onclickStr = htmlEl.onclick.toString();
          const urlMatch =
            /(?:window\.open|location\.href)\s*[=(]\s*['"`]([^'"`]+)['"`]/.exec(
              onclickStr,
            );
          if (urlMatch) {
            url = urlMatch[1];
          }
        }

        if (url) {
          htmlEl.style.textDecoration = 'underline';
          htmlEl.style.color = '#fff';
          htmlEl.setAttribute('title', `Link: ${url}`);

          const linkRect = htmlEl.getBoundingClientRect();
          const text = htmlEl.textContent || htmlEl.innerText || 'Link';

          const relativeRect = new DOMRect(
            linkRect.left - parentRect.left,
            linkRect.top - parentRect.top,
            linkRect.width,
            linkRect.height,
          );

          links.push({
            text: text.trim(),
            url,
            rect: relativeRect,
          });
        }
      });

      return links;
    },
    [preserveLinks],
  );

  const applyExportStyles = useCallback(
    (element: HTMLElement): (() => void) => {
      const originalMinHeight = element.style.minHeight;
      element.style.minHeight = `${DEFAULT_CANVAS_HEIGHT}px`;

      const firstChild =
        element.children?.length > 0
          ? (element.children[0] as HTMLElement)
          : null;
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
    },
    [DEFAULT_CANVAS_HEIGHT],
  );

  const logProgress = useCallback(
    (current: number, total: number, label: string) => {
      const percent = Math.round((current / total) * 100);
      const filled = Math.round(percent / 5);
      const empty = 20 - filled;
      const bar = `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
      console.log(
        `%c📄 PDF Export ${bar} ${percent}% — ${label} (${current}/${total})`,
        'color: #4CAF50; font-weight: bold;',
      );
    },
    [],
  );

  const yieldToMainThread = useCallback(
    () => new Promise<void>((resolve) => setTimeout(resolve, 0)),
    [],
  );

  const addPageToPdf = useCallback(
    (
      pdf: jsPDF,
      imgData: string,
      clickableLinks: Array<{ text: string; url: string; rect: DOMRect }>,
      element: HTMLElement,
      hasCanvas: boolean,
      pageIndex: number,
    ) => {
      if (pageIndex > 0) pdf.addPage();

      const finalFormat: 'PNG' | 'JPEG' = hasCanvas ? 'PNG' : imageFormat;
      const finalCompression: 'NONE' | 'SLOW' =
        !hasCanvas && compression ? 'SLOW' : 'NONE';

      pdf.addImage(
        imgData,
        finalFormat,
        0,
        0,
        PDF_WIDTH_MM,
        PDF_HEIGHT_MM,
        undefined,
        finalCompression,
      );

      clickableLinks.forEach((link) => {
        const relativeX = link.rect.left / element.offsetWidth;
        const relativeY = link.rect.top / element.offsetHeight;
        const pdfX = relativeX * PDF_WIDTH_MM;
        const pdfY = relativeY * PDF_HEIGHT_MM;
        const linkWidth =
          (link.rect.width / element.offsetWidth) * PDF_WIDTH_MM;
        const linkHeight =
          (link.rect.height / element.offsetHeight) * PDF_HEIGHT_MM;

        pdf.link(pdfX, pdfY, linkWidth, linkHeight, { url: link.url });
      });
    },
    [imageFormat, compression, PDF_WIDTH_MM, PDF_HEIGHT_MM],
  );

  const captureElementToImage = useCallback(
    async (
      element: HTMLElement,
      canvasWidth: number,
      canvasHeight: number,
      hasCanvas: boolean,
    ): Promise<string> => {
      const actualHeight = Math.max(element.scrollHeight, canvasHeight);
      const restoreImages = await inlineImagesForExport(element);

      try {
        const canvas = await html2canvas(element, {
          scale,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          removeContainer: true,
          imageTimeout: 18000,
          width: canvasWidth,
          height: actualHeight,
          logging: false,
        });

        if (hasCanvas) return canvas.toDataURL('image/png', 1);
        if (imageFormat === 'JPEG' && compression)
          return canvas.toDataURL('image/jpeg', quality);
        return canvas.toDataURL('image/png', quality);
      } finally {
        restoreImages();
      }
    },
    [scale, imageFormat, compression, quality],
  );

  const onExport = useCallback(
    async (elements: HTMLElement[]): Promise<PDFExportResult> => {
      try {
        if (env === 'UAT' || env === 'SIT') console.time('PDF Export Time');
        if (!elements || elements.length === 0) {
          return { success: false, error: 'No elements provided for export!' };
        }

        setIsExporting(true);
        setExportProgress(0);

        const totalElements = elements.length;
        console.log(
          `%c📄 PDF Export started — ${totalElements} page(s) to process`,
          'color: #2196F3; font-weight: bold;',
        );

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [PDF_WIDTH_MM, PDF_HEIGHT_MM],
        });

        const canvasWidth = Math.min(maxWidth, DEFAULT_CANVAS_WIDTH);
        const canvasHeight = Math.min(maxHeight, DEFAULT_CANVAS_HEIGHT);

        let pageCount = 0;

        for (let i = 0; i < totalElements; i++) {
          const element = elements[i];

          if (!element) {
            console.warn(
              `Element at index ${i} is null or undefined, skipping`,
            );
            logProgress(i + 1, totalElements, `Page ${i + 1} skipped (null)`);
            continue;
          }

          const restoreStyles = applyExportStyles(element);

          try {
            logProgress(i + 1, totalElements, `Capturing page ${i + 1}...`);

            const clickableLinks = extractClickableLinks(element);

            const hasCanvas =
              improveCanvasQuality &&
              element.querySelectorAll('canvas').length > 0;

            const imgData = await captureElementToImage(
              element,
              canvasWidth,
              canvasHeight,
              hasCanvas,
            );

            addPageToPdf(
              pdf,
              imgData,
              clickableLinks,
              element,
              hasCanvas,
              pageCount,
            );
            pageCount++;

            const progress = Math.round(((i + 1) / totalElements) * 100);
            setExportProgress(progress);
            logProgress(i + 1, totalElements, `Page ${i + 1} done`);
          } catch (canvasError) {
            console.error(`Error processing element ${i}:`, canvasError);
          } finally {
            restoreStyles();
          }

          // Yield to main thread between pages to keep UI responsive
          await yieldToMainThread();
        }

        const filename = generateFilename();
        pdf.save(filename);

        setExportProgress(100);
        console.log(
          `%c✅ PDF Export complete — ${pageCount} page(s) saved as "${filename}"`,
          'color: #4CAF50; font-weight: bold;',
        );
        if (env === 'UAT' || env === 'SIT') console.timeEnd('PDF Export Time');

        return { success: true, filename };
      } catch (error) {
        console.error('PDF export failed:', error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : 'Unknown error occurred',
        };
      } finally {
        setIsExporting(false);
      }
    },
    [
      PDF_WIDTH_MM,
      PDF_HEIGHT_MM,
      maxWidth,
      maxHeight,
      env,
      improveCanvasQuality,
      generateFilename,
      setIsExporting,
      setExportProgress,
      extractClickableLinks,
      applyExportStyles,
      addPageToPdf,
      captureElementToImage,
      logProgress,
      yieldToMainThread,
    ],
  );

  return {
    onExport,
    generateFilename,
    isExporting,
    exportProgress,
  };
};
