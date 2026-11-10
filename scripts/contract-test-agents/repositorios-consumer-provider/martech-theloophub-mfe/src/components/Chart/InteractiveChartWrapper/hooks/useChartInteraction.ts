import { useCallback, useState } from 'react';

type HoverState = 'hovered' | 'dimmed' | 'neutral';

interface UseChartInteractionProps {
  onItemHover?: (index: number | null) => void;
  onItemSelect?: (index: number | null) => void;
  disableLegendDimming?: boolean;
}

export interface UseChartInteractionResult {
  hoveredIndex: number | null;
  selectedIndex: number | null;
  handleHover: (index: number | null) => void;
  handleClick: (index: number) => void;
  getItemHoverState: (index: number) => HoverState;
}

export const useChartInteraction = ({
  onItemHover,
  onItemSelect,
  disableLegendDimming = true,
}: UseChartInteractionProps): UseChartInteractionResult => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleHover = useCallback(
    (index: number | null) => {
      setHoveredIndex(index);
      onItemHover?.(index);
    },
    [onItemHover],
  );

  const handleClick = useCallback(
    (index: number) => {
      const newIndex = selectedIndex === index ? null : index;
      setSelectedIndex(newIndex);
      onItemSelect?.(newIndex);
    },
    [selectedIndex, onItemSelect],
  );

  const getItemHoverState = useCallback(
    (index: number): HoverState => {
      if (hoveredIndex === null && selectedIndex === null) return 'neutral';
      if (hoveredIndex === index || selectedIndex === index) return 'hovered';
      if (disableLegendDimming) return 'neutral';
      return 'dimmed';
    },
    [hoveredIndex, selectedIndex, disableLegendDimming],
  );

  return {
    hoveredIndex,
    selectedIndex,
    handleHover,
    handleClick,
    getItemHoverState,
  };
};
