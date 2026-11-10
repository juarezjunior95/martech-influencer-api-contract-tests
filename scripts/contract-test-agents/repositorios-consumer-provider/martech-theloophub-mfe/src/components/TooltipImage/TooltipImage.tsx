import React from 'react';

import { Tooltip } from '@hexa-ui/components2';

import { StyledImage, StyledTooltipContainer } from './TooltipImage.styles';

interface Props {
  name?: string;
  src: string;
  width?: string;
  height?: string;
  dataTestId?: string;
}

export const TooltipImage: React.FC<Props> = ({
  name,
  src,
  width = '100%',
  height = '100%',
  dataTestId,
}) => {
  if (!name) {
    return (
      <StyledImage
        src={src}
        alt="image"
        style={{ width, height }}
        data-testid={dataTestId ? `tooltip-image-${dataTestId}` : undefined}
      />
    );
  }

  return (
    <Tooltip
      content={<StyledTooltipContainer>{name}</StyledTooltipContainer>}
      position="top"
    >
      <StyledImage
        src={src}
        alt={name}
        style={{ width, height }}
        data-testid={dataTestId ? `tooltip-image-${dataTestId}` : undefined}
      />
    </Tooltip>
  );
};
