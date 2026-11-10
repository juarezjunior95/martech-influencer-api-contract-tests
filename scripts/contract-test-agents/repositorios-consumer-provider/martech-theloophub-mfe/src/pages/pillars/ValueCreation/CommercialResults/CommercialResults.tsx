import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { PageHeader, StickyScrollWithFilters } from 'components';
import { usePageFilterManagement } from 'hooks';
import { StyledGridContainer, StyledHomeContainer } from 'shared/Styles';

import { KpiDrillDown } from './components/KpiDrillDown/KpiDrillDown';
import { COMMERCIAL_RESULTS_PAGE_NAME } from './constants';

const FILTER_VISIBLE_FIELDS: string[] = [
  'zone',
  'country',
  'brands',
  'sub_brands',
  'periods',
];

export const CommercialResults = () => {
  const { formatMessage } = useIntl();

  const pageTitle = formatMessage({
    id: 'ValueCreation.CommercialResults.title',
  });
  const pageSubtitle = formatMessage({
    id: 'ValueCreation.CommercialResults.subtitle',
  });
  const { updateForm, apply } = usePageFilterManagement(
    COMMERCIAL_RESULTS_PAGE_NAME,
  );

  const handleFilterChange = useCallback(
    (key: string, value: string) => {
      updateForm(key, value);
      apply();
    },
    [updateForm, apply],
  );
  return (
    <>
      <StickyScrollWithFilters
        filter={{
          pageName: COMMERCIAL_RESULTS_PAGE_NAME,
          visibleFields: FILTER_VISIBLE_FIELDS,
          hidden: true,
        }}
        breadcrumbs={{
          pageList: [
            { href: '/value-creation', pageName: 'Value Creation' },
            {
              href: '/value-creation/commercial-results',
              pageName: pageTitle,
            },
          ],
          showIcon: true,
        }}
        isResponsivePage
        dataTestId="commercial-results-navigation"
      />

      <StyledGridContainer isResponsivePage>
        <StyledHomeContainer>
          <PageHeader
            title={pageTitle}
            subtitle={pageSubtitle}
            loading={false}
          />
          <KpiDrillDown onFilterChange={handleFilterChange}></KpiDrillDown>
        </StyledHomeContainer>
      </StyledGridContainer>
    </>
  );
};
