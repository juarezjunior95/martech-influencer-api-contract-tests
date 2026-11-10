import { useMemo } from 'react';

import { FILTER_MODAL_NAME } from 'components/Filter';
import { useScopedModal } from 'contexts';
import { useCurrentPage, usePageFilterApplied, usePageFilterData } from 'hooks';
import { ALL_BRAND } from 'models/Filters';

import { SubFilterBrandCompetitorView } from '../SubFilterBrandCompetitorView/SubFilterBrandCompetitorView';

interface SubFilterBrandCompetitorAudienceTargetingProps {
  dataTestId?: string;
}

export const SubFilterBrandCompetitorAudienceTargeting = ({
  dataTestId,
}: SubFilterBrandCompetitorAudienceTargetingProps) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const { dataFilters } = usePageFilterData(currentPage);

  const { open } = useScopedModal(FILTER_MODAL_NAME);

  const brandFamilyAbi = useMemo(() => {
    return applied?.audience_targeting_brands;
  }, [applied?.audience_targeting_brands]);

  const competitorIsActive =
    applied?.audience_targeting_brands &&
    applied.audience_targeting_brands !== ALL_BRAND;
  const hasBrandAbi =
    applied?.audience_targeting_brands &&
    applied?.audience_targeting_brands !== ALL_BRAND;

  const audienceTargetingBrand = useMemo(() => {
    return dataFilters?.audience_targeting_brands?.values?.[
      applied?.country
    ]?.find((item) => item.value === applied?.audience_targeting_brands);
  }, [applied, dataFilters]);

  const brandCompetitor = audienceTargetingBrand?.competitor?.[0];

  return (
    <SubFilterBrandCompetitorView
      competitorIsActive={competitorIsActive}
      hasBrandAbi={hasBrandAbi}
      brand={brandFamilyAbi}
      brandImageUrl={audienceTargetingBrand?.image_url}
      brandCompetitor={brandCompetitor}
      onOpenModal={open}
      selectButtonLabel="Select a Competitor"
      brandAbiFieldValue={applied?.audience_targeting_brands}
      dataTestId={dataTestId}
    />
  );
};
