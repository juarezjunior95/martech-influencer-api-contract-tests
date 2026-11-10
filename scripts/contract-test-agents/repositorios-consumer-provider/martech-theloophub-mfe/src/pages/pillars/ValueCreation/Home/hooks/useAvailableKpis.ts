import { useCallback, useEffect, useState } from 'react';

import { BffService } from 'services';

interface KpiFilterValue {
  value: string;
  label: string;
  full: string;
}

interface UseAvailableKpisReturn {
  availableKpis: Set<string>;
  loading: boolean;
}

export const useAvailableKpis = (): UseAvailableKpisReturn => {
  const [availableKpis, setAvailableKpis] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const fetchKpis = useCallback(async () => {
    try {
      const response = await BffService.getInstance().getData({
        endpoint: '/presets/sub-filters_kpis',
        params: { 'kpis[kpi_groups]': 'performance_tool' },
      });

      if (!response || response.hasError) {
        console.error('Failed to fetch available KPIs');
        return;
      }

      const data = response.data?.data ?? response.data;
      const values: KpiFilterValue[] = data?.kpis?.values ?? [];
      setAvailableKpis(new Set(values.map((v) => v.value)));
    } catch (error) {
      console.error('Error fetching available KPIs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKpis();
  }, [fetchKpis]);

  return { availableKpis, loading };
};
