import styled from '@emotion/styled';

import { TABLE_COLORS } from './colors';
import { TABLE_BORDER_RADIUS, TABLE_SPACING } from './spacing';
import { TABLE_TYPOGRAPHY } from './typography';

const ROW_GROUP_LABEL_WIDTH = TABLE_SPACING.rowGroupLabel.width;
const ROW_GROUP_LABEL_BORDER_WIDTH = TABLE_SPACING.rowGroupLabel.borderWidth;

export const FlexTable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${TABLE_SPACING.gap.large};
  background-color: ${TABLE_COLORS.background.transparent};
`;

interface FlexTableHeaderProps {
  headerGap?: boolean;
  headerColumnGap?: boolean;
}

export const FlexTableHeader = styled.div<FlexTableHeaderProps>`
  display: flex;
  flex-direction: row;
  margin: 0 1px;

  ${({ headerGap, headerColumnGap }) => {
    if (headerColumnGap) {
      return `
        background-color: ${TABLE_COLORS.background.transparent};
        border: none;
        border-radius: 0;
        overflow: visible;
      `;
    }

    if (headerGap) {
      return `
        background-color: ${TABLE_COLORS.background.primary};
        border: 1px solid ${TABLE_COLORS.border.primary};
        border-radius: ${TABLE_BORDER_RADIUS.header.default};
        overflow: hidden;
      `;
    }

    return `
      background-color: ${TABLE_COLORS.background.transparent};
      border: none;
      border-radius: 0;
      overflow: visible;
    `;
  }}
`;

interface FlexHeaderCellWrapperProps {
  isAxisColumn?: boolean;
  axisWidth?: string;
  showGroupBorder?: boolean;
  isLast?: boolean;
  hasColumnGap?: boolean;
}

export const FlexHeaderCellWrapper = styled.div<FlexHeaderCellWrapperProps>`
  flex: ${({ isAxisColumn, axisWidth }) => {
    if (isAxisColumn) {
      return axisWidth ? `0 0 ${axisWidth}` : TABLE_SPACING.axis.flex;
    }
    return 1;
  }};
  display: flex;
  width: ${({ isAxisColumn, axisWidth }) =>
    isAxisColumn ? axisWidth || TABLE_SPACING.axis.width : 'auto'};
  min-width: ${({ isAxisColumn, axisWidth }) =>
    isAxisColumn ? axisWidth || TABLE_SPACING.axis.width : '0'};
  max-width: ${({ isAxisColumn, axisWidth }) =>
    isAxisColumn ? axisWidth || TABLE_SPACING.axis.width : 'none'};
  box-sizing: border-box;
  overflow: hidden;
  padding: ${({ hasColumnGap, isAxisColumn }) =>
    hasColumnGap && !isAxisColumn ? TABLE_SPACING.header.paddingLarge : '0'};

  ${({ showGroupBorder, isLast, hasColumnGap }) =>
    showGroupBorder &&
    !isLast &&
    !hasColumnGap &&
    `
    border-right: 1px solid ${TABLE_COLORS.border.primary};
  `}
`;

export const FlexTableBody = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${TABLE_COLORS.background.transparent};
  gap: 16px;
`;

interface FlexRowGroupProps {
  hasPagination?: boolean;
  isLastGroup?: boolean;
}

export const FlexRowGroup = styled.div<FlexRowGroupProps>`
  display: flex;
  flex-direction: column;
  background-color: ${TABLE_COLORS.background.primary};
  border: 1px solid ${TABLE_COLORS.border.primary};
  border-radius: ${({ hasPagination, isLastGroup }) => {
    if (hasPagination || !isLastGroup) return '4px';
    return '4px 4px 12px 12px';
  }};
  overflow: hidden;
`;

export const FlexRowGroupWithLabel = styled.div<FlexRowGroupProps>`
  display: flex;
  flex-direction: row;
  background-color: ${TABLE_COLORS.background.primary};
  border: 1px solid ${TABLE_COLORS.border.primary};
  border-radius: ${({ hasPagination, isLastGroup }) => {
    if (hasPagination || !isLastGroup) return '4px';
    return '4px 4px 12px 12px';
  }};
  overflow: hidden;
`;

export const FlexRowGroupLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${ROW_GROUP_LABEL_WIDTH}px;
  max-width: ${ROW_GROUP_LABEL_WIDTH}px;
  background-color: ${TABLE_COLORS.background.primary};
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.heading};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.medium};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.md};
  color: ${TABLE_COLORS.text.primary};
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
`;

export const FlexRowGroupWithHorizontalLabel = styled.div<FlexRowGroupProps>`
  display: flex;
  flex-direction: row;
  background-color: ${TABLE_COLORS.background.primary};
  border: 1px solid ${TABLE_COLORS.border.primary};
  border-radius: ${({ hasPagination, isLastGroup }) => {
    if (hasPagination || !isLastGroup) return '4px';
    return '4px 4px 12px 12px';
  }};
  overflow: hidden;
