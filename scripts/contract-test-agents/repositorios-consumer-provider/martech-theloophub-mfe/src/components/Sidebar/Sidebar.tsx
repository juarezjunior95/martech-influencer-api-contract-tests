import { createElement, ElementType, useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import {
  BarChart4,
  Beer,
  BeerBottles,
  CalendarClock,
  Cart,
  DollarSign,
  Lightbulb,
  Users,
} from '@hexa-ui/icons';
import BugReportIcon from 'assets/BugReport.svg';
import { APP_BASENAME } from 'config/api';
import { featureToggles } from 'config/featureToggle';
import { PAGES_WITH_DATA } from 'constants/dataRefresh/dataRefreshConfig';
import { useDataRefreshContext } from 'contexts';
import {
  useCurrentPage,
  useGoogleAnalytics,
  useMultiplesFeatureToggles,
} from 'hooks';
import { useSidebar } from 'martech-portal-shared-services';

type Target = '_blank' | '_self';

export interface SidebarSubItem {
  id: string;
  title: string;
  path: string;
  icon?: ElementType;
  target?: Target;
  onPageChange?: () => void;
}

export interface SidebarItem {
  id: string;
  title: string;
  icon: ElementType;
  path?: string;
  onPageChange?: () => void;
  subItems?: SidebarSubItem[];
  disabled?: boolean;
  target?: Target;
}

export type SidebarUtilitiesItem = SidebarItem;

export default function Sidebar() {
  const { formatMessage } = useIntl();
  const { currentPage } = useCurrentPage();
  const { setModalOpen } = useDataRefreshContext();
  const trackGA = useGoogleAnalytics();
  const {
    featuresListByToggleName: sidebarToggles,
    togglesReady: sidebarTogglesReady,
  } = useMultiplesFeatureToggles([
    featureToggles.pillar.category.id,

    featureToggles.pillar.consumer.id,
    featureToggles.pillar.consumer.submenus.audienceTargeting.id,

    featureToggles.pillar.portfolioBrand.id,
    featureToggles.pillar.portfolioBrand.submenus.portfolioPerformance.id,
    featureToggles.pillar.portfolioBrand.submenus.pnl.id,
    featureToggles.pillar.portfolioBrand.submenus.brandAnalysis.id,
    featureToggles.pillar.portfolioBrand.submenus.brandPower.id,
    featureToggles.pillar.portfolioBrand.submenus.beyondBeerControlTower.id,
    featureToggles.pillar.portfolioBrand.submenus.nonAlcBeerControlTower.id,
    featureToggles.pillar.portfolioBrand.submenus.brandPowerBook.id,
    featureToggles.pillar.portfolioBrand.submenus.brandPowerBookExport.id,

    featureToggles.pillar.innovation.id,
    featureToggles.pillar.innovation.submenus.innovation.id,

    featureToggles.pillar.connectionsAndCreativity.id,
    featureToggles.pillar.connectionsAndCreativity.submenus
      .resourceAllocationMedia.id,

    featureToggles.pillar.tradeExecution.id,

    featureToggles.pillar.valueCreation.id,
    featureToggles.pillar.valueCreation.submenus.growthLeague.id,
    featureToggles.pillar.valueCreation.submenus.volumePages.id,
    featureToggles.pillar.valueCreation.submenus.nrPages.id,
    featureToggles.pillar.valueCreation.submenus.market_sharePages.id,
    featureToggles.pillar.valueCreation.submenus.volumePagesCountryPpr.id,
    featureToggles.pillar.valueCreation.submenus.commercialResults.id,

    featureToggles.pillar.category.submenus.posBook.id,
    featureToggles.pillar.category.submenus.posPbi.id,
    featureToggles.pillar.category.submenus.categoryHealth.id,

    featureToggles.pillar.refreshSource.id,
    featureToggles.pillar.tradeExecution.submenus.beesDistribution.id,
  ]);

  const onPageChange = useCallback(
    (title: string) => {
      trackGA({
        event_category: 'Menu',
        event_action: 'Click',
        event_label: title,
      });
    },
    [trackGA],
  );

  const filterActiveItems = useCallback(
    (items: SidebarItem[]) => {
      const newItems = items.map((item) => {
        const disabled = !sidebarToggles[item.id];
        if (item.subItems) {
          item.subItems = item.subItems.filter(
            (subItem) => sidebarToggles[subItem.id],
          );
        }
        return { ...item, disabled };
      });

      return newItems;
    },
    [sidebarToggles],
  );

  const renderSidebarIcon = (icon: ElementType) => {
    return createElement(icon);
  };

  const renderBugReportIcon = () => {
    return (
      <img
        src={BugReportIcon}
        style={{ margin: '0 4px' }}
        alt="Report a Bug Icon"
      />
    );
  };

  const sidebarItems = useMemo(() => {
    if (!sidebarTogglesReady) return { items: [], utils: [] };

    const items: SidebarItem[] = [
      {
        id: featureToggles.pillar.category.id,
        icon: () => renderSidebarIcon(Beer),
        title: formatMessage({ id: 'Pillars.sidebar.category' }),
        path: `${APP_BASENAME}/category`,
        subItems: [
          {
            id: featureToggles.pillar.category.submenus.categoryHealth.id,
            title: formatMessage({ id: 'Sidebar.categoryHealth' }),
            path: `${APP_BASENAME}/category/category-health`,
            onPageChange: () => onPageChange('Category Health'),
          },
          {
            id: featureToggles.pillar.category.submenus.posBook.id,
            title: formatMessage({ id: 'Sidebar.posBook' }),
            path: `${APP_BASENAME}/category/pos`,
            onPageChange: () => onPageChange('POS Results'),
          },
          {
            id: featureToggles.pillar.category.submenus.posPbi.id,
            title: formatMessage({ id: 'Sidebar.powerBiPos' }),
            path: `https://abi.tools/s/pos`,
            target: '_blank',
            onPageChange: () => onPageChange('Power BI | POS'),
          },
        ],
      },
      {
        id: featureToggles.pillar.consumer.id,
        icon: () => renderSidebarIcon(Users),
        title: formatMessage({ id: 'Pillars.sidebar.consumer' }),
        path: `${APP_BASENAME}/consumer`,
        subItems: [
          {
            id: featureToggles.pillar.consumer.submenus.audienceTargeting.id,
            title: formatMessage({ id: 'Sidebar.audienceTargeting' }),
            path: `${APP_BASENAME}/consumer/audience-targeting`,
            onPageChange: () => onPageChange('Audience Targeting'),
          },
        ],
      },
      {
        id: featureToggles.pillar.portfolioBrand.id,
        icon: () => renderSidebarIcon(BeerBottles),
        path: `${APP_BASENAME}/portfolio-brand`,
        title: formatMessage({ id: 'Pillars.sidebar.portfolioBrand' }),
        subItems: [
          {
            id: featureToggles.pillar.portfolioBrand.submenus.brandPowerBook.id,
            title: formatMessage({ id: 'Sidebar.brandPowerBook' }),
            path: `${APP_BASENAME}/portfolio-brand/brand-power-book`,
            onPageChange: () => onPageChange('Brand Power Results'),
          },
          {
            id: featureToggles.pillar.portfolioBrand.submenus.brandAnalysis.id,
            title: formatMessage({ id: 'Sidebar.brandAnalysis' }),
            path: `${APP_BASENAME}/portfolio-brand/brand-analysis`,
            onPageChange: () => onPageChange('Brand Power Drivers'),
          },
          {
            id: featureToggles.pillar.portfolioBrand.submenus
              .portfolioPerformance.id,
            title: formatMessage({ id: 'Sidebar.portfolioPerformance' }),
            path: `${APP_BASENAME}/portfolio-brand/portfolio-performance`,
            onPageChange: () => onPageChange('Portfolio Performance'),
          },
          {
            id: featureToggles.pillar.portfolioBrand.submenus
              .brandPowerBookExport.id,
            title: formatMessage({ id: 'Sidebar.brandPowerBookExport' }),
            path: `${APP_BASENAME}/portfolio-brand/brand-power-book-export`,
            onPageChange: () => onPageChange('Brand Power Results Export'),
          },
          {
            id: featureToggles.pillar.portfolioBrand.submenus.pnl.id,
            title: formatMessage({ id: 'Sidebar.pnl' }),
            path: `${APP_BASENAME}/portfolio-brand/pnl`,
            onPageChange: () =>
              onPageChange('Country, Brand and Portfolio P&L'),
          },
          {
            id: featureToggles.pillar.portfolioBrand.submenus
              .beyondBeerControlTower.id,
            title: formatMessage({ id: 'Sidebar.beyondBeer' }),
            path: `https://abi.tools/s/beyondbeer`,
            target: '_blank',
            onPageChange: () => onPageChange('PowerBI | Beyond Beer'),
          },
          {
            id: featureToggles.pillar.portfolioBrand.submenus.brandPower.id,
            title: formatMessage({ id: 'Sidebar.brandPower' }),
            path: `https://abi.tools/s/brandguidance`,
            target: '_blank',
            onPageChange: () => onPageChange('PowerBI | Brand Power'),
          },

          {
            id: featureToggles.pillar.portfolioBrand.submenus
              .nonAlcBeerControlTower.id,
            title: formatMessage({ id: 'Sidebar.naBeer' }),
            path: `https://abi.tools/s/nabeer`,
            target: '_blank',
            onPageChange: () => onPageChange('PowerBI | NA Beer'),
          },
        ],
      },
      {
        id: featureToggles.pillar.innovation.id,
        icon: () => renderSidebarIcon(Lightbulb),
        title: formatMessage({ id: 'Pillars.sidebar.innovation' }),
        path: `${APP_BASENAME}/innovation`,
        subItems: [
          {
            id: featureToggles.pillar.innovation.submenus.innovation.id,
            title: formatMessage({ id: 'Sidebar.innovation' }),
            path: `${APP_BASENAME}/innovation/innovation`,
            onPageChange: () => onPageChange('Innovation'),
          },
        ],
      },
      {
        id: featureToggles.pillar.connectionsAndCreativity.id,
        icon: () => renderSidebarIcon(BarChart4),
        path: `${APP_BASENAME}/connections-creativity`,
        title: formatMessage({ id: 'Pillars.sidebar.connectionsCreativity' }),
        subItems: [
          {
            id: featureToggles.pillar.connectionsAndCreativity.submenus
              .resourceAllocationMedia.id,
            title: formatMessage({ id: 'Sidebar.resourceAllocationMedia' }),
            path: `${APP_BASENAME}/connections-creativity/resource-allocation-media`,
            onPageChange: () => onPageChange('Media & Campaign Results'),
          },
        ],
      },
      {
        id: featureToggles.pillar.tradeExecution.id,
        icon: () => renderSidebarIcon(Cart),
        title: formatMessage({ id: 'Pillars.sidebar.tradeExecution' }),
        path: `${APP_BASENAME}/trade-execution`,
        subItems: [
          {
            id: featureToggles.pillar.tradeExecution.submenus.beesDistribution
              .id,
            title: formatMessage({ id: 'Sidebar.beesDistribution' }),
            path: `${APP_BASENAME}/trade-execution/bees-distribution`,
            onPageChange: () => onPageChange('BEES Distribution'),
          },
        ],
      },
      {
        id: featureToggles.pillar.valueCreation.id,
        icon: () => renderSidebarIcon(DollarSign),
        title: formatMessage({ id: 'Pillars.sidebar.valueCreation' }),
        path: `${APP_BASENAME}/value-creation`,
        subItems: [
          {
            id: featureToggles.pillar.valueCreation.submenus.growthLeague.id,
            title: formatMessage({ id: 'Sidebar.growthLeague' }),
            path: `${APP_BASENAME}/value-creation/growth-league`,
            onPageChange: () => onPageChange('Growth League'),
          },
          {
            id: featureToggles.pillar.valueCreation.submenus.commercialResults
              .id,
            title: formatMessage({ id: 'Sidebar.commercialResults' }),
            path: `${APP_BASENAME}/value-creation/commercial-results`,
            onPageChange: () => onPageChange('Commercial Results'),
          },
          {
            id: featureToggles.pillar.valueCreation.submenus.volumePages.id,
            title: formatMessage({ id: 'Sidebar.volumePages' }),
            path: `${APP_BASENAME}/value-creation/volume-pages`,
            onPageChange: () => onPageChange('Volume Pages'),
          },
          {
            id: featureToggles.pillar.valueCreation.submenus.nrPages.id,
            title: formatMessage({ id: 'Sidebar.nrPages' }),
            path: `${APP_BASENAME}/value-creation/nr-pages`,
            onPageChange: () => onPageChange('Net Revenue Pages'),
          },
          {
            id: featureToggles.pillar.valueCreation.submenus.market_sharePages
              .id,
            title: formatMessage({ id: 'Sidebar.market_sharePages' }),
            path: `${APP_BASENAME}/value-creation/market_share-pages`,
            onPageChange: () => onPageChange('Market Share Pages'),
          },
          {
            id: featureToggles.pillar.valueCreation.submenus
              .volumePagesCountryPpr.id,
            title: formatMessage({ id: 'Sidebar.volumePagesCountryPpr' }),
            path: `${APP_BASENAME}/value-creation/volume-pages-country-ppr`,
            onPageChange: () => onPageChange('PPR Preread'),
          },
        ],
      },
    ];

    const utils = [
      {
        id: featureToggles.pillar.bugReport.id,
        title: formatMessage({ id: 'Sidebar.reportABug' }),
        icon: renderBugReportIcon,
        path: `https://forms.office.com/pages/responsepage.aspx?id=GUvwznZ3lEq4mzdcd6j5Nk_b6usKa2VDl8MHrQ7WrEJUQ1AyT0RVVTRKUUFYSkw1MlRFN01RS1ZJVS4u&route=shorturl`,
        target: '_blank',
      },
    ] as SidebarItem[];

    const modal: SidebarItem = {
      id: featureToggles.pillar.refreshSource.id,
      title: formatMessage({ id: 'Sidebar.refreshAndSource' }),
      icon: () => renderSidebarIcon(CalendarClock),
      onPageChange: () => setModalOpen(true),
    };

    const pageHasData = !!currentPage && PAGES_WITH_DATA.includes(currentPage);

    if (pageHasData) utils.push(modal);

    return {
      items: filterActiveItems(items),
      utils: filterActiveItems(utils),
    };
  }, [
    sidebarTogglesReady,
    filterActiveItems,
    currentPage,
    formatMessage,
    setModalOpen,
    onPageChange,
  ]);

  useSidebar(sidebarItems);

  return <></>;
}
