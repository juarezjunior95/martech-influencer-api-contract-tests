import React, { useEffect, useMemo, useRef } from 'react';
import { components, ValueContainerProps } from 'react-select';

import { Icon } from '@hexa-ui/components2';
import { Close } from '@hexa-ui/icons2';
import { Option } from 'models/Filters';

import {
  MultiValueRemove,
  StyledChips,
  StyledChipsPlaceholder,
} from '../../Select.styles';
import {
  type ChipPlaceholderOptionArg,
  type ChipPlaceholderValue,
  useChipPlaceholder,
} from './hooks/useChipPlaceholder';
import { buildRenderedChildren } from './utils/CustomValueContainer.utils';

interface CustomValueContainerProps extends ValueContainerProps {
  id: string;
  icon?: React.FunctionComponent;
  valueLabel?: string;
  chips?: boolean;
  maxChips?: number;
  allSelectedChip?: string;
  someValueSelected: boolean;
  onClearSingle?: () => void;
  showValueSelected?: boolean;
  getChipPlaceholder?: (options: ChipPlaceholderOptionArg) => React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

type ChipsLayoutProps = {
  id: string;
  chips?: boolean;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  dataTestId?: string;
  placeholder: React.ReactNode;
  onClearSingle?: () => void;
  children: React.ReactNode;
};

const ChipsLayout = ({
  id,
  chips,
  size,
  disabled,
  dataTestId,
  placeholder,
  onClearSingle,
  children,
}: ChipsLayoutProps) => (
  <StyledChips
    className={`${id}-select__chips`}
    style={{
      display: chips ? 'flex' : 'none',
    }}
    size={size}
    disabled={disabled}
    data-testid={dataTestId ? `${dataTestId}-chips` : undefined}
  >
    {placeholder ? (
      <StyledChipsPlaceholder size={size}>{placeholder}</StyledChipsPlaceholder>
    ) : null}
    {children}
    {onClearSingle ? (
      <MultiValueRemove
        onClick={(e) => {
          e.stopPropagation();
          onClearSingle();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ cursor: 'pointer' }}
        data-testid={dataTestId ? `${dataTestId}-clear-single` : undefined}
      >
        <Icon icon={Close} size="small" color="#141414" />
      </MultiValueRemove>
    ) : null}
  </StyledChips>
);

type DefaultValueLayoutProps = {
  id: string;
  showValueSelected?: boolean;
  dataTestId?: string;
  size?: 'small' | 'medium' | 'large';
  placeholder: React.ReactNode;
  children: React.ReactNode;
};

const DefaultValueLayout = ({
  id,
  showValueSelected,
  dataTestId,
  size,
  placeholder,
  children,
}: DefaultValueLayoutProps) => (
  <div
    className={`${id}-select__value-container`}
    style={{
      display: 'flex',
      opacity: showValueSelected ? 1 : 0,
      height: showValueSelected ? 'auto' : '100%',
      width: showValueSelected ? 'auto' : '100%',
      position: showValueSelected ? 'inherit' : 'absolute',
      top: showValueSelected ? 'auto' : 0,
    }}
    data-testid={dataTestId ? `${dataTestId}-values` : undefined}
  >
    {placeholder ? (
      <StyledChipsPlaceholder size={size}>{placeholder}</StyledChipsPlaceholder>
    ) : null}
    {children}
  </div>
);

export const CustomValueContainer = (props: CustomValueContainerProps) => {
  const {
    children,
    isMulti,
    getClassNames,
    getValue,
    id,
    icon,
    valueLabel,
    chips,
    maxChips,
    allSelectedChip,
    someValueSelected,
    onClearSingle,
    showValueSelected,
    getChipPlaceholder,
    size,
    selectProps,
    disabled,
    ...rest
  } = props;

  const previousChildrenRef = useRef(children);
  const currentValueRef = useRef<ChipPlaceholderValue>(null);

  const { dataTestId } = selectProps as { dataTestId?: string };

  const isSearching =
    selectProps?.inputValue && selectProps.inputValue.length > 0;

  useEffect(() => {
    if (!isSearching) {
      previousChildrenRef.current = children;
    }
  }, [children, isSearching]);

  const displayChildren = isSearching ? previousChildrenRef.current : children;

  const currentValue = getValue();

  const valueKey = useMemo(() => {
    if (!currentValue) return null;
    const value = Array.isArray(currentValue) ? currentValue[0] : currentValue;
    return value?.value ? String(value.value) : null;
  }, [currentValue]);

  currentValueRef.current = currentValue as ChipPlaceholderValue;

  const placeholder = useChipPlaceholder(
    getChipPlaceholder,
    valueKey,
    currentValueRef,
  );

  const values = getValue() as Option[] | undefined;
  const totalValues = values?.length ?? 0;
  const renderedChildren = buildRenderedChildren(
    displayChildren,
    Boolean(isMulti),
    Boolean(chips),
    totalValues,
    dataTestId,
    maxChips,
    allSelectedChip,
  );

  const showSingleChips = !isMulti && chips && someValueSelected;

  return (
    <components.ValueContainer
      {...rest}
      isMulti={isMulti}
      getClassNames={getClassNames}
      getValue={getValue}
      selectProps={selectProps}
      data-testid={dataTestId ? `${dataTestId}-value-container` : undefined}
    >
      {icon ? <Icon icon={icon} /> : null}
      {valueLabel ?? null}

      {showSingleChips ? (
        <ChipsLayout
          id={id}
          chips={chips}
          size={size}
          disabled={disabled}
          dataTestId={dataTestId}
          placeholder={placeholder}
          onClearSingle={onClearSingle}
        >
          {renderedChildren}
        </ChipsLayout>
      ) : (
        <DefaultValueLayout
          id={id}
          showValueSelected={showValueSelected}
          dataTestId={dataTestId}
          size={size}
          placeholder={placeholder}
        >
          {renderedChildren}
        </DefaultValueLayout>
      )}
    </components.ValueContainer>
  );
};
