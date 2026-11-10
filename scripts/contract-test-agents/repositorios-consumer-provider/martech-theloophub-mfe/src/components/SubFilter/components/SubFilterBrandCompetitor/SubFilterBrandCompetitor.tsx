import { useMemo } from 'react';

import { FILTER_MODAL_NAME } from 'components/Filter';
import { useScopedModal } from 'contexts';
import { FilterDataAccessor } from 'domain/Filter';
import {
  useBrandImage,
  useCurrentPage,
  usePageFilterApplied,
  usePageFilterData,
} from 'hooks';
import { ALL_BRAND } from 'models/Filters';

import { SubFilterBrandCompetitorView } from '../SubFilterBrandCompetitorView/SubFilterBrandCompetitorView';

interface SubFilterBrandCompetitorProps {
  dataTestId?: string;
}

export const SubFilterBrandCompetitor = ({
  dataTestId,
}: SubFilterBrandCompetitorProps) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);
  const { dataFilters } = usePageFilterData(currentPage);
  const { open: openModal } = useScopedModal(FILTER_MODAL_NAME);

  const accessor = FilterDataAccessor.getInstance();

  const brandComp = useMemo(() => {
    if (!dataFilters || !applied) return undefined;
    return accessor.getBrandComp(dataFilters, applied);
  }, [dataFilters, applied, accessor]);

  const brandFamilyAbi = useMemo(() => {
    if (!dataFilters || !applied) return undefined;
    return accessor.getBrandFamilyAbi(dataFilters, applied);
  }, [dataFilters, applied, accessor]);

  const competitorIsActive =
    applied?.brands_comp && applied.brands_comp !== ALL_BRAND;
  const hasBrandAbi = applied?.brands_abi && applied?.brands_abi !== ALL_BRAND;

  const brandImageUrl =
    useBrandImage(
      hasBrandAbi ? applied?.brands_abi : undefined,
      'square',
      undefined,
      hasBrandAbi ? brandFamilyAbi?.group : undefined,
    ) ?? undefined;

  return (
    <SubFilterBrandCompetitorView
      competitorIsActive={competitorIsActive}
      hasBrandAbi={hasBrandAbi}
      brand={brandFamilyAbi?.group}
      brandImageUrl={brandImageUrl}
      brandCompetitor={brandComp}
      onOpenModal={openModal}
      selectButtonLabel="Select a Competitor"
      brandAbiFieldValue={applied?.brands_abi}
      dataTestId={dataTestId}
    />
  );
};
