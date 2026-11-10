import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Grid } from '@hexa-ui/components';
import {
  RouteTabs,
  StickyScrollWithFilters,
  TabConfiguration,
} from 'components';
import { BreadcrumbsProps } from 'components/Breadcrumbs/types';
import { FilterProps } from 'components/Filter/Filter';
import { StyledGridContainer } from 'shared/Styles';

import { StyledContainer, StyledContent } from './TabsWithFilters.styles';

export interface TabsWithDynamicFiltersProps {
  baseFilter: FilterProps;
  tabConfig: TabConfiguration;
  tabFilterOverrides?: Record<string, FilterProps>;
  breadcrumbsList?: BreadcrumbsProps['pageList'];
  dataTestId?: string;
}
export const TabsWithDynamicFilters: React.FC<TabsWithDynamicFiltersProps> = ({
  baseFilter,
  tabConfig,
  tabFilterOverrides,
  breadcrumbsList,
  dataTestId,
}) => {
  const { tab } = useParams();

  const currentFilterConfig: FilterProps = useMemo(() => {
    return tabFilterOverrides?.[tab] || baseFilter;
  }, [tab, tabFilterOverrides, baseFilter]);

  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: currentFilterConfig.pageName,
          visibleFields: currentFilterConfig.visibleFields,
        }}
        breadcrumbs={{
          pageList: breadcrumbsList,
          showIcon: true,
        }}
        isTabPage
      />
      <StyledGridContainer>
        <Grid.Item xs={12} sm={12} md={12} lg={12} xl={12}>
          <StyledContainer data-testid={dataTestId || baseFilter.pageName}>
            <StyledContent
              data-testid={`${dataTestId || baseFilter.pageName}-content`}
            >
              <RouteTabs
                baseRoute={tabConfig.baseRoute}
                tabsInfos={tabConfig.tabs}
              />
            </StyledContent>
          </StyledContainer>
        </Grid.Item>
      </StyledGridContainer>
    </>
  );
};
