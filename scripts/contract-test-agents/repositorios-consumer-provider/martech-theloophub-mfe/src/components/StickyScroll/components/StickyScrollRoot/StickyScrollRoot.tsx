import React, { ReactNode, useEffect, useRef, useState } from 'react';

import {
  StickyScrollCollapse,
  StickyScrollCollapseProps,
} from '../StickyScrollCollapse/StickyScrollCollapse';
import { StickyScrollRootStyles } from './StickyScrollRoot.styles';

export interface StickyScrollRootProps {
  children: ReactNode;
  dataTestId?: string;
  isExportPage?: boolean;
  isResponsivePage?: boolean;
  isTabPage?: boolean;
  hiddenAll?: boolean;
}

const SCROLL_THRESHOLD = 240;
const BACKGROUND_THRESHOLD = 20;

const getWindow = (): Window => globalThis as unknown as Window;

export const StickyScrollRoot = ({
  children,
  dataTestId,
  isExportPage,
  isResponsivePage,
  isTabPage,
  hiddenAll,
}: StickyScrollRootProps) => {
  const [showContent, setShowContent] = useState<boolean>(true);
  const [showBackground, setShowBackground] = useState<boolean>(true);

  const lastScrollY = useRef<number>(0);
  const scrollAccumulator = useRef<number>(0);

  useEffect(() => {
    const initialScrollY = getWindow().scrollY;

    if (initialScrollY <= BACKGROUND_THRESHOLD) {
      setShowBackground(false);
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        getWindow().requestAnimationFrame(() => {
          const currentScrollY = getWindow().scrollY;
          const delta = currentScrollY - lastScrollY.current;

          setShowBackground(currentScrollY > BACKGROUND_THRESHOLD);

          scrollAccumulator.current += delta;

          if (scrollAccumulator.current > SCROLL_THRESHOLD) {
            setShowContent(false);
            scrollAccumulator.current = 0;
          } else if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
            setShowContent(true);
            scrollAccumulator.current = 0;
          }

          lastScrollY.current = currentScrollY;
          ticking = false;
        });

        ticking = true;
      }
    };

    getWindow().addEventListener('scroll', onScroll);
    return () => getWindow().removeEventListener('scroll', onScroll);
  }, []);

  return (
    <StickyScrollRootStyles
      data-testid={dataTestId}
      showBackground={showBackground}
      isExportPage={isExportPage}
      isResponsivePage={isResponsivePage}
      isTabPage={isTabPage}
      hiddenAll={hiddenAll && !showContent}
      showContent={showContent}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === StickyScrollCollapse) {
          return React.cloneElement(
            child as React.ReactElement<StickyScrollCollapseProps>,
            {
              show: showContent,
            },
          );
        }

        return child;
      })}
    </StickyScrollRootStyles>
  );
};
