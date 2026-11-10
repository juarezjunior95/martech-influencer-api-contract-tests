import React, { useState } from 'react';

import DOMPurify from 'dompurify';

import { CellRendererProps } from '../../types';
import { StyledCellImage, StyledImageCell } from './CellRenderers.styles';

const FALLBACK_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"%3E%3Crect width="40" height="40" fill="%23e0e0e0"/%3E%3C/svg%3E';

export const ImageCell: React.FC<CellRendererProps> = ({
  cell,
  column,
  dataTestId,
}) => {
  const [imgError, setImgError] = useState(false);

  const {
    img: imgSrc = '',
    imgName,
    imgShape = 'circle',
    imagePosition = 'left',
  } = cell;

  const value = cell.value ?? '';
  const altText = DOMPurify.sanitize(imgName ?? String(value));

  const imageSize = imagePosition === 'top' ? 'medium' : 'small';

  const renderImage = () => (
    <StyledCellImage
      src={imgError ? FALLBACK_IMAGE : imgSrc}
      alt={altText}
      shape={imgShape}
      size={imageSize}
      loading="lazy"
      onError={() => setImgError(true)}
      data-testid={dataTestId ? `${dataTestId}-image` : undefined}
    />
  );

  const renderImageContent = () => {
    if (imgSrc) {
      return renderImage();
    }
    return null;
  };

  return (
    <StyledImageCell
      data-testid={dataTestId}
      align={column.align || 'center'}
      imagePosition={imagePosition}
    >
      {renderImageContent()}
      <span
        data-testid={dataTestId ? `${dataTestId}-text` : undefined}
        data-cell-text
      >
        {value}
      </span>
    </StyledImageCell>
  );
};
