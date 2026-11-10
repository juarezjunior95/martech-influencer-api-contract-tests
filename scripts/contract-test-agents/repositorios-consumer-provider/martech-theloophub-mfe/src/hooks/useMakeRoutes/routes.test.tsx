import {
  allRoutes,
  categoryRoutes,
  connectionsCreativityRoutes,
  consumerRoutes,
  innovationRoutes,
  portfolioBrandRoutes,
  tradeExecutionRoutes,
  valueCreationRoutes,
} from './routes';

const routeArrays = [
  valueCreationRoutes,
  tradeExecutionRoutes,
  portfolioBrandRoutes,
  categoryRoutes,
  consumerRoutes,
  connectionsCreativityRoutes,
  innovationRoutes,
];

function isValidRoute(
  route: unknown,
): route is { id: string; path: string; element: unknown } {
  return (
    typeof route === 'object' &&
    route !== null &&
    'id' in route &&
    'path' in route &&
    'element' in route &&
    typeof (route as { id: unknown }).id === 'string' &&
    typeof (route as { path: unknown }).path === 'string'
  );
}
jest.mock('pages', () => {
  const pageNames = [
    'AudienceTargeting',
    'BeesDistribution',
    'BrandAnalysis',
    'BrandPowerBook',
    'BrandPowerBookExport',
    'CategoryHealth',
    'CategoryHome',
    'ComponentsPage',
    'ConnectionsCreativityHome',
    'ConsumerHome',
    'DrillDown',
    'GrowthLeague',
    'Innovation',
    'InnovationHome',
    'InnovationHub',
    'Performance',
    'PerformanceReview',
    'PerformanceTool',
    'PnlPage',
    'PortfolioBrandHome',
    'POSBook',
    'ResourceAllocationMedia',
    'TradeExecutionHome',
    'ValueCreationHome',
    'VolumePages',
    'VolumePagesCountryPpr',
    'CommercialResults',
  ];
  return pageNames.reduce<Record<string, () => null>>((acc, name) => {
    acc[name] = () => null;
    return acc;
  }, {});
});

describe('routes.tsx', () => {
  it('should export route arrays with at least one route each', () => {
    routeArrays.forEach((routes) => {
      expect(Array.isArray(routes)).toBe(true);
      expect(routes.length).toBeGreaterThan(0);
    });
  });

  it('should have every route with id, path and element', () => {
    routeArrays.forEach((routes) => {
      routes.forEach((route) => {
        expect(isValidRoute(route)).toBe(true);
        expect((route as { id: string }).id).toBeTruthy();
        expect((route as { path: string }).path).toBeTruthy();
      });
    });
  });

  it('should have allRoutes with all pillar routes', () => {
    const minExpected = routeArrays.reduce((sum, arr) => sum + arr.length, 0);
    expect(allRoutes.length).toBeGreaterThanOrEqual(minExpected);
    expect(allRoutes.every(isValidRoute)).toBe(true);
  });

  it('should include value-creation and portfolio-brand base paths', () => {
    const paths = allRoutes.map((r) => r.path);
    expect(
      paths.some((p) => p.startsWith('/value-creation') || p === '/'),
    ).toBe(true);
    expect(paths.some((p) => p.startsWith('/portfolio-brand'))).toBe(true);
  });
});
