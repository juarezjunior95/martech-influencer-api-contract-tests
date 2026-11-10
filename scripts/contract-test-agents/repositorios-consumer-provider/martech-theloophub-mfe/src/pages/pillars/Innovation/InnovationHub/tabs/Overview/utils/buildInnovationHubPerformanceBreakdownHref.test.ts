import { INNOVATION_HUB_PERFORMANCE_BREAKDOWN_ROUTE } from '../../../constants';
import { buildInnovationHubPerformanceBreakdownHref } from './buildInnovationHubPerformanceBreakdownHref';

describe('buildInnovationHubPerformanceBreakdownHref', () => {
  it('preserves existing query params and sets kpi', () => {
    const params = new URLSearchParams('zone=NAZ&country=BR');
    const href = buildInnovationHubPerformanceBreakdownHref(params, 'volume');
    expect(
      href.startsWith(`${INNOVATION_HUB_PERFORMANCE_BREAKDOWN_ROUTE}?`),
    ).toBe(true);
    const parsed = new URLSearchParams(href.split('?')[1] ?? '');
    expect(parsed.get('zone')).toBe('NAZ');
    expect(parsed.get('country')).toBe('BR');
    expect(parsed.get('kpi')).toBe('volume');
  });

  it('overwrites an existing kpi param', () => {
    const params = new URLSearchParams('kpi=nr&zone=EUR');
    const href = buildInnovationHubPerformanceBreakdownHref(
      params,
      'macoMargin',
    );
    const parsed = new URLSearchParams(href.split('?')[1] ?? '');
    expect(parsed.get('kpi')).toBe('macoMargin');
    expect(parsed.get('zone')).toBe('EUR');
  });
});
