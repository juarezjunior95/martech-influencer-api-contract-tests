import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { BffService } from 'services';
import { formatDateToYMD, parseDate } from 'utils/date';

const DATA_KEYS = [
  'finance',
  'volume',
  'p4w',
  'power',
  'pos',
  'market_share',
  'media',
  'growth_league',
  'innovation',
  'bees-distribution',
  'portfolio-health',
  'pillar-rennovation',
  'category-health',
] as const;

type DataKey = (typeof DATA_KEYS)[number];

export type LastDataRefresh = {
  [K in DataKey]?: string;
};

interface LastDataRefreshContextType {
  data: LastDataRefresh | null;
  lastDataRefreshKpis: { [key: string]: string | undefined };
  lastDataRefreshKpisFormated: { [key: string]: string | undefined };
  lastDataRefreshKpisDateMonthYear: { [key: string]: string | undefined };
  lastDataRefreshKpisDate: { [key: string]: Date | undefined };
  setData: React.Dispatch<React.SetStateAction<LastDataRefresh | null>>;
}

const LastDataRefreshContext = createContext<
  LastDataRefreshContextType | undefined
>(undefined);

export const LastDataRefreshProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<LastDataRefresh | null>(null);

  useEffect(() => {
    BffService.getInstance()
      .getData({
        endpoint: '/presets/kpi-group',
        params: {},
      })
      .then((response) => {
        if (!response || response.hasError) return;
        setData(response.data?.data ?? null);
      });
  }, []);

  const formatDataString = (value: string | undefined) => {
    if (!value) return '';

    const parts = value.split('-');
    if (parts.length !== 3) return value;

    const [day, month, year] = value.split('-');

    const date = new Date(
      Date.UTC(
        Number.parseInt(year, 10),
        Number.parseInt(month, 10) - 1,
        Number.parseInt(day, 10),
      ),
    );
    const monthName = date.toLocaleString('en-US', {
      month: 'short',
      timeZone: 'UTC',
    });

    return `${monthName} - ${year}`;
  };

  const lastDataRefreshKpis = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(DATA_KEYS.map((key) => [key, data[key]]));
  }, [data]);

  const lastDataRefreshKpisFormated = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(
      DATA_KEYS.map((key) => [key, formatDataString(data[key])]),
    );
  }, [data]);

  const lastDataRefreshKpisDate = useMemo(() => {
    if (!data) return {};
    return Object.fromEntries(
      DATA_KEYS.map((key) => [
        key,
        data[key] ? parseDate(data[key]) : undefined,
      ]),
    );
  }, [data]);

  const lastDataRefreshKpisDateMonthYear = useMemo(() => {
    if (!lastDataRefreshKpisDate) return {};
    return Object.fromEntries(
      DATA_KEYS.map((key) => [
        key,
        lastDataRefreshKpisDate[key]
          ? formatDateToYMD(lastDataRefreshKpisDate[key])
          : undefined,
      ]),
    );
  }, [lastDataRefreshKpisDate]);

  const value = useMemo(
    () => ({
      data,
      lastDataRefreshKpis,
      lastDataRefreshKpisFormated,
      lastDataRefreshKpisDate,
      lastDataRefreshKpisDateMonthYear,
      setData,
    }),
    [
      data,
      lastDataRefreshKpis,
      lastDataRefreshKpisFormated,
      lastDataRefreshKpisDate,
      lastDataRefreshKpisDateMonthYear,
    ],
  );

  return (
    <LastDataRefreshContext.Provider value={value}>
      {children}
    </LastDataRefreshContext.Provider>
  );
};

export const useLastDataRefresh = (): LastDataRefreshContextType => {
  const context = useContext(LastDataRefreshContext);
  if (!context) {
    throw new Error(
      'useLastDataRefresh should be used inside a LastDataRefreshProvider',
    );
  }
  return context;
};
