import type { RefObject } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

import {
  DROPDOWN_MIN_HEIGHT,
  DROPDOWN_OFFSET,
  DROPDOWN_WIDTH,
  VIEWPORT_PADDING,
} from './Dropdown.styles';

interface UseDropdownPositionParams {
  open: boolean;
  menuRef: RefObject<HTMLDivElement>;
  children?: React.ReactNode;
}

interface UseDropdownPositionReturn {
  position: { top: number; left: number };
}

export const useDropdownPosition = ({
  open,
  menuRef,
  children,
}: UseDropdownPositionParams): UseDropdownPositionReturn => {
  const containerRef = useRef<HTMLElement>(null);
  const menuDimensionsRef = useRef({
    width: DROPDOWN_WIDTH,
    height: DROPDOWN_MIN_HEIGHT,
  });
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open || !menuRef.current) return;

    const container = menuRef.current.parentElement;
    if (!container) {
      return;
    }

    containerRef.current = container;

    const menuRect = menuRef.current.getBoundingClientRect();
    menuDimensionsRef.current = {
      width: menuRect.width || DROPDOWN_WIDTH,
      height: menuRect.height || DROPDOWN_MIN_HEIGHT,
    };

    const triggerRect = container.getBoundingClientRect();

    const spaceBelow = globalThis.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const menuHeight = menuDimensionsRef.current.height;

    const shouldOpenUpwards =
      spaceBelow < menuHeight + VIEWPORT_PADDING && spaceAbove > spaceBelow;

    let offsetTop = 0;
    let offsetLeft = 0;
    let ancestor = container.parentElement;
    while (ancestor) {
      const style = globalThis.getComputedStyle(ancestor);
      if (style.transform !== 'none') {
        const ancestorRect = ancestor.getBoundingClientRect();
        offsetTop = ancestorRect.top;
        offsetLeft = ancestorRect.left;
        break;
      }
      ancestor = ancestor.parentElement;
    }

    const finalTop = shouldOpenUpwards
      ? triggerRect.top - offsetTop - menuHeight - DROPDOWN_OFFSET
      : triggerRect.bottom - offsetTop;

    setPosition({
      top: finalTop,
      left: triggerRect.left - offsetLeft,
    });
  }, [open, children, menuRef]);

  return {
    position,
  };
};
