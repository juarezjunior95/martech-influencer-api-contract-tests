/**
 * Constants for Select component
 */

export const SELECT_DEFAULTS = {
  FIT_CONTENT: false,
  MENU_FIT_CONTENT: false,
  PLACEHOLDER: 'Select an option',
  SIZE: 'large' as const,
  SHAPE: 'square' as const,
  APPEARANCE: 'default' as const,
  SELECT_ALL_LABEL: 'Select All',
  MAX_MENU_ITEMS: 5 as const,
  CLEAR_CHIPS: true,
  SHOW_VALUE_SELECTED: true,
  SHOW_SELECT_ALL: true,
  OPTIONAL: false,
  DISABLED: false,
  LOADING: false,
  CLEARABLE: false,
  SEARCHABLE: false,
};

export const MENU_FIT_CONTENT_MAX_WIDTH = 480;

export const MENU_BEHAVIOR = {
  CLOSE_ON_SCROLL: true,
  OPEN_ON_FOCUS: false,
  OPEN_ON_CLICK: true,
  TAB_SELECTS_VALUE: false,
  HIDE_SELECTED_OPTIONS: false,
};
