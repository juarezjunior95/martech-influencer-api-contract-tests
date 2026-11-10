import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { BreadcrumbsProps } from 'components/Breadcrumbs/types';
import { useHomeUrl } from 'config/platformUrls';

const ROUTE_LABELS: Record<string, string> = {
  'value-creation': 'Value Creation',
  'performance-tool': 'Performance Tool',
  'portfolio-performance': 'Portfolio Performance',
  'performance-review': 'Performance Review',
  'growth-league': 'Growth League',
  'volume-pages': 'Volume Pages',
  'drill-down': 'Drill Down',
};

const PILLAR_SEGMENTS = new Set([
  'value-creation',
  'portfolio-brand',
  'category',
  'consumer',
  'connections-creativity',
  'innovation',
  'trade-execution',
]);

export const useBreadcrumbsFromRoute = (): BreadcrumbsProps['pageList'] => {
  const location = useLocation();
  const homeUrl = useHomeUrl();

  return useMemo(() => {
    const segments = location.pathname
      .split('/')
      .filter((segment) => segment && segment !== '');

    if (segments.length === 0) {
      return [];
    }

    const breadcrumbs: BreadcrumbsProps['pageList'] = [];
    let currentPath = '';

    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLastSegment = index === segments.length - 1;
      const isFirstSegment = index === 0;
      const isPillar = isFirstSegment && PILLAR_SEGMENTS.has(segment);

      let href: string;

      if (isPillar) {
        href = `${homeUrl}/?pillar=${segment}`;
      } else if (isLastSegment) {
        href = '#';
      } else {
        href = currentPath;
      }

      breadcrumbs.push({
        href,
        pageName: ROUTE_LABELS[segment] || segment,
      });
    });

    return breadcrumbs;
  }, [location.pathname, homeUrl]);
};
