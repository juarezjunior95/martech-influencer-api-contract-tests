import { FC, Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Home } from '@hexa-ui/icons';
import {
  StyledCurrentPageName,
  StyledEllipsis,
  StyledListContainer,
  StyledNavigationHomePageIcon,
  StyledNavigationPageName,
  StyledSeparator,
} from 'components/Breadcrumbs/Breadcrumbs.styles';
import { useBreadcrumbs } from 'components/Breadcrumbs/hooks/useBreadcrumbs';
import { BreadcrumbsProps } from 'components/Breadcrumbs/types';
import { useHomeUrl } from 'config/platformUrls';
import FilterRegistry from 'domain/Filter/FilterRegistry/FilterRegistry';

export const Breadcrumbs: FC<BreadcrumbsProps> = ({
  showIcon,
  pageList,
  dataTestId,
}: BreadcrumbsProps) => {
  const { search } = useLocation();
  const {
    setIsExpanded,
    shouldCollapse,
    visibleItems,
    hiddenItemsCount,
    containerRef,
  } = useBreadcrumbs(pageList);

  const homeUrl = useHomeUrl();

  return (
    <StyledListContainer
      ref={containerRef}
      data-testid={dataTestId ? `breadcrumbs-${dataTestId}` : undefined}
    >
      {showIcon && (
        <>
          <StyledNavigationHomePageIcon
            data-testid={
              dataTestId ? `breadcrumbs-icon-home-${dataTestId}` : undefined
            }
          >
            <Link to={homeUrl}>
              <Home />
            </Link>
          </StyledNavigationHomePageIcon>
          <StyledSeparator
            data-testid={
              dataTestId ? `breadcrumbs-separator-${dataTestId}` : undefined
            }
          />
        </>
      )}

      {shouldCollapse && visibleItems.length > 0 ? (
        <>
          <StyledNavigationPageName>
            <Link
              to={FilterRegistry.mergeFilterParamsIntoHref(
                visibleItems[0].href,
                search,
              )}
              data-testid={
                dataTestId ? `breadcrumbs-link-${dataTestId}` : undefined
              }
            >
              {visibleItems[0].pageName}
            </Link>
          </StyledNavigationPageName>

          {hiddenItemsCount > 0 && (
            <>
              <StyledSeparator
                data-testid={
                  dataTestId
                    ? `breadcrumbs-separator-ellipsis-${dataTestId}`
                    : undefined
                }
              />
              <StyledEllipsis
                onClick={() => setIsExpanded(true)}
                data-testid={
                  dataTestId ? `breadcrumbs-ellipsis-${dataTestId}` : undefined
                }
              >
                ...
              </StyledEllipsis>
            </>
          )}

          {visibleItems.slice(1).map(({ href, pageName }, idx) => {
            const originalIndex = pageList.findIndex(
              (item) => item.href === href && item.pageName === pageName,
            );
            const isLastPage = originalIndex === pageList.length - 1;
            const displayIndex = idx + 1;

            return (
              <Fragment key={`${href}-${idx}`}>
                <StyledSeparator
                  data-testid={
                    dataTestId
                      ? `breadcrumbs-separator-${displayIndex}-${dataTestId}`
                      : undefined
                  }
                />
                {isLastPage ? (
                  <StyledCurrentPageName
                    data-testid={
                      dataTestId
                        ? `breadcrumbs-current-${dataTestId}`
                        : undefined
                    }
                  >
                    {pageName}
                  </StyledCurrentPageName>
                ) : (
                  <StyledNavigationPageName>
                    <Link
                      to={FilterRegistry.mergeFilterParamsIntoHref(
                        href,
                        search,
                      )}
                      data-testid={
                        dataTestId
                          ? `breadcrumbs-link-${displayIndex}-${dataTestId}`
                          : undefined
                      }
                    >
                      {pageName}
                    </Link>
                  </StyledNavigationPageName>
                )}
              </Fragment>
            );
          })}
        </>
      ) : (
        <>
          {pageList.map(({ href, pageName }, idx) => {
            const isLastPage = idx === pageList.length - 1;

            return (
              <Fragment key={`${href}-${idx}`}>
                {isLastPage ? (
                  <StyledCurrentPageName
                    data-testid={
                      dataTestId
                        ? `breadcrumbs-current-${dataTestId}`
                        : undefined
                    }
                  >
                    {pageName}
                  </StyledCurrentPageName>
                ) : (
                  <>
                    <StyledNavigationPageName>
                      <Link
                        to={FilterRegistry.mergeFilterParamsIntoHref(
                          href,
                          search,
                        )}
                        data-testid={
                          dataTestId
                            ? `breadcrumbs-link-${idx}-${dataTestId}`
                            : undefined
                        }
                      >
                        {pageName}
                      </Link>
                    </StyledNavigationPageName>
                    <StyledSeparator
                      data-testid={
                        dataTestId
                          ? `breadcrumbs-separator-${idx}-${dataTestId}`
                          : undefined
                      }
                    />
                  </>
                )}
              </Fragment>
            );
          })}
        </>
      )}
    </StyledListContainer>
  );
};
