import { Grid } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { Info } from '@hexa-ui/icons2';
import { CustomTooltip, RouteTabs, StickyScrollWithFilters } from 'components';
import { BreadcrumbsProps } from 'components/Breadcrumbs/types';
import { FilterProps } from 'components/Filter/Filter';
import type { TabInfo } from 'components/RouteTabs/RouteTabs';
import { StyledGridContainer, StyledTitle } from 'shared/Styles';

import {
  StyledContainer,
  StyledContent,
  StyledPageDescription,
  StyledPageTitleContainer,
  StyledPageTitleContent,
  StyledPageTitleRow,
} from './TabsWithFilters.styles';

export interface TabConfiguration {
  tabs: TabInfo[];
  baseRoute: string;
  onTabChange?: (tabId: string) => void;
}

export interface TabsWithFiltersProps {
  filter: FilterProps;
  title?: {
    title: string;
    description?: string;
    tooltip?: React.ReactNode;
    dataTestId?: string;
  };
  tabConfig: TabConfiguration;
  breadcrumbsList?: BreadcrumbsProps['pageList'];
  dataTestId?: string;
  isResponsivePage?: boolean;
}

export const TabsWithFilters: React.FC<TabsWithFiltersProps> = ({
  filter,
  title,
  tabConfig,
  breadcrumbsList,
  dataTestId,
  isResponsivePage,
}) => {
  const tabsWithFilterConfig = tabConfig.tabs.map((tab) => ({
    ...tab,
    filterConfig: {
      ...tab.filterConfig,
      pageName: filter.pageName,
      hidden: filter.hidden,
    },
  }));

  const containerTestId = dataTestId || filter.pageName;

  return (
    <>
      <StickyScrollWithFilters
        filter={filter}
        breadcrumbs={{
          pageList: breadcrumbsList,
          showIcon: true,
        }}
        isTabPage
        isResponsivePage={isResponsivePage}
      />

      {title && (
        <StyledGridContainer css={{ paddingBottom: 0 }}>
          <Grid.Item xs={12} sm={12} md={12} lg={12} xl={12}>
            <StyledPageTitleContainer data-testid={dataTestId}>
              <StyledPageTitleRow>
                <StyledPageTitleContent>
                  <StyledTitle
                    size="H1"
                    data-testid={
                      dataTestId ? `page-title-${dataTestId}` : undefined
                    }
                  >
                    {title.title}
                  </StyledTitle>

                  {title.tooltip && (
                    <CustomTooltip
                      content={title.tooltip}
                      label={title.title}
                      dataTestId={
                        dataTestId
                          ? `page-title-tooltip-${dataTestId}`
                          : undefined
                      }
                    >
                      <Icon
                        icon={Info}
                        size="large"
                        data-testid={
                          dataTestId
                            ? `page-title-tooltip-icon-${dataTestId}`
                            : undefined
                        }
                      />
                    </CustomTooltip>
                  )}
                </StyledPageTitleContent>
              </StyledPageTitleRow>

              {title.description && (
                <StyledPageDescription
                  data-testid={
                    dataTestId
                      ? `page-title-description-${dataTestId}`
                      : undefined
                  }
                >
                  {title.description}
                </StyledPageDescription>
              )}
            </StyledPageTitleContainer>
          </Grid.Item>
        </StyledGridContainer>
      )}

      <StyledGridContainer isResponsivePage={isResponsivePage}>
        <Grid.Item xs={12} sm={12} md={12} lg={12} xl={12}>
          <StyledContainer data-testid={containerTestId}>
            <StyledContent data-testid={`${containerTestId}-content`}>
              <RouteTabs
                baseRoute={tabConfig.baseRoute}
                tabsInfos={tabsWithFilterConfig}
                onTabChange={tabConfig.onTabChange}
                maxWidth={isResponsivePage ? '100%' : '1328px'}
              />
            </StyledContent>
          </StyledContainer>
        </Grid.Item>
      </StyledGridContainer>
    </>
  );
};
