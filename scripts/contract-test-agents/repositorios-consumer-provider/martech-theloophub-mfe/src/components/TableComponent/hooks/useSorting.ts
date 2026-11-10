import { SortChangeEvent, SortState } from '../types';

interface UseSortingProps {
  sortState?: SortState;
  onSortChange?: (event: SortChangeEvent) => void;
}

export const useSorting = ({ sortState, onSortChange }: UseSortingProps) => {
  const handleSortClick = (columnId: string) => {
    if (!onSortChange) return;

    const currentDirection =
      sortState?.columnId === columnId ? sortState.direction : undefined;

    let newDirection: 'asc' | 'desc' | 'none';
    if (!currentDirection) {
      newDirection = 'asc';
    } else if (currentDirection === 'asc') {
      newDirection = 'desc';
    } else {
      newDirection = 'none';
    }

    const event: SortChangeEvent = {
      columnId,
      direction: newDirection,
    };

    onSortChange(event);
  };

  const getSortDirection = (
    columnId: string,
  ): 'asc' | 'desc' | 'none' | undefined => {
    if (sortState?.columnId === columnId) {
      return sortState.direction;
    }
    return undefined;
  };

  return {
    handleSortClick,
    getSortDirection,
  };
};
