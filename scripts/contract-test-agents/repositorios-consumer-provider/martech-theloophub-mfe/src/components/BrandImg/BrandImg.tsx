import { memo } from 'react';

import { Divider } from '@hexa-ui/components';

import { StyledActiveBrandImg, StyledDivider } from './BrandImg.styles';

type BrandImgProps = {
  src: string;
  alt?: string;
  divider?: boolean;
  width?: string;
  height?: string;
  dataTestId?: string;
};

const BrandImgComponent = ({
  src,
  alt = 'brand',
  divider = false,
  width = '48px',
  height = '48px',
  dataTestId,
}: BrandImgProps) => {
  if (!src) return null;

  return (
    <>
      {divider && (
        <StyledDivider
          data-testid={
            dataTestId ? `brand-img-divider-${dataTestId}` : undefined
          }
        >
          <Divider orientation="vertical"></Divider>
        </StyledDivider>
      )}
      <StyledActiveBrandImg
        data-testid={dataTestId ? `brand-img-active-${dataTestId}` : undefined}
        src={src}
        alt={alt}
        style={{ width, height }}
      />
    </>
  );
};

export const BrandImg = memo(BrandImgComponent);
