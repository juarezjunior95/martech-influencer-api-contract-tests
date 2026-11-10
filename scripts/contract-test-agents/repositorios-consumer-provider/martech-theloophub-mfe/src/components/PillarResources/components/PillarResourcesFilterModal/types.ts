export type OrderByOption = 'a-z' | 'z-a';

export interface PillarResourcesFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderBy: OrderByOption;
  onSetFilter: (newOrderBy: OrderByOption) => void;
}
