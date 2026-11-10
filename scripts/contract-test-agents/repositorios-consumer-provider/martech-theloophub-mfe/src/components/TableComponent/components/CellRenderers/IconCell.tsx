import React from 'react';

import { Icon } from '@hexa-ui/components2';
import { Placeholder } from '@hexa-ui/icons2';

import { CellRendererProps } from '../../types';
import { ICONS_MAP, isImagePath } from '../Icons';
import {
  StyledIconCell,
  StyledIconImage,
  StyledIconLabel,
  StyledIconWrapper,
} from './CellRenderers.styles';

export const IconCell: React.FC<CellRendererProps> = ({
  cell,
  column,
  dataTestId,
}) => {
  const {
    icon: iconValue,
    iconSize = 'large',
    iconPosition = 'left',
    value,
  } = cell;

  const hasLabel = value !== undefined && value !== '';

  const renderIcon = () => {
    if (!iconValue) return null;

    if (typeof iconValue === 'string') {
      const iconKey = iconValue as keyof typeof ICONS_MAP;
      if (iconKey in ICONS_MAP) {
        return (
          <Icon
            icon={ICONS_MAP[iconKey]}
            size={iconSize}
            data-testid={dataTestId ? `${dataTestId}-icon` : undefined}
          />
        );
      }

      if (isImagePath(iconValue)) {
        return (
          <StyledIconImage
            src={iconValue}
            alt=""
            iconSize={iconSize}
            data-testid={dataTestId ? `${dataTestId}-icon-img` : undefined}
          />
        );
      }

      return (
        <Icon
          icon={Placeholder}
          size={iconSize}
          data-testid={dataTestId ? `${dataTestId}-icon` : undefined}
        />
      );
    }

    if (React.isValidElement(iconValue)) {
      return iconValue;
    }

    return null;
  };

  const iconElement = (
    <StyledIconWrapper
      key="icon"
      iconSize={iconSize}
      data-testid={dataTestId ? `${dataTestId}-icon-wrapper` : undefined}
    >
      {renderIcon()}
    </StyledIconWrapper>
  );

  const labelElement = hasLabel ? (
    <StyledIconLabel
      key="label"
      data-testid={dataTestId ? `${dataTestId}-label` : undefined}
    >
      {value}
    </StyledIconLabel>
  ) : null;

  return (
    <StyledIconCell data-testid={dataTestId} align={column.align || 'center'}>
      {iconPosition === 'left' ? (
        <>
          {iconElement}
          {labelElement}
        </>
      ) : (
        <>
          {labelElement}
          {iconElement}
        </>
      )}
    </StyledIconCell>
  );
};