`;

export const FlexRowGroupHorizontalLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${ROW_GROUP_LABEL_WIDTH}px;
  max-width: ${ROW_GROUP_LABEL_WIDTH}px;
  background-color: ${TABLE_COLORS.background.primary};
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.heading};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.medium};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.md};
  color: ${TABLE_COLORS.text.primary};
`;

export const FlexHeaderLabelSpacer = styled.div`
  min-width: ${ROW_GROUP_LABEL_WIDTH + ROW_GROUP_LABEL_BORDER_WIDTH}px;
  max-width: ${ROW_GROUP_LABEL_WIDTH + ROW_GROUP_LABEL_BORDER_WIDTH}px;
`;

export const FlexRowGroupContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${TABLE_COLORS.background.primary};
  border-left: 1px solid ${TABLE_COLORS.border.primary};
`;

interface HighlightStyleProps {
  backgroundColor?: string;
  borderLeft?: string;
}

interface FlexRowProps {
  isZebra?: boolean;
  rowHover?: boolean;
  rowBorder?: boolean;
  hasColumnGap?: boolean;
  isLastInGroup?: boolean;
  isHighlighted?: boolean;
  highlightStyle?: HighlightStyleProps;
}

export const FlexTableRow = styled.div<FlexRowProps>`
  display: flex;
  flex-direction: row;
  position: relative;
  min-height: ${TABLE_SPACING.row.minHeight};
  background-color: ${({ isZebra, isHighlighted, highlightStyle }) => {
    if (isHighlighted) {
      return (
        highlightStyle?.backgroundColor || TABLE_COLORS.background.highlight
      );
    }
    return isZebra
      ? TABLE_COLORS.background.zebra
      : TABLE_COLORS.background.primary;
  }};
  border-left: ${({ isHighlighted, highlightStyle }) => {
    if (isHighlighted && highlightStyle?.borderLeft) {
      return highlightStyle.borderLeft;
    }
    return 'none';
  }};
  transition: background-color 0.15s ease;
  border-bottom: ${({ isLastInGroup, rowBorder }) => {
    if (!rowBorder) return 'none';
    return isLastInGroup ? 'none' : `1px solid ${TABLE_COLORS.border.light}`;
  }};

  ${({ rowHover }) =>
    rowHover &&
    `
    &:hover {
      background-color: ${TABLE_COLORS.background.hover};
      box-shadow: 
        inset 0 1px 0 0 ${TABLE_COLORS.gradient.hoverStart},
        inset 0 -1px 0 0 ${TABLE_COLORS.gradient.hoverEnd};
    }
  `}
`;

interface FlexHeaderCellProps {
  isAxisColumn?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  hasColumnGap?: boolean;
  headerGap?: boolean;
}

export const FlexHeaderCell = styled.div<FlexHeaderCellProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  height: ${TABLE_SPACING.header.height};
  background-color: ${TABLE_COLORS.background.primary};
  box-sizing: border-box;

  ${({ headerGap, isLast, hasColumnGap, isFirst }) => {
    if (hasColumnGap) {
      return `
        border: 1px solid ${TABLE_COLORS.border.primary};
        border-radius: ${TABLE_BORDER_RADIUS.header.default};
      `;
    }

    if (headerGap) {
      return `
        border: none;
        border-right: ${isLast ? 'none' : `1px solid ${TABLE_COLORS.border.primary}`};
        border-radius: 0;
      `;
    }

    return `
      border: 1px solid ${TABLE_COLORS.border.primary};
      border-right: ${isLast ? `1px solid ${TABLE_COLORS.border.primary}` : 'none'};
      border-radius: ${isFirst ? TABLE_BORDER_RADIUS.header.first : isLast ? TABLE_BORDER_RADIUS.header.last : '0'};
    `;
  }}
`;

interface FlexHeaderTitleProps {
  hasSubColumns?: boolean;
  bgColor?: string;
}

export const FlexHeaderTitle = styled.div<FlexHeaderTitleProps>`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: ${TABLE_SPACING.gap.medium};
  flex: 1;
  padding: ${TABLE_SPACING.header.padding};
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.heading};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.semibold};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.md};
  line-height: ${TABLE_TYPOGRAPHY.lineHeight.heading};
  color: ${TABLE_COLORS.text.primary};
  background-color: ${({ bgColor }) => bgColor || 'transparent'};
  border-radius: ${({ bgColor }) =>
    bgColor ? TABLE_BORDER_RADIUS.headerTitle : '0'};
  ${({ bgColor, hasSubColumns }) => {
    if (bgColor) {
      return `
        border: 1px solid ${TABLE_COLORS.border.header};
        border-bottom: ${hasSubColumns ? `1px solid ${TABLE_COLORS.border.primary}` : `1px solid ${TABLE_COLORS.border.header}`};
      `;
    }
    return `
      border-bottom: ${hasSubColumns ? `1px solid ${TABLE_COLORS.border.primary}` : 'none'};
    `;
  }}
`;

