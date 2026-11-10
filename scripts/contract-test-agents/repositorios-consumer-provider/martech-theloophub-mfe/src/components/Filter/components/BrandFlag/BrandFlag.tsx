import { BrandImg } from 'components/BrandImg';
import { useBrandImage, useCurrentPage, usePageFilterApplied } from 'hooks';

interface BrandFlagProps {
  dataTestId?: string;
}

export const BrandFlag = ({ dataTestId }: BrandFlagProps) => {
  const { currentPage } = useCurrentPage();
  const { applied } = usePageFilterApplied(currentPage);

  const brand = applied?.brands || applied?.sub_scope;
  const subBrand = applied?.sub_brands ?? applied?.brands_abi;
  const hasSubBrand = Boolean(
    subBrand != null && String(subBrand).trim() !== '',
  );
  const primary = hasSubBrand ? subBrand : brand;
  const fallback = hasSubBrand ? brand : undefined;

  const src = useBrandImage(primary, 'square', undefined, fallback) ?? '';

  return (
    <BrandImg
      dataTestId={dataTestId ? `brand-flag-${dataTestId}` : undefined}
      src={src}
      alt={String(subBrand || brand || 'brand')}
    />
  );
};
