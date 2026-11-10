import { Tooltip } from '@hexa-ui/components2';
import { BrandCellType } from 'components/Table/types';
import { getVariationColor } from 'utils';

import {
  StyleBrandTooltipContainer,
  StyledBrandsContainer,
  StyledBrandsImg,
  StyledBrandsItem,
  StyledBrandsVariation,
} from './BrandsRenderer.styles';

interface BrandsRendererProps {
  brands: BrandCellType[];
  dataTestId?: string;
}

interface BrandCountryImageProps {
  src: string;
  alt: string;
  dataTestId?: string;
}

interface BrandLogoImageProps {
  src: string;
  alt: string;
  dataTestId?: string;
}

const BrandLogoImage: React.FC<BrandLogoImageProps> = ({
  src,
  alt,
  dataTestId,
}) => {
  if (!src) return null;

  return <StyledBrandsImg src={src} alt={alt} data-testid={dataTestId} />;
};

const BrandCountryImage: React.FC<BrandCountryImageProps> = ({
  src,
  alt,
  dataTestId,
}) => {
  if (!src) return null;

  return (
    <StyledBrandsImg country src={src} alt={alt} data-testid={dataTestId} />
  );
};

export const BrandsRenderer = ({
  brands,
  dataTestId,
}: BrandsRendererProps): JSX.Element => {
  return (
    <StyledBrandsContainer
      data-testid={dataTestId ? `brands-${dataTestId}` : undefined}
    >
      {brands.map((brand, index) => {
        return (
          <StyledBrandsItem
            key={brand.src + index}
            data-testid={
              dataTestId ? `brand-item-${dataTestId}-${index}` : undefined
            }
          >
            <Tooltip
              content={
                <StyleBrandTooltipContainer>
                  {brand.name}
                </StyleBrandTooltipContainer>
              }
              position="top"
            >
              <BrandLogoImage
                alt={brand.name}
                src={brand.src}
                data-testid={
                  dataTestId ? `brand-img-${dataTestId}-${index}` : undefined
                }
              />
            </Tooltip>

            {brand.country && (
              <BrandCountryImage
                src={brand.country_src || ''}
                alt={brand.country ?? 'country'}
                dataTestId={
                  dataTestId
                    ? `brand-country-${dataTestId}-${index}`
                    : undefined
                }
              />
            )}
            <StyledBrandsVariation
              style={{ color: getVariationColor(brand.variationDirection) }}
              data-testid={
                dataTestId
                  ? `brand-variation-${dataTestId}-${index}`
                  : undefined
              }
            >
              {brand.variation}
              {brand.variationMeasure}
            </StyledBrandsVariation>
          </StyledBrandsItem>
        );
      })}
    </StyledBrandsContainer>
  );
};
