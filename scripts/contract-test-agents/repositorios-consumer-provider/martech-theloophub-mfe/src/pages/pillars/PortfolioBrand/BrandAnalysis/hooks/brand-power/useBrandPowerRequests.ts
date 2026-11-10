import { useMemo } from 'react';

import { usePageFilterApplied, useSubFilters } from 'hooks';

import { BRAND_ANALYSIS_PAGE_NAME } from '../../constants';
import { useBrandPowerAwarenessRequests } from './useBrandPowerAwarenessRequests';
import { useBrandPowerDetailRequests } from './useBrandPowerDetailRequests';
import { useBrandPowerImageryRequests } from './useBrandPowerImageryRequests';
import { useBrandPowerMainRequest } from './useBrandPowerMainRequest';
import {
  getImagerySubFilters,
  getOccasionBffSubFilters,
  hasSelectedFilterValue,
} from './useBrandPowerRequests.helpers';
import {
  KpiResponses,
  UseBrandPowerRequestsParams,
} from './useBrandPowerRequests.types';

export const useBrandPowerRequests = ({
  quarterYearSelected,
  powerAwarenessSelected,
  enabled,
}: UseBrandPowerRequestsParams) => {
  const { activeSubFilters, subFiltersLoaded } = useSubFilters();
  const { applied } = usePageFilterApplied(BRAND_ANALYSIS_PAGE_NAME);

  const hasBrandContext = useMemo(
    () =>
      hasSelectedFilterValue(applied?.brands_abi) ||
      hasSelectedFilterValue(applied?.sub_brands) ||
      hasSelectedFilterValue(applied?.brands_comp),
    [applied?.brands_abi, applied?.sub_brands, applied?.brands_comp],
  );

  const powerBffSubFilters = useMemo(
    () => (hasBrandContext ? { viewtype: 'brand' } : null),
    [hasBrandContext],
  );

  const effectiveDetailsEnabled = enabled.details && applied?.country !== 'ABI';

  const occasionBffSubFilters = useMemo(
    () =>
      getOccasionBffSubFilters(
        activeSubFilters,
        quarterYearSelected,
        applied?.time_frame,
      ),
    [activeSubFilters, quarterYearSelected, applied?.time_frame],
  );

  const imagerySubFilters = useMemo(
    () => getImagerySubFilters(activeSubFilters, subFiltersLoaded),
    [activeSubFilters, subFiltersLoaded],
  );

  const shouldLoadImageryDetails = useMemo(
    () => effectiveDetailsEnabled && imagerySubFilters !== null,
    [effectiveDetailsEnabled, imagerySubFilters],
  );

  const shouldLoadBrandClarity = useMemo(
    () => effectiveDetailsEnabled && powerAwarenessSelected === 'brand-clarity',
    [effectiveDetailsEnabled, powerAwarenessSelected],
  );

  const powerGroup = useBrandPowerMainRequest({
    enabledPower: enabled.power,
    powerBffSubFilters,
  });

  const detailsGroup = useBrandPowerDetailRequests({
    detailsEnabled: effectiveDetailsEnabled,
  });

  const awarenessGroup = useBrandPowerAwarenessRequests({
    detailsEnabled: effectiveDetailsEnabled,
    shouldLoadBrandClarity,
    occasionBffSubFilters,
  });

  const imageryGroup = useBrandPowerImageryRequests({
    detailsEnabled: effectiveDetailsEnabled,
    shouldLoadImageryDetails,
    imagerySubFilters,
  });

  const responses: KpiResponses = {
    power: powerGroup.responses.power,
    meaning: detailsGroup.responses.meaning,
    affinity: detailsGroup.responses.affinity,
    meetNeeds: detailsGroup.responses.meetNeeds,
    difference: detailsGroup.responses.difference,
    dynamic: detailsGroup.responses.dynamic,
    unique: detailsGroup.responses.unique,
    salience: awarenessGroup.responses.salience,
    unaided_awareness: awarenessGroup.responses.unaided_awareness,
    brand_clarity: awarenessGroup.responses.brand_clarity,
    occasion: awarenessGroup.responses.occasion,
    imageries: imageryGroup.responses.imageries,
    bip: imageryGroup.responses.bip,
  };

  const loading =
    powerGroup.loading ||
    detailsGroup.loading ||
    awarenessGroup.loading ||
    imageryGroup.loading;

  return { responses, loading };
};
