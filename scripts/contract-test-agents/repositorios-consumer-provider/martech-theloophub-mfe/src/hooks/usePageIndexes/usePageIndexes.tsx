import { useCallback, useEffect, useState } from 'react';

import { useCurrentPage, usePageFilterApplied } from 'hooks';
import { PageIndexes, PageInfo } from 'pages/types';

import { calculatePageIndexes } from './utils';

export const usePageIndexes = (containerRef: React.RefObject<HTMLElement>) => {
  const [pageIndexes, setPageIndexes] = useState<PageIndexes>({});
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);

  const updateIndexes = useCallback(() => {
    const indexes = calculatePageIndexes(containerRef);
    setPageIndexes(indexes);
  }, [containerRef, applied]);

  useEffect(() => {
    updateIndexes();
  }, [updateIndexes]);

  const getPageByName = useCallback(
    (name: string): PageInfo | undefined => {
      return pageIndexes[name];
    },
    [pageIndexes],
  );

  return {
    pageIndexes,
    updateIndexes,
    getPageByName,
    totalPages: Object.keys(pageIndexes).length,
  };
};
