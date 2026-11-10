import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { RouteTabs, StickyScrollWithFilters } from 'components';
import { featureToggles } from 'config/featureToggle';
import { useFeatureToggle } from 'hooks';
import {
  Kpi,
  KPI_TO_PAGE_NAME,
  LoadingRegistryProvider,
  VolumePagesKpiProvider,
} from 'pages/pillars/ValueCreation/VolumePages/contexts';
import { Country, Global } from 'pages/pillars/ValueCreation/VolumePages/tabs';
import { StyledGridContainer, StyledGridItem } from 'shared/Styles';

const FILTER_COUNTRY_ONLY_KPIS: ReadonlySet<Kpi> = new Set([
  'nr',
  'market_share',
]);

export const getVolumePagesPageName = (kpi: Kpi) =>
  KPI_TO_PAGE_NAME[kpi] || 'value-creation_volume-pages';

export const getVolumePagesUrl = (kpi: Kpi) => `/value-creation/${kpi}-pages`;

export interface VolumePagesProps {
  kpi?: Kpi;
}

export const VolumePages: React.FC<VolumePagesProps> = ({ kpi = 'volume' }) => {
  const { formatMessage } = useIntl();
  const { tab } = useParams();
  const [showProductScopeFilter, isProductScopeFilterLoading] =
    useFeatureToggle(
      featureToggles.pillar.valueCreation.submenus.volumePages.filters
        .productScope,
    );
  const isProductScopeVisible =
    showProductScopeFilter && !isProductScopeFilterLoading;

  const countryTabView = tab === 'country';
  const dataTestId = `volume-pages`;

  const restrictToCountryTab = FILTER_COUNTRY_ONLY_KPIS.has(kpi);

  const visibleFields = useMemo(
    () => [
      ...(countryTabView ? ['zone', 'country'] : []),
      ...(!restrictToCountryTab && isProductScopeVisible
        ? ['product_scope']
        : []),
    ],
    [countryTabView, isProductScopeVisible, restrictToCountryTab],
  );

  return (
    <LoadingRegistryProvider>
      <VolumePagesKpiProvider kpi={kpi}>
        <StickyScrollWithFilters
          filter={{
            pageName: getVolumePagesPageName(kpi),
            visibleFields,
            dataTestId: `${dataTestId}-filter`,
            hidden: restrictToCountryTab && !countryTabView,
          }}
          breadcrumbs={{
            pageList: [
              {
                href: '/value-creation',
                pageName: formatMessage({
                  id: 'Pillars.pageName.valueCreation',
                }),
              },
              {
                href: '/value-creation/volume-pages',
                pageName: formatMessage({ id: `Sidebar.${kpi}Pages` }),
              },
            ],
            showIcon: true,
          }}
          isExportPage
        />

        <StyledGridContainer data-testid={dataTestId} isExportPage>
          <StyledGridItem
            data-testid={`${dataTestId}-grid-item`}
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ marginTop: 24, gap: 16 }}
          >
            <RouteTabs
              dataTestId={`${dataTestId}-route-tabs`}
              baseRoute={getVolumePagesUrl(kpi)}
              tabsInfos={[
                {
                  id: 'global',
                  label: 'Global',
                  content: <Global dataTestId={dataTestId} />,
                  disabled: false,
                },
                {
                  id: 'country',
                  label: 'Country',
                  content: <Country dataTestId={dataTestId} />,
                  disabled: false,
                },
              ]}
            />
          </StyledGridItem>
        </StyledGridContainer>
      </VolumePagesKpiProvider>
    </LoadingRegistryProvider>
  );
};
