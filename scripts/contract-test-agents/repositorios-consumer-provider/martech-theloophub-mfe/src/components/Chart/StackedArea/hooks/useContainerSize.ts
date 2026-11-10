import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

interface ContainerSize {
  width: number;
  height: number;
}

function computeNextSize(
  prev: ContainerSize,
  width: number,
  height: number,
): ContainerSize {
  const nextWidth = Math.round(width);
  const nextHeight = Math.round(height);
  if (prev.width === nextWidth && prev.height === nextHeight) {
    return prev;
  }
  return { width: nextWidth, height: nextHeight };
}

function applyEntrySize(
  entries: ResizeObserverEntry[],
  setSize: Dispatch<SetStateAction<ContainerSize>>,
): void {
  const entry = entries[0];
  if (!entry) return;
  const { width, height } = entry.contentRect;
  setSize((prev) => computeNextSize(prev, width, height));
}

export function useContainerSize(): ContainerSize & {
  ref: (node: HTMLDivElement | null) => void;
} {
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);
  const rafIdRef = useRef<number>(0);

  const ref = useCallback((node: HTMLDivElement | null) => {
    cancelAnimationFrame(rafIdRef.current);

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node) return;

    observerRef.current = new ResizeObserver((entries) => {
      rafIdRef.current = requestAnimationFrame(() =>
        applyEntrySize(entries, setSize),
      );
    });

    observerRef.current.observe(node);
  }, []);

  return { ref, width: size.width, height: size.height };
}
