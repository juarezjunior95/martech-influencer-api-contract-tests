import { renderHook } from '@testing-library/react-hooks';
import { useBffData } from 'hooks';

import {
  powerVsLqMock,
  powerVsLyMock,
  trendOverTimeMock,
  yearPowerVsAcMock,
} from '../../../__mocks';
import { usePowerBookOverviewData } from './usePowerBookOverviewData';

jest.mock('hooks', () => ({
  useBffData: jest.fn(),
}));

const mockUseBffData = useBffData as jest.Mock;

const mockLegend = [
  { label: 'Previous Year', color: '#EDDAB1' },
  { label: 'Current Year', color: '#D1A33C' },
];

const baseBffData = {
  powerVsLq: powerVsLqMock,
  powerVsLy: powerVsLyMock,
  trendOverTime: trendOverTimeMock,
  yearPowerVsAc: yearPowerVsAcMock,
};

const renderUsePowerBookOverviewData = (subScopeFilter = 'All Global Brands') =>
  renderHook(() => usePowerBookOverviewData(subScopeFilter));

const setBffResponse = (
  partial: Partial<{ loading: boolean; error: Error | null; data: unknown }>,
) =>
  mockUseBffData.mockReturnValue({
    loading: false,
    error: null,
    data: null,
    ...partial,
  });

describe('usePowerBookOverviewData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns BFF data split into bigNumbers and performanceTrend buckets', () => {
    setBffResponse({ data: baseBffData });

    const { result } = renderUsePowerBookOverviewData();

    expect(result.current.bigNumbers.data).toEqual({
      powerVsLq: powerVsLqMock,
      powerVsLy: powerVsLyMock,
    });
    expect(result.current.performanceTrend.data).toEqual({
      trendOverTime: trendOverTimeMock,
      yearPowerVsAc: yearPowerVsAcMock,
      legend: trendOverTimeMock.legend,
    });
  });

  it('propagates loading and error states to both buckets', () => {
    const error = new Error('BFF error');
    setBffResponse({ loading: true });

    const { result: loadingResult } = renderUsePowerBookOverviewData();
    expect(loadingResult.current.bigNumbers.loading).toBe(true);
    expect(loadingResult.current.performanceTrend.loading).toBe(true);

    setBffResponse({ error });
    const { result: errorResult } = renderUsePowerBookOverviewData();
    expect(errorResult.current.bigNumbers.error).toBe(error);
    expect(errorResult.current.performanceTrend.error).toBe(error);
  });

  it('returns empty objects for bigNumbers when BFF data is missing', () => {
    setBffResponse({ data: null });

    const { result } = renderUsePowerBookOverviewData();

    expect(result.current.bigNumbers.data.powerVsLq).toEqual({});
    expect(result.current.bigNumbers.data.powerVsLy).toEqual({});
  });

  it('extracts legend from trendOverTime when present', () => {
    setBffResponse({
      data: {
        ...baseBffData,
        trendOverTime: { ...trendOverTimeMock, legend: mockLegend },
      },
    });

    const { result } = renderUsePowerBookOverviewData();

    expect(result.current.performanceTrend.data.legend).toEqual(mockLegend);
  });

  it('passes subScopeFilter to useBffData as page_filter', () => {
    setBffResponse({ data: baseBffData });

    renderUsePowerBookOverviewData('Heineken');

    expect(mockUseBffData).toHaveBeenCalledWith({
      id: expect.any(String),
      kpiGroup: 'power',
      subFilters: { page_filter: 'Heineken' },
    });
  });
});
