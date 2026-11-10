import { useMemo } from 'react';

import { featureToggles } from 'config/featureToggle';
import { useMultiplesFeatureToggles } from 'hooks/useMultipleFeatureToggles';

import { allRoutes, Route } from './routes';

export function useMakeRoutes(): Pick<Route, 'path' | 'element'>[] {
  const { featuresListByToggleName: featuresList, togglesReady: isReady } =
    useMultiplesFeatureToggles([
      featureToggles.pillar.valueCreation.submenus.volumePages.id,
      featureToggles.pillar.valueCreation.submenus.nrPages.id,
      featureToggles.pillar.valueCreation.submenus.market_sharePages.id,
      featureToggles.pillar.valueCreation.submenus.volumePagesCountryPpr.id,
      featureToggles.pillar.valueCreation.submenus.growthLeague.id,
      featureToggles.pillar.valueCreation.submenus.performanceTool.id,
      featureToggles.pillar.valueCreation.submenus.commercialResults.id,
      featureToggles.pillar.valueCreation.id,

      featureToggles.pillar.portfolioBrand.submenus.portfolioPerformance.id,
      featureToggles.pillar.portfolioBrand.submenus.brandAnalysis.id,
      featureToggles.pillar.portfolioBrand.submenus.pnl.id,
      featureToggles.pillar.portfolioBrand.submenus.brandPowerBook.id,
      featureToggles.pillar.portfolioBrand.submenus.brandPowerBookExport.id,
      featureToggles.pillar.portfolioBrand.id,

      featureToggles.pillar.category.submenus.posBook.id,
      featureToggles.pillar.category.submenus.posPbi.id,
      featureToggles.pillar.category.submenus.categoryHealth.id,
      featureToggles.pillar.category.id,

      featureToggles.pillar.connectionsAndCreativity.submenus
        .resourceAllocationMedia.id,
      featureToggles.pillar.connectionsAndCreativity.id,

      featureToggles.pillar.consumer.submenus.audienceTargeting.id,
      featureToggles.pillar.consumer.id,

      featureToggles.pillar.innovation.submenus.innovation.id,
      featureToggles.pillar.innovation.submenus.innovationHub.id,
      featureToggles.pillar.innovation.id,

      featureToggles.pillar.tradeExecution.submenus.beesDistribution.id,
      featureToggles.pillar.tradeExecution.id,

      featureToggles.developmentViewer,
    ]);

  const filteredRoutes: Pick<Route, 'path' | 'element'>[] = useMemo(() => {
    return allRoutes
      .filter((route) => featuresList[route.id])
      .map((route) => ({
        path: route.path,
        element: route.element,
      }));
  }, [featuresList]);

  if (!isReady) return [];

  return filteredRoutes;
}

export default useMakeRoutes;
