import { Breadcrumbs, Filter, StickyScroll } from 'components';
import { BreadcrumbsProps } from 'components/Breadcrumbs/types';
import { FilterProps } from 'components/Filter/Filter';
import { StickyScrollRootProps } from 'components/StickyScroll/components/StickyScrollRoot/StickyScrollRoot';

interface StickyScrollWithFiltersProps extends Omit<
  StickyScrollRootProps,
  'children' | 'hiddenAll'
> {
  filter: FilterProps;
  breadcrumbs?: BreadcrumbsProps;
}

export const StickyScrollWithFilters: React.FC<
  StickyScrollWithFiltersProps
> = ({
  filter,
  breadcrumbs,
  dataTestId,
  isExportPage,
  isResponsivePage,
  isTabPage,
}) => {
  return (
    <StickyScroll.Root
      isResponsivePage={isResponsivePage}
      isExportPage={isExportPage}
      isTabPage={isTabPage}
      hiddenAll={filter.hidden}
      dataTestId={dataTestId}
    >
      <Filter {...filter} />

      {breadcrumbs?.pageList && (
        <StickyScroll.Collapse>
          <Breadcrumbs {...breadcrumbs} />
        </StickyScroll.Collapse>
      )}
    </StickyScroll.Root>
  );
};
