import { StylesConfig } from 'react-select';

import { Option } from 'models/Filters';

import { MENU_FIT_CONTENT_MAX_WIDTH } from '../constants';
import {
  MaxMenuItems,
  SelectAppearance,
  SelectShape,
  SelectSize,
} from '../types';
import { getSizeStyles } from './size';

interface CreateCustomStylesProps {
  size: SelectSize;
  shape: SelectShape;
  disabled: boolean;
  hasError: boolean;
  chips?: boolean;
  appearance?: SelectAppearance;
  allSelected?: boolean;
  placeholder?: string;
  clearChips?: boolean;
  maxMenuItems?: MaxMenuItems;
  searchable?: boolean;
  isGrouped?: boolean;
  fitContent?: boolean;
  controlWidth?: number;
  menuFitContent?: boolean;
}

const borderColor = (state, hasError) => {
  if (hasError) {
    return '#e82727';
  }
  if (state.isFocused && state.menuIsOpen) {
    return '#141414';
  }
  return '#1414141f';
};

const optionbackgrounColor = (state, allSelected) => {
  if (state.isDisabled) {
    return '#f2f2f2';
  }
  if (state.isSelected || allSelected) {
    return '#fff1c2';
  }
  return '#ffffff';
};

const optionHoverColor = (state, allSelected) => {
  if (state.isDisabled) {
    return 'white';
  }
  if (state.isSelected) {
    return '#fff1c2';
  }
  return '#fff8e0';
};

export const createCustomStyles = ({
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
}: CreateCustomStylesProps): StylesConfig<Option, boolean> => {
  const { getHeight, getFontSize, getMaxMenuItems } = getSizeStyles(
    size,
    maxMenuItems,
  );

  const background = appearance === 'plain' ? 'transparent' : '#ffffff';
  const color = appearance === 'plain' ? '#1414148f' : '#141414';
  const minHeight = appearance === 'plain' ? 'auto' : getHeight();
  const border = appearance === 'plain' ? 'none' : '1px solid';

  const styles: StylesConfig<Option, boolean> = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    control: (provided, state) => ({
      ...provided,
      minHeight: minHeight,
      backgroundColor: disabled ? '#14141414' : background,
      border: `${border} ${borderColor(state, hasError)}`,
      borderRadius: shape === 'pill' ? '24px' : '8px',
      boxShadow: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      padding: '0 8px',
      paddingRight: '12px',
      fontSize: getFontSize(),
      fontFamily: 'Work Sans',
      fontWeight: 500,
      color: disabled ? '#14141452' : color,
      width: fitContent ? 'fit-content' : '100%',
      '&:hover': {
        borderColor: hasError ? '#e82727' : '#141414',
      },
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      fontFamily: 'Work Sans',
      fontSize: getFontSize(),
    }),
    valueContainer: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '0 8px',
      color: '#6b7280',
    }),
    placeholder: (provided, state) => ({
      ...provided,
      display: state.isMulti || !placeholder ? 'none' : 'block',
      fontWeight: 400,
      color: '#9ca3af',
      fontSize: '14px',
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: getFontSize(),
      color: disabled ? '#14141452' : '#141414',
    }),
    multiValue: (provided) => ({
      ...provided,
      display: chips ? 'flex' : 'none',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: disabled ? '#ffffff' : '#fff1c2',
      borderRadius: '512px',
      padding: clearChips ? '4px 4px 4px 8px' : '4px 8px',
      color: disabled ? '#1414145c' : '#141414',
      margin: '2px 4px',
      border: disabled ? '1px solid #14141429' : 'none',

      '&:hover': {
        backgroundColor: '##fff8e0',
      },
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      fontSize: getFontSize(),
      color: disabled ? '#1414145c' : '#141414',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      display: clearChips ? 'flex' : 'none',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    }),
    menu: (provided) => {
      const baseMenu = {
        ...provided,
        backgroundColor: 'white',
        borderRadius: '6px',
        boxShadow:
          '0 2px 10px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
      };

      if (menuFitContent) {
        return {
          ...baseMenu,
          width: 'max-content',
          minWidth: controlWidth ? `${controlWidth}px` : '100%',
          maxWidth: `${MENU_FIT_CONTENT_MAX_WIDTH}px`,
        };
      }

      return {
        ...baseMenu,
        width: controlWidth ? `${controlWidth}px` : '100%',
        minWidth: controlWidth ? `${controlWidth}px` : '100%',
        maxWidth: controlWidth ? `${controlWidth}px` : '400px',
      };
    },
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 1000,
    }),
    menuList: (provided) => ({
      ...provided,
      display: 'flex',
      flexDirection: 'column',
      padding: '4px',
      paddingTop: searchable ? '8px' : '16px',
      maxHeight: `${getMaxMenuItems()}px`,
      // Custom scrollbar styles
      '&::-webkit-scrollbar': {
        width: '4px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#DBDADA',
        borderRadius: '10px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#c4c4c4',
      },
      scrollbarWidth: 'thin',
      scrollbarColor: '#DBDADA transparent',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: optionbackgrounColor(state, allSelected),
      minHeight: getHeight(),
      height: getHeight(),
      color: state.isDisabled ? '#1414145c' : '#141414',
      fontSize: getFontSize(),
      fontFamily: 'Work Sans',
      cursor: state.isDisabled ? 'not-allowed' : 'pointer',
      borderRadius: '8px',
      marginBottom: '4px',
      paddingLeft: isGrouped ? '24px' : '12px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: menuFitContent ? 'nowrap' : 'normal',

      '&:hover': {
        backgroundColor: state.isDisabled
          ? optionbackgrounColor(state, allSelected)
          : optionHoverColor(state, allSelected),
      },
    }),
    loadingIndicator: (provided) => ({
      ...provided,
      color: '#6b7280',
    }),
    groupHeading: (provided) => ({
      ...provided,
      padding: '10px',
      fontWeight: 'bold',
      fontSize: getFontSize(),
      fontFamily: 'Work Sans',
      color: '#6b7280',
      textTransform: 'none',
      backgroundColor: '#ffffff',
    }),
    group: (provided) => ({
      ...provided,
      padding: '0',
    }),
  };

  return styles;
};
