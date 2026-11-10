import { Option } from 'models/Filters';

import {
  MaxMenuItems,
  SelectAppearance,
  SelectShape,
  SelectSize,
} from '../types';
import { SelectOptions } from './select';

export interface SelectCoreProps {
  id: string;
  options: SelectOptions;
}

export interface SelectValueProps {
  name?: string;
  value?: string | string[] | Option | Option[] | number;
  defaultValue?: string | string[] | Option | Option[];
  onValueChange?: (value: string | string[] | Option | Option[]) => void;
}

export interface SelectLabelProps {
  label?: string;
  valueLabel?: string;
  placeholder?: string;
  showValueSelected?: boolean;
  optional?: boolean;
}

export interface SelectStateProps {
  disabled?: boolean;
  loading?: boolean;
  error?: string | null;
}

export interface SelectStyleProps {
  size?: SelectSize;
  shape?: SelectShape;
  appearance?: SelectAppearance;
  icon?: React.FunctionComponent;
  fitContent?: boolean;
  menuFitContent?: boolean;
}

export interface SelectChipsProps {
  chips?: boolean;
  clearChips?: boolean;
  maxChips?: number;
  onClearSingle?: () => void;
  getChipPlaceholder?: (options: Option[] | Option) => React.ReactNode;
}

export interface SelectMultipleProps {
  multiple?: boolean;
  showSelectAll?: boolean;
  selectAllLabel?: string;
  allSelectedChip?: string;
}

export interface SelectBehaviorProps {
  clearable?: boolean;
  searchable?: boolean;
  maxMenuItems?: MaxMenuItems;
}

/**
 * Complete Select component props
 */
export interface SelectProps
  extends
    SelectCoreProps,
    SelectValueProps,
    SelectLabelProps,
    SelectStateProps,
    SelectStyleProps,
    SelectChipsProps,
    SelectMultipleProps,
    SelectBehaviorProps {
  dataTestId?: string;
}
