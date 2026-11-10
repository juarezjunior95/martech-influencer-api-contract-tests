import React, { createElement } from 'react';
import { createIntl, IntlProvider } from 'react-intl';

import { renderHook } from '@testing-library/react-hooks';
import enUS from 'i18n/languages/en-US';
import { flattenObject } from 'i18n/provider';

import { innovationHubMainCardsMock } from '../../../../__mocks__/innovationHubTestFixtures';
import { INNOVATION_HUB_OVERVIEW_KPI_DATA_NOT_AVAILABLE_I18N_ID } from '../../constants';
import { mapInnovationHubMainCardsToEmptyNotice } from '../../utils/mapInnovationHubMainCardsToEmptyNotice';
import { useInnovationHubOverviewData } from '../useInnovationHubOverviewData/useInnovationHubOverviewData';
import { useInnovationHubOverviewMockData } from './useInnovationHubOverviewMockData';

const mockOverviewConstantsFlags = {
  forceSkeleton: false,
  forceEmpty: false,
};

jest.mock('../../constants', () => {
  const actual =
    jest.requireActual<typeof import('../../constants')>('../../constants');
  return {
    ...actual,
    get INNOVATION_HUB_OVERVIEW_MOCK_FORCE_SKELETON_STATE() {
      return mockOverviewConstantsFlags.forceSkeleton;
    },
    get INNOVATION_HUB_OVERVIEW_MOCK_FORCE_EMPTY_STATE() {
      return mockOverviewConstantsFlags.forceEmpty;
    },
  };
});

const messages = flattenObject(enUS);
const intl = createIntl({ locale: 'en-US', messages });

describe('useInnovationHubOverviewMockData', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(IntlProvider, { locale: 'en-US', messages }, children);

  afterEach(() => {
    mockOverviewConstantsFlags.forceSkeleton = false;
    mockOverviewConstantsFlags.forceEmpty = false;
  });

  it('returns ready state with full main-cards mock (no forced empty state)', () => {
    const { result } = renderHook(() => useInnovationHubOverviewMockData(), {
      wrapper,
    });

    expect(result.current.view).toBe('ready');
    expect(result.current.mainCards).toEqual(innovationHubMainCardsMock);
  });

  it('refetch resolves with no-op on mock data', async () => {
    const { result } = renderHook(() => useInnovationHubOverviewMockData(), {
      wrapper,
    });

    await expect(result.current.refetch()).resolves.toBeUndefined();
  });

  it('returns loading view when mock forces skeleton state', () => {
    mockOverviewConstantsFlags.forceSkeleton = true;

    const { result } = renderHook(() => useInnovationHubOverviewMockData(), {
      wrapper,
    });

    expect(result.current.view).toBe('loading');
    expect(result.current.mainCards).toBeNull();
  });

  it('refetch resolves with no-op when mock forces skeleton state', async () => {
    mockOverviewConstantsFlags.forceSkeleton = true;

    const { result } = renderHook(() => useInnovationHubOverviewMockData(), {
      wrapper,
    });

    await expect(result.current.refetch()).resolves.toBeUndefined();
  });

  it('prioritizes skeleton over empty when both mock force flags are true', () => {
    mockOverviewConstantsFlags.forceSkeleton = true;
    mockOverviewConstantsFlags.forceEmpty = true;

    const { result } = renderHook(() => useInnovationHubOverviewMockData(), {
      wrapper,
    });

    expect(result.current.view).toBe('loading');
    expect(result.current.mainCards).toBeNull();
  });

  it('returns main cards with empty notice when mock forces empty state', () => {
    mockOverviewConstantsFlags.forceEmpty = true;

    const expected = mapInnovationHubMainCardsToEmptyNotice(
      innovationHubMainCardsMock,
      intl.formatMessage({
        id: INNOVATION_HUB_OVERVIEW_KPI_DATA_NOT_AVAILABLE_I18N_ID,
      }),
    );

    const { result } = renderHook(() => useInnovationHubOverviewMockData(), {
      wrapper,
    });

    expect(result.current.view).toBe('ready');
    expect(result.current.mainCards).toEqual(expected);
  });
});

describe('useInnovationHubOverviewData', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(IntlProvider, { locale: 'en-US', messages }, children);

  it('delegates to the same mock-backed payload as useInnovationHubOverviewMockData', () => {
    const { result: dataResult } = renderHook(
      () => useInnovationHubOverviewData(),
      { wrapper },
    );
    const { result: mockResult } = renderHook(
      () => useInnovationHubOverviewMockData(),
      { wrapper },
    );

    expect(dataResult.current.view).toBe(mockResult.current.view);
    expect(dataResult.current.mainCards).toEqual(mockResult.current.mainCards);
    expect(typeof dataResult.current.refetch).toBe('function');
    expect(typeof mockResult.current.refetch).toBe('function');
  });
});
