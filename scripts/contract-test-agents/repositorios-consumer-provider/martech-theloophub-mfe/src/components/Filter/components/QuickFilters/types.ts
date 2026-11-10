import { FilterValue } from 'models/Filters';

export interface QuickFiltersItemsProps {
  visibleFields?: string[];
  onValueChange: (key: string, value: FilterValue) => void;
  handleReset: () => void;
  onOpenModal: () => void;
}

export interface QuickFilterItemProps {
  fieldKey: string;
  currentPage: string;
  debouncedOnValueChange: (key: string, value: FilterValue) => void;
  getCurrentValue: (key: string) => string;
  dataTestId?: string;
}
