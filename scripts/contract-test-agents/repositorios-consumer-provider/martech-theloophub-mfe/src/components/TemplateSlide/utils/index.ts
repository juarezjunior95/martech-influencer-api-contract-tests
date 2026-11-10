import { BorderPosition } from '../TemplateSlide';

export const getBorderPositionObj = (borderPosition: BorderPosition[]) => {
  return {
    borderLeft: borderPosition.includes('left'),
    borderRight: borderPosition.includes('right'),
    borderTop: borderPosition.includes('top'),
    borderBottom: borderPosition.includes('bottom'),
  };
};
