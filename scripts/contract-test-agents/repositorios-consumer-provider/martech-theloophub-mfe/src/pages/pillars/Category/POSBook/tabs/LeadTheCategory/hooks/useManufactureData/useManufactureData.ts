import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData, usePageFilterApplied, useSubFilters } from 'hooks';

import { POS_BOOK_PAGE_NAME } from '../../../../POSBook';
import {
  PRICE_SEGMENTS_ALL_MANUFACTURE,
  PRICE_SEGMENTS_KEY_MANUFACTURE,
} from '../../constants';
import {
  buildBffManufactureSubFilters,
  getBffManufactureKpiId,
} from '../../utils';

export const useManufactureData = () => {
  const { isGlobalZone } = usePageFilterApplied(POS_BOOK_PAGE_NAME);
  const { activeSubFilters } = useSubFilters();

  const priceSegment = useMemo(
    () =>
      (activeSubFilters?.[PRICE_SEGMENTS_KEY_MANUFACTURE] as string) ||
      PRICE_SEGMENTS_ALL_MANUFACTURE,
    [activeSubFilters],
  );

  const bffSubFilters = useMemo(
    () => buildBffManufactureSubFilters({ price_segment: priceSegment }),
    [priceSegment],
  );

  const bffKpiId = useMemo(
    () => getBffManufactureKpiId(isGlobalZone),
    [isGlobalZone],
  );

  const bffData = useBffData({
    id: bffKpiId,
    kpiGroup: 'pos',
    subFilters: bffSubFilters,
  });

  const tableData = useMemo(() => {
    if (bffData.loading || !bffData.data) return null;
    return bffData.data['manufacture-participation'] as TableDataType;
  }, [bffData.data, bffData.loading]);

  return {
    tableData,
    loading: bffData.loading,
    error: bffData.error,
  };
};
