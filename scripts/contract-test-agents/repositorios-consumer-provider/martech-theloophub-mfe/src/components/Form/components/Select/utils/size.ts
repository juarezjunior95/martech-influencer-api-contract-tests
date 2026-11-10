import { MaxMenuItems, SelectSize } from '../types';

const NINE_GAP = 5.5;
const FIVE_GAP = 7;

export const getSizeStyles = (
  size: SelectSize,
  maxMenuItems?: MaxMenuItems,
) => {
  const getHeight = () => {
    switch (size) {
      case 'small':
        return '32px';
      case 'medium':
        return '40px';
      case 'large':
        return '48px';
      default:
        return '48px';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return '14px';
      case 'medium':
        return '16px';
      case 'large':
        return '16px';
      default:
        return '16px';
    }
  };

  const getCheckSize = () => {
    return '14px';
  };

  const getMaxMenuItems = () => {
    if (!maxMenuItems) {
      return 5 * Number.parseInt(getHeight()) + (5 - 1) * FIVE_GAP;
    }

    switch (maxMenuItems) {
      case 5:
        return (
          maxMenuItems * Number.parseInt(getHeight()) +
          (maxMenuItems - 1) * FIVE_GAP
        );
      case 9:
        return (
          maxMenuItems * Number.parseInt(getHeight()) +
          (maxMenuItems - 1) * NINE_GAP
        );
    }
  };

  return { getHeight, getFontSize, getCheckSize, getMaxMenuItems };
};

const MENU_PX = 48;

export const getEstimatedMenuHeight = (
  size: SelectSize,
  maxMenuItems?: MaxMenuItems,
): number => {
  const { getMaxMenuItems } = getSizeStyles(size, maxMenuItems);
  const listHeight = getMaxMenuItems() ?? 0;
  return listHeight + MENU_PX;
};
