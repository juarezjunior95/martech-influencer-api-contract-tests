import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

interface UseTruncationDetectionOptions {
  enabled?: boolean;
  mode?: 'css' | 'dynamic';
  minChars?: number;
  getElementToCheck?: (refElement: HTMLElement | null) => HTMLElement | null;
}

const TRUNCATION_BUFFER_PX = 2;
const ELLIPSIS = '…';

export const useTruncationDetection = <T extends HTMLElement = HTMLElement>(
  content?: string,
  options: UseTruncationDetectionOptions = {},
) => {
  const {
    enabled = true,
    mode = 'css',
    minChars = 2,
    getElementToCheck,
  } = options;

  const ref = useRef<T>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [displayText, setDisplayText] = useState(content || '');

  const checkCssTruncation = useCallback(() => {
    if (!enabled) return;

    const refElement = ref.current;
    const element = getElementToCheck
      ? getElementToCheck(refElement)
      : refElement;

    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, [enabled, getElementToCheck]);

  const calculateDynamicTruncation = useCallback(() => {
    if (!enabled || !content) {
      setDisplayText(content || '');
      setIsTruncated(false);
      return;
    }

    const container = ref.current;
    if (!container) {
      setDisplayText(content);
      setIsTruncated(false);
      return;
    }

    const textEl = container.firstElementChild as HTMLElement;
    if (!textEl) {
      setDisplayText(content);
      setIsTruncated(false);
      return;
    }

    const containerWidth = container.clientWidth;

    let siblingsWidth = 0;
    Array.from(container.children).forEach((child) => {
      if (child !== textEl) {
        siblingsWidth += (child as HTMLElement).offsetWidth;
      }
    });

    const availableWidth = containerWidth - siblingsWidth;

    if (availableWidth <= 0) {
      setDisplayText(content.substring(0, minChars) + ELLIPSIS);
      setIsTruncated(true);
      return;
    }

    const textStyle = globalThis.getComputedStyle(textEl);
    const font = `${textStyle.fontWeight} ${textStyle.fontSize} ${textStyle.fontFamily}`;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.font = font;

    const fullWidth = ctx.measureText(content).width;

    if (fullWidth <= availableWidth + TRUNCATION_BUFFER_PX) {
      setDisplayText(content);
      setIsTruncated(false);
      return;
    }

    const ellipsisWidth = ctx.measureText(ELLIPSIS).width;
    const targetWidth = availableWidth - ellipsisWidth;

    let bestFit = minChars;
    for (let i = content.length - 1; i >= minChars; i--) {
      if (ctx.measureText(content.substring(0, i)).width <= targetWidth) {
        bestFit = i;
        break;
      }
    }

    setDisplayText(
      content.substring(0, Math.max(bestFit, minChars)) + ELLIPSIS,
    );
    setIsTruncated(true);
  }, [enabled, content, minChars]);

  useLayoutEffect(() => {
    if (mode === 'dynamic') {
      calculateDynamicTruncation();
    }
  }, [mode, calculateDynamicTruncation]);

  useEffect(() => {
    if (mode === 'css') {
      checkCssTruncation();

      globalThis.addEventListener('resize', checkCssTruncation);
      return () => globalThis.removeEventListener('resize', checkCssTruncation);
    }

    const container = ref.current;
    if (!container) return;

    const observer = new ResizeObserver(calculateDynamicTruncation);
    observer.observe(container);

    return () => observer.disconnect();
  }, [mode, content, checkCssTruncation, calculateDynamicTruncation]);

  return { ref, isTruncated, displayText };
};
