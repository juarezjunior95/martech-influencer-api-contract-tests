interface BreadcrumbPage {
  href: string;
  pageName: string;
}

type BreadcrumbsProps = {
  pageList: BreadcrumbPage[];
  showIcon: boolean;
  dataTestId?: string;
};

export type { BreadcrumbPage, BreadcrumbsProps };
