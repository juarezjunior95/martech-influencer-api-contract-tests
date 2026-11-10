import { FC } from 'react';

import {
  StyledGroupedImagesContainer,
  StyledImage,
} from 'components/GroupedImages/GroupedImages.styles';
import { GroupedImagesProps } from 'components/GroupedImages/types';

export const GroupedImages: FC<GroupedImagesProps> = ({
  images,
  size = 24,
  dataTestId,
}) => {
  return (
    <StyledGroupedImagesContainer
      data-testid={dataTestId ? `grouped-images-${dataTestId}` : undefined}
    >
      {images.map(({ src, alt }, index) => (
        <StyledImage
          key={`${src}-${index}`}
          src={src}
          alt={alt}
          style={{
            width: size,
            height: size,
            zIndex: images.length - index,
          }}
          data-testid={
            dataTestId ? `grouped-image-${src}-${dataTestId}` : undefined
          }
        />
      ))}
    </StyledGroupedImagesContainer>
  );
};
