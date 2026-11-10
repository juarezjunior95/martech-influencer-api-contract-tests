import { BreadcrumbsProps } from 'components/Breadcrumbs/types';

const pillarsPageList: BreadcrumbsProps['pageList'] = [
  {
    href: 'https://one.martech.uat.bees-platform.dev/?pillar=category',
    pageName: 'Category',
  },
  {
    href: 'https://one.martech.uat.bees-platform.dev/?pillar=consumer',
    pageName: 'Consumer',
  },
  {
    href: 'https://one.martech.uat.bees-platform.dev/?pillar=portfolio-brand',
    pageName: 'Portfolio & Brand',
  },
  {
    href: 'https://one.martech.uat.bees-platform.dev/?pillar=innovation',
    pageName: 'Innovation',
  },
  {
    href: 'https://one.martech.uat.bees-platform.dev/?pillar=connections-creativity',
    pageName: 'Connections & Creativity',
  },
  {
    href: 'https://one.martech.uat.bees-platform.dev/?pillar=trade-execution',
    pageName: 'Trade Execution',
  },
  {
    href: 'https://one.martech.uat.bees-platform.dev/?pillar=value-creation',
    pageName: 'Value Creation',
  },
  {
    href: 'https://one.martech.uat.bees-platform.dev/?pillar=all-resources',
    pageName: 'All Resources',
  },
  {
    href: '#',
    pageName: 'Current page',
  },
];

const defaultPageList: BreadcrumbsProps['pageList'] = Array.from(
  { length: 4 },
  (_, idx) => ({ href: '#', pageName: `Page name ${idx + 1}` }),
);

const pageListWithOneItem: BreadcrumbsProps['pageList'] = Array.from(
  { length: 1 },
  (_) => ({ href: '#', pageName: 'Page name' }),
);

const pageListWithTwoItems: BreadcrumbsProps['pageList'] = Array.from(
  { length: 2 },
  (_, idx) => ({ href: '#', pageName: `Page name ${idx + 1}` }),
);

const pageListWithThreeItems: BreadcrumbsProps['pageList'] = Array.from(
  { length: 3 },
  (_, idx) => ({ href: '#', pageName: `Page name ${idx + 1}` }),
);

const pageListWithFourItems: BreadcrumbsProps['pageList'] = Array.from(
  { length: 4 },
  (_, idx) => ({ href: '#', pageName: `Page name ${idx + 1}` }),
);

const pageListWithFiveItems: BreadcrumbsProps['pageList'] = Array.from(
  { length: 5 },
  (_, idx) => ({ href: '#', pageName: `Page name ${idx + 1}` }),
);

const pageListWithSixItems: BreadcrumbsProps['pageList'] = Array.from(
  { length: 6 },
  (_, idx) => ({ href: '#', pageName: `Page name ${idx + 1}` }),
);

export {
  defaultPageList,
  pageListWithFiveItems,
  pageListWithFourItems,
  pageListWithOneItem,
  pageListWithSixItems,
  pageListWithThreeItems,
  pageListWithTwoItems,
  pillarsPageList,
};
