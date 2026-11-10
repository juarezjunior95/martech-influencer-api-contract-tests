import { renderHook } from '@testing-library/react-hooks';
import { useABTest, useMultiplesFeatureToggles, useSubFilters } from 'hooks';

import { OVERVIEW_TOGGLES } from '../constants';
import { applyChartsConfigs, applyRankingConfigs } from '../utils';
import { useKpiRequests } from './useKpiRequests';
import { useOverviewDataSource } from './useOverviewDataSource';

jest.mock('hooks');
jest.mock('./useKpiRequests');
jest.mock('../utils');

describe('useOverviewDataSource', () => {
  const mockUseSubFilters = jest.mocked(useSubFilters);
  const mockUseABTest = jest.mocked(useABTest);
  const mockUseMultiplesFeatureToggles = jest.mocked(
    useMultiplesFeatureToggles,
  );
  const mockUseKpiRequests = jest.mocked(useKpiRequests);
  const mockApplyChartsConfigs = jest.mocked(applyChartsConfigs);
  const mockApplyRankingConfigs = jest.mocked(applyRankingConfigs);

  const defaultKpiData = {
    charts: {
      mediaSpend: { data: { mediaSpend: 'data' }, loading: false },
    },
    table: { data: { table: 'data' }, loading: false },
    ranking: { data: { rankingKey: 'data' }, loading: false },
  };

  const defaultToggles = {
    [OVERVIEW_TOGGLES.BREAKDOWN_TABLE]: true,
    [OVERVIEW_TOGGLES.BREAKDOWN_CHARTS]: true,
    [OVERVIEW_TOGGLES.RANKING]: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseSubFilters.mockReturnValue({
      activeSubFilters: { kpis: 'media' },
    } as any);

    mockUseABTest.mockReturnValue({
      isGroupA: false,
      isControl: false,
      isReady: true,
    } as any);

    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: defaultToggles,
      togglesReady: true,
      togglesValues: [],
    });

    mockUseKpiRequests.mockReturnValue(defaultKpiData as any);
  });

  it('returns correctly formatted dataSource when everything is enabled', () => {
    const { result } = renderHook(() => useOverviewDataSource());

    expect(result.current.dataSource.charts.available).toBe(true);
    expect(result.current.dataSource.table.available).toBe(true);
    expect(result.current.dataSource.ranking.available).toBe(true);
    expect(result.current.dataSource.charts.data).toEqual({
      mediaSpend: 'data',
    });
  });

  it.each([
    ['toggles not ready', { togglesReady: false, abTestReady: true }, false],
    ['AB test not ready', { togglesReady: true, abTestReady: false }, false],
    ['both not ready', { togglesReady: false, abTestReady: false }, false],
    ['both ready', { togglesReady: true, abTestReady: true }, true],
  ])('isReady: %s', (_, { togglesReady, abTestReady }, expected) => {
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: defaultToggles,
      togglesReady,
      togglesValues: [],
    });
    mockUseABTest.mockReturnValue({
      isGroupA: false,
      isControl: false,
      isReady: abTestReady,
    } as any);

    const { result } = renderHook(() => useOverviewDataSource());

    expect(result.current.isReady).toBe(expected);
  });

  it.each([
    ['ranking', OVERVIEW_TOGGLES.RANKING, 'ranking'],
    ['breakdown table', OVERVIEW_TOGGLES.BREAKDOWN_TABLE, 'table'],
    ['breakdown charts', OVERVIEW_TOGGLES.BREAKDOWN_CHARTS, 'charts'],
  ])('sets %s available to false when toggle is disabled', (_, toggle, key) => {
    mockUseMultiplesFeatureToggles.mockReturnValue({
      featuresListByToggleName: {
        ...defaultToggles,
        [toggle]: false,
      },
      togglesReady: true,
      togglesValues: [],
    });

    const { result } = renderHook(() => useOverviewDataSource());

    expect(result.current.dataSource[key].available).toBe(false);
  });

  it('applies configs to chart and ranking data', () => {
    renderHook(() => useOverviewDataSource());

    expect(mockApplyChartsConfigs).toHaveBeenCalledWith('data');
    expect(mockApplyRankingConfigs).toHaveBeenCalledWith('data');
  });

  it.each([
    ['isGroupA true', { isGroupA: true, isControl: false }, true],
    ['isControl true', { isGroupA: false, isControl: true }, true],
    ['both true', { isGroupA: true, isControl: true }, true],
    ['both false', { isGroupA: false, isControl: false }, false],
  ])('isBreakdownViewer when %s', (_, { isGroupA, isControl }, expected) => {
    mockUseABTest.mockReturnValue({
      isGroupA,
      isControl,
      isReady: true,
    } as any);

    const { result } = renderHook(() => useOverviewDataSource());

    expect(result.current.isBreakdownViewer).toBe(expected);
  });

  it.each([
    ['string value', { kpis: 'media_spend' }, 'media_spend'],
    ['undefined value', {}, undefined],
    ['non-string value', { kpis: 123 }, undefined],
    ['null activeSubFilters', null, undefined],
  ])('activeDeepDiveSubfilter with %s', (_, activeSubFilters, expected) => {
    mockUseSubFilters.mockReturnValue({
      activeSubFilters,
    } as any);

    const { result } = renderHook(() => useOverviewDataSource());

    expect(result.current.activeDeepDiveSubfilter).toBe(expected);
  });

  it('handles chartData as null', () => {
    mockUseKpiRequests.mockReturnValue({
      charts: {
        mediaSpend: { data: null, loading: false },
      },
      table: { data: { table: 'data' }, loading: false },
      ranking: { data: { rankingKey: 'data' }, loading: false },
    } as any);

    const { result } = renderHook(() => useOverviewDataSource());

    expect(mockApplyChartsConfigs).not.toHaveBeenCalled();
    expect(result.current.dataSource.charts.data).toEqual({});
  });

  it('handles rankingData as null', () => {
    mockUseKpiRequests.mockReturnValue({
      charts: {
        mediaSpend: { data: { mediaSpend: 'data' }, loading: false },
      },
      table: { data: { table: 'data' }, loading: false },
      ranking: { data: null, loading: false },
    } as any);

    const { result } = renderHook(() => useOverviewDataSource());

    expect(mockApplyRankingConfigs).not.toHaveBeenCalled();
    expect(result.current.dataSource.ranking.data).toBeNull();
  });
});
