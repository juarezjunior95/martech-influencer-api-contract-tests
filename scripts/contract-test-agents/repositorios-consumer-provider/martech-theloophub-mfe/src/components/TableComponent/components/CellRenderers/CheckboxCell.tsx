import React, { useEffect, useRef } from 'react';

import { Icon } from '@hexa-ui/components2';
import { Check, Minus } from '@hexa-ui/icons2';

import { CellRendererProps } from '../../types';
import {
  StyledCheckboxCell,
  StyledCheckboxIcon,
  StyledCheckboxLabel,
  StyledCheckInput,
  StyledHiddenInput,
} from './CellRenderers.styles';

export const CheckboxCell: React.FC<CellRendererProps> = ({
  cell,
  column,
  onCheckboxChange,
  dataTestId,
}) => {
  const {
    checkboxState = 'unchecked',
    value,
    disabled: isDisabled = false,
  } = cell;

  const label = value as string | undefined;
  const inputRef = useRef<HTMLInputElement>(null);

  const isChecked = checkboxState === 'checked';
  const isIndeterminate = checkboxState === 'indeterminate';

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const getVisualState = (): 'none' | 'selected' | 'indeterminate' => {
    if (checkboxState === 'checked') return 'selected';
    if (checkboxState === 'indeterminate') return 'indeterminate';
    return 'none';
  };

  const visualState = getVisualState();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    onCheckboxChange?.(e.target.checked);
  };

  const handleVisualClick = () => {
    if (isDisabled) return;
    inputRef.current?.click();
  };

  return (
    <StyledCheckboxCell
      data-testid={dataTestId}
      align={column.align || 'center'}
    >
      <StyledHiddenInput
        ref={inputRef}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        aria-label={label || 'checkbox'}
        data-testid={dataTestId ? `${dataTestId}-input` : undefined}
      />
      <StyledCheckInput
        checked={visualState}
        isDisabled={isDisabled}
        onClick={handleVisualClick}
        data-testid={dataTestId ? `${dataTestId}-checkbox` : undefined}
        aria-hidden="true"
      >
        {visualState === 'selected' && (
          <StyledCheckboxIcon>
            <Icon icon={Check} size="small" />
          </StyledCheckboxIcon>
        )}
        {visualState === 'indeterminate' && (
          <StyledCheckboxIcon>
            <Icon icon={Minus} size="small" />
          </StyledCheckboxIcon>
        )}
      </StyledCheckInput>
      {label && (
        <StyledCheckboxLabel
          data-testid={dataTestId ? `${dataTestId}-label` : undefined}
        >
          {label}
        </StyledCheckboxLabel>
      )}
    </StyledCheckboxCell>
  );
};