export const FlexSubColumnsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  min-height: 0;
`;

interface FlexSubColumnProps {
  isLast?: boolean;
  showBorder?: boolean;
  showInnerBorder?: boolean;
  width?: string;
}

export const FlexSubColumn = styled.div<FlexSubColumnProps>`
  flex: ${({ width }) => (width ? `0 0 ${width}` : '1 1 0')};
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${TABLE_SPACING.gap.small};
  padding: ${TABLE_SPACING.cell.padding};
  box-sizing: border-box;
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.normal};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.xs};
  line-height: ${TABLE_TYPOGRAPHY.lineHeight.heading};
  color: ${TABLE_COLORS.text.primary};
  border-right: ${({ isLast, showBorder, showInnerBorder }) => {
    if (isLast) return 'none';
    if (showBorder) return `1px solid ${TABLE_COLORS.border.primary}`;
    if (showInnerBorder) return `1px solid ${TABLE_COLORS.border.subtle}`;
    return 'none';
  }};
`;

interface FlexBodyCellProps {
  width?: string;
  align?: 'left' | 'center' | 'right';
  isAxisColumn?: boolean;
  hasColumnGap?: boolean;
  cellHover?: boolean;
  isColumnHovered?: boolean;
}

export const FlexBodyCell = styled.div<FlexBodyCellProps>`
  display: flex;
  align-items: center;
  justify-content: ${({ align }) => {
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      default:
        return 'center';
    }
  }};
  flex: ${({ width }) => {
    if (width) return `0 0 ${width}`;
    return '1 1 0';
  }};
  min-width: 0;
  box-sizing: border-box;
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.sm};
  color: ${TABLE_COLORS.text.primary};
  background-color: inherit;
  transition: background-color 0.15s ease;

  ${({ isAxisColumn }) =>
    isAxisColumn &&
    `
    border-right: none;
  `}

  ${({ cellHover }) =>
    cellHover &&
    `
    &:hover {
      font-weight: bold;
      text-decoration: underline;
      text-decoration-color: currentColor;

      & > span[data-cell-text],
      & [data-cell-text] {
        font-weight: bold;
        text-decoration: underline;
        text-decoration-color: currentColor;
      }
    }
  `}

  ${({ isColumnHovered }) =>
    isColumnHovered &&
    `
    background-color: ${TABLE_COLORS.background.hover};
  `}
`;

interface FlexBodyCellWrapperProps {
  isAxisColumn?: boolean;
  axisWidth?: string;
  showGroupBorder?: boolean;
  isLast?: boolean;
}

export const FlexBodyCellWrapper = styled.div<FlexBodyCellWrapperProps>`
  flex: ${({ isAxisColumn, axisWidth }) => {
    if (isAxisColumn) {
      return axisWidth ? `0 0 ${axisWidth}` : TABLE_SPACING.axis.flex;
    }
    return 1;
  }};
  display: flex;
  width: ${({ isAxisColumn, axisWidth }) =>
    isAxisColumn ? axisWidth || TABLE_SPACING.axis.width : 'auto'};
  min-width: ${({ isAxisColumn, axisWidth }) =>
    isAxisColumn ? axisWidth || TABLE_SPACING.axis.width : '0'};
  max-width: ${({ isAxisColumn, axisWidth }) =>
    isAxisColumn ? axisWidth || TABLE_SPACING.axis.width : 'none'};
  box-sizing: border-box;

  ${({ showGroupBorder, isLast }) =>
    showGroupBorder &&
    !isLast &&
    `
    border-right: 1px solid ${TABLE_COLORS.border.primary};
  `}
`;

interface FlexBodyCellGroupProps {
  isAxisColumn?: boolean;
  hasColumnGap?: boolean;
  showColumnBorder?: boolean;
  showInnerBorder?: boolean;
  isHoveredGroup?: boolean;
}

export const FlexBodyCellGroup = styled.div<FlexBodyCellGroupProps>`
  display: flex;
  flex-direction: row;
  width: 100%;
  background-color: inherit;

  ${({ showColumnBorder }) =>
    showColumnBorder &&
    `
    & > div {
      border-right: 1px solid ${TABLE_COLORS.border.primary};
    }
    
    & > div:last-child {
      border-right: none;
    }
  `}

  ${({ showInnerBorder, showColumnBorder }) =>
    showInnerBorder &&
    !showColumnBorder &&
    `
    & > div {
      border-right: 1px solid ${TABLE_COLORS.border.subtle};
    }
    
    & > div:last-child {
      border-right: none;
    }
  `}

  ${({ isHoveredGroup }) =>
    isHoveredGroup &&
    `
    & > div:not([data-empty="true"]) {
      font-weight: bold;
      text-decoration: underline;
      text-decoration-color: currentColor;
      
      span, div {
        font-weight: bold;
        text-decoration: underline;
        text-decoration-color: currentColor;
      }
      
      img {
        text-decoration: none;
      }
    }
  `}
`;
