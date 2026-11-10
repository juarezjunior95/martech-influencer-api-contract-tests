// Docs: https://react-select.com/home

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactSelect, {
  MenuListProps,
  MultiValue,
  MultiValueGenericProps,
  OptionProps,
  SingleValue,
  ValueContainerProps,
} from 'react-select';

import { Icon } from '@hexa-ui/components2';
import { AlertOctagon } from '@hexa-ui/icons2';
import { Option } from 'models/Filters';
import {
  StyledErrorLabel,
  StyledLabel,
  StyledOptionalFlag,
} from 'shared/Styles';

import {
  CustomClearIndicator,
  CustomDropdownIndicator,
  CustomGroupHeading,
  CustomMenuList,
  CustomMultiValueContainer,
  CustomMultiValueRemove,
  CustomOption,
  CustomValueContainer,
} from './components';
import { MENU_BEHAVIOR, SELECT_DEFAULTS } from './constants';
import { useSelectMenu } from './hooks';
import * as StyledReactSelect from './Select.styles';
import { SelectProps } from './types';
import {
  convertToOption,
  createCustomStyles,
  filterSelectOption,
  getEstimatedMenuHeight,
  handleSelectChange,
  isSearchInputFocused,
  processOptions,
} from './utils';

export const Select: React.FC<SelectProps> = ({
  // Core props
  id,
  options,
  dataTestId,

  // Value management
  name,
  value,
  defaultValue,
  onValueChange,
  onClearSingle,

  // Labels and display
  placeholder = SELECT_DEFAULTS.PLACEHOLDER,
  label,
  valueLabel,
  showValueSelected = SELECT_DEFAULTS.SHOW_VALUE_SELECTED,
  optional = SELECT_DEFAULTS.OPTIONAL,

  // State and validation
  disabled = SELECT_DEFAULTS.DISABLED,
  loading = SELECT_DEFAULTS.LOADING,
  error,

  // Visual styling
  size = SELECT_DEFAULTS.SIZE,
  shape = SELECT_DEFAULTS.SHAPE,
  appearance = SELECT_DEFAULTS.APPEARANCE,
  icon,
  fitContent = SELECT_DEFAULTS.FIT_CONTENT,
  menuFitContent = SELECT_DEFAULTS.MENU_FIT_CONTENT,

  // Chips props
  chips,
  clearChips = SELECT_DEFAULTS.CLEAR_CHIPS,
  maxChips,
  getChipPlaceholder,

  // Multiple selection
  multiple = false,
  showSelectAll = SELECT_DEFAULTS.SHOW_SELECT_ALL,
  selectAllLabel = SELECT_DEFAULTS.SELECT_ALL_LABEL,
  allSelectedChip,

  // Behavior
  clearable = SELECT_DEFAULTS.CLEARABLE,
  searchable = SELECT_DEFAULTS.SEARCHABLE,
  maxMenuItems = SELECT_DEFAULTS.MAX_MENU_ITEMS,
}) => {
  const hasError = !!error;
  const [menuPlacement, setMenuPlacement] = useState<'top' | 'bottom'>(
    'bottom',
  );
  const [controlWidth, setControlWidth] = useState<number | undefined>();

  const { isGrouped, flatOptions, optionsWithSelectAll, groupedOptions } =
    processOptions(options, multiple, showSelectAll, selectAllLabel);

  const {
    menuIsOpen,
    setMenuIsOpen,
    selectRef,
    isMouseOverSearchRef,
    menuListScrollRef,
    allSelected,
    someValueSelected,
  } = useSelectMenu({ id, value, flatOptions });
  useEffect(() => {
    setMenuIsOpen(false);
  }, [options]);

  const customStyles = useMemo(
    () =>
      createCustomStyles({
        size,
        shape,
        disabled,
        hasError,
        chips,
        appearance,
        allSelected,
        placeholder,
        clearChips,
        maxMenuItems,
        searchable,
        isGrouped,
        fitContent,
        controlWidth,
        menuFitContent,
      }),
    [
      size,
      shape,
      disabled,
      hasError,
      chips,
      appearance,
      allSelected,
      placeholder,
      clearChips,
      maxMenuItems,
      searchable,
      isGrouped,
      fitContent,
      controlWidth,
      menuFitContent,
    ],
  );

  const handleChange = (newValue: SingleValue<Option> | MultiValue<Option>) => {
    handleSelectChange({
      newValue,
      multiple,
      value,
      flatOptions,
      onValueChange,
    });
  };

  const handleClearSingle = useCallback(() => {
    if (onClearSingle) {
      onClearSingle();
    }
    if (onValueChange) {
      onValueChange('');
    }
  }, [onClearSingle, onValueChange]);

  const handleMenuClose = () => {
    const isSearchFocused = isSearchInputFocused();
    const isMouseOverSearch = isMouseOverSearchRef.current;

    if (searchable && (isSearchFocused || isMouseOverSearch)) {
      return;
    }

    setMenuIsOpen(false);
  };

  const handleMenuOpen = useCallback(() => {
    const control = selectRef.current;
    if (!control) {
      setMenuIsOpen(true);
      return;
    }
    const rect = control.getBoundingClientRect();
    const estimatedMenuHeight = getEstimatedMenuHeight(size, maxMenuItems);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setControlWidth(rect.width);
    setMenuPlacement(
      spaceBelow >= estimatedMenuHeight || spaceBelow >= spaceAbove
        ? 'bottom'
        : 'top',
    );
    setMenuIsOpen(true);
  }, [size, maxMenuItems, selectRef, setMenuIsOpen]);

  const ValueContainerWrapper = useCallback(
    (props: ValueContainerProps) => (
      <CustomValueContainer
        {...props}
        id={id}
        icon={icon}
        valueLabel={valueLabel}
        chips={chips}
        maxChips={maxChips}
        allSelectedChip={allSelected ? allSelectedChip : undefined}
        someValueSelected={someValueSelected}
        onClearSingle={clearChips ? handleClearSingle : undefined}
        showValueSelected={showValueSelected}
        getChipPlaceholder={getChipPlaceholder}
        size={size}
        disabled={disabled}
      />
    ),
    [
      id,
      icon,
      valueLabel,
      chips,
      maxChips,
      allSelected,
      allSelectedChip,
      someValueSelected,
      clearChips,
      handleClearSingle,
      showValueSelected,
      getChipPlaceholder,
      size,
      disabled,
    ],
  );

  const OptionWrapper = useCallback(
    (props: OptionProps) => (
      <CustomOption
        {...props}
        multiple={multiple}
        size={size}
        allSelected={allSelected}
        error={hasError}
      />
    ),
    [multiple, size, allSelected, hasError],
  );

  const MenuListWrapper = useCallback(
    (props: MenuListProps) => (
      <CustomMenuList
        {...props}
        searchable={searchable}
        isMouseOverSearchRef={isMouseOverSearchRef}
        menuListScrollRef={menuListScrollRef}
      />
    ),
    [searchable, isMouseOverSearchRef, menuListScrollRef],
  );

  const MultiValueContainerWrapper = useCallback(
    (props: MultiValueGenericProps) => (
      <CustomMultiValueContainer
        {...props}
        getChipPlaceholder={getChipPlaceholder}
      />
    ),
    [getChipPlaceholder],
  );

  const customComponents = useMemo(
    () => ({
      DropdownIndicator: CustomDropdownIndicator,
      MultiValueRemove: CustomMultiValueRemove,
      ValueContainer: ValueContainerWrapper,
      Option: OptionWrapper,
      MenuList: MenuListWrapper,
      GroupHeading: CustomGroupHeading,
      ClearIndicator: CustomClearIndicator,
      MultiValueContainer: MultiValueContainerWrapper,
    }),
    [
      ValueContainerWrapper,
      OptionWrapper,
      MenuListWrapper,
      MultiValueContainerWrapper,
    ],
  );

  return (
    <StyledReactSelect.Container ref={selectRef} data-testid={dataTestId}>
      {label && (
        <StyledLabel
          error={hasError}
          style={{ marginLeft: '1px' }}
          data-testid={dataTestId ? `${dataTestId}-label` : undefined}
        >
          {label}{' '}
          {optional && <StyledOptionalFlag>(optional)</StyledOptionalFlag>}
        </StyledLabel>
      )}

      <ReactSelect
        id={id}
        name={name}
        isMulti={multiple}
        options={isGrouped ? groupedOptions : optionsWithSelectAll}
        value={convertToOption(value, optionsWithSelectAll)}
        defaultValue={convertToOption(defaultValue, optionsWithSelectAll)}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={disabled}
        isLoading={loading}
        styles={customStyles}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement={menuPlacement}
        controlShouldRenderValue={true}
        components={customComponents}
        classNamePrefix={`${id}-select`}
        menuIsOpen={menuIsOpen}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        closeMenuOnSelect={!multiple}
        blurInputOnSelect={!multiple}
        closeMenuOnScroll={MENU_BEHAVIOR.CLOSE_ON_SCROLL}
        openMenuOnFocus={MENU_BEHAVIOR.OPEN_ON_FOCUS}
        openMenuOnClick={MENU_BEHAVIOR.OPEN_ON_CLICK}
        tabSelectsValue={MENU_BEHAVIOR.TAB_SELECTS_VALUE}
        hideSelectedOptions={MENU_BEHAVIOR.HIDE_SELECTED_OPTIONS}
        isClearable={clearable}
        isSearchable={false}
        filterOption={searchable ? filterSelectOption : undefined}
        {...({ dataTestId } as Record<string, unknown>)}
      />

      {error && (
        <StyledErrorLabel
          style={{ marginLeft: '1px' }}
          data-testid={dataTestId ? `${dataTestId}-error` : undefined}
        >
          <Icon icon={AlertOctagon} />
          {error}
        </StyledErrorLabel>
      )}
    </StyledReactSelect.Container>
  );
};
