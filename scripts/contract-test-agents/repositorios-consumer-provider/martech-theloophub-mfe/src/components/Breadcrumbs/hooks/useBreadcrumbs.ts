import { useEffect, useRef, useState } from 'react';

import { BreadcrumbsProps } from 'components/Breadcrumbs/types';

export const useBreadcrumbs = (pageList: BreadcrumbsProps['pageList']) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const containerRef = useRef<HTMLUListElement>(null);

  const shouldCollapse = pageList.length > 3 && !isExpanded;

  const getVisibleItems = () => {
    if (!shouldCollapse) return pageList;

    const firstItem = pageList[0];
    const secondToLast = pageList.at(-2);
    const lastItem = pageList.at(-1);

    return [firstItem, secondToLast, lastItem];
  };

  const visibleItems = getVisibleItems();
  const hiddenItemsCount = pageList.length - visibleItems.length;

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return {
    setIsExpanded,
    visibleItems,
    shouldCollapse,
    hiddenItemsCount,
    containerRef,
  };
};
