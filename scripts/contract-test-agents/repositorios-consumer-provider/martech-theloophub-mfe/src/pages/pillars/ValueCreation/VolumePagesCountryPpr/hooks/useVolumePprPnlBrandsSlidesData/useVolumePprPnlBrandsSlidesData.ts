import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useBffData } from 'hooks';
import {
  omitSecondPnlRowGroup,
  splitPnlBrandsTable,
} from 'pages/components/ValueCreation';

export interface PnlBrandsVolumePprSplit {
  first: TableDataType;
  second: TableDataType;
}

export interface UseVolumePprPnlBrandsSlidesDataResult {
  pnlBrandsRequest: ReturnType<typeof useBffData>;
  pnlBrandsDataVolumePpr: PnlBrandsVolumePprSplit;
  sectionLoading: boolean;
}

export const useVolumePprPnlBrandsSlidesData =
  (): UseVolumePprPnlBrandsSlidesDataResult => {
    const pnlBrandsRequest = useBffData({
      id: 'value-creation_portfolio-performance_pl',
      kpiGroup: 'finance',
      subFilters: {
        period: 'YTD',
      },
    });

    const pnlBrandsDataVolumePpr = useMemo(() => {
      const split = splitPnlBrandsTable({
        kpiData: {
          table: pnlBrandsRequest.data?.['plBrand'] as TableDataType,
        },
        loading: pnlBrandsRequest.loading,
        error: pnlBrandsRequest.error,
      });
      return {
        first: omitSecondPnlRowGroup(split.first),
        second: omitSecondPnlRowGroup(split.second),
      };
    }, [pnlBrandsRequest]);

    return {
      pnlBrandsRequest,
      pnlBrandsDataVolumePpr,
      sectionLoading: pnlBrandsRequest.loading,
    };
  };
