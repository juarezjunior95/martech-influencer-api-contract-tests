import styled from '@emotion/styled';

import { TABLE_COLORS } from '../../styles';
import { TABLE_SPACING } from '../../styles/spacing';
import { TABLE_TYPOGRAPHY } from '../../styles/typography';

export const CELL_COLORS = {
  primary: TABLE_COLORS.text.primary,
  secondary: TABLE_COLORS.text.secondary,
  muted: TABLE_COLORS.text.muted,
  border: TABLE_COLORS.border.default,
  neutral: TABLE_COLORS.variation.neutral,
  checkboxBorder: TABLE_COLORS.interactive.checkbox.border,
  checkboxActive: TABLE_COLORS.interactive.checkbox.active,
};

export const CELL_SPACING = {
  padding: TABLE_SPACING.cell.padding,
  gap: TABLE_SPACING.cell.gap,
  gapSmall: TABLE_SPACING.cell.gapSmall,
  /** Padding-right for right-aligned axis cells (leaves room for tick marks). */
  paddingRightAxisRight: TABLE_SPACING.gap.large,
};

export const CELL_TYPOGRAPHY = {
  fontFamily: TABLE_TYPOGRAPHY.fontFamily.body,
  fontSize: TABLE_TYPOGRAPHY.fontSize.sm,
  fontSizeSmall: TABLE_TYPOGRAPHY.fontSize.xs,
  lineHeight: TABLE_TYPOGRAPHY.lineHeight.default,
  fontWeightNormal: TABLE_TYPOGRAPHY.fontWeight.normal,
  fontWeightMedium: TABLE_TYPOGRAPHY.fontWeight.medium,
  fontWeightBold: TABLE_TYPOGRAPHY.fontWeight.semibold,
};

interface CellAlignProps {
  align?: 'left' | 'center' | 'right';
}

const getJustifyContent = (align?: string) => {
  switch (align) {
    case 'center':
      return 'center';
    case 'right':
      return 'flex-end';
    default:
      return 'flex-start';
  }
};

export const StyledTextCell = styled.div<CellAlignProps>`
  display: flex;
  align-items: center;
  padding: ${CELL_SPACING.padding};
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  font-size: ${CELL_TYPOGRAPHY.fontSize};
  line-height: ${CELL_TYPOGRAPHY.lineHeight};
  color: ${CELL_COLORS.primary};
  justify-content: ${({ align }) => getJustifyContent(align)};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  box-sizing: border-box;

  .subtitle {
    margin-left: ${CELL_SPACING.gapSmall};
    font-size: ${CELL_TYPOGRAPHY.fontSizeSmall};
    color: ${CELL_COLORS.muted};
  }
`;

interface NumberCellProps extends CellAlignProps {
  isPrimary?: boolean;
  isStacked?: boolean;
}

export const StyledNumberCell = styled.div<NumberCellProps>`
  display: flex;
  align-items: ${({ isStacked, align }) =>
    isStacked ? getJustifyContent(align || 'center') : 'center'};
  flex-direction: ${({ isStacked }) => (isStacked ? 'column' : 'row')};
  padding: ${CELL_SPACING.padding};
  justify-content: ${({ isStacked, align }) =>
    isStacked ? 'center' : getJustifyContent(align || 'center')};
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  font-size: ${({ isPrimary }) =>
    isPrimary ? CELL_TYPOGRAPHY.fontSize : CELL_TYPOGRAPHY.fontSizeSmall};
  font-weight: ${({ isPrimary }) =>
    isPrimary
      ? CELL_TYPOGRAPHY.fontWeightBold
      : CELL_TYPOGRAPHY.fontWeightNormal};
  color: ${({ isPrimary }) =>
    isPrimary ? CELL_COLORS.primary : CELL_COLORS.secondary};
  gap: ${({ isStacked }) => (isStacked ? '2px' : CELL_SPACING.gap)};
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledUnitMeasure = styled.span`
  margin-left: 2px;
  font-size: inherit;
  color: inherit;
`;

interface ColorProps {
  color: string;
}

interface NumberValueProps extends ColorProps {
  hasVariation?: boolean;
}

interface NumberArrowProps extends ColorProps {
  position?: 'left' | 'right';
}

export const StyledNumberArrow = styled.span<NumberArrowProps>`
  display: inline-flex;
  align-items: center;
  flex-shrink: 1;
  overflow: hidden;
  color: ${({ color }) => color};
  margin-left: ${({ position }) =>
    position === 'left' ? '0' : CELL_SPACING.gap};
  margin-right: ${({ position }) =>
    position === 'left' ? CELL_SPACING.gap : '0'};
`;

export const StyledNumberValue = styled.span<NumberValueProps>`
  display: inline-block;
  font-size: ${CELL_TYPOGRAPHY.fontSize};
  font-weight: ${CELL_TYPOGRAPHY.fontWeightNormal};
  line-height: ${CELL_TYPOGRAPHY.lineHeight};
  color: ${({ color }) => color};
  flex: 0 1 auto;
  min-width: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const StyledNumberMeasure = styled.span<ColorProps>`
  font-size: ${CELL_TYPOGRAPHY.fontSizeSmall};
  color: ${({ color }) => color};
  margin-left: ${CELL_SPACING.gapSmall};
`;

interface ImageShapeProps {
  shape?: 'circle' | 'square';
}

interface ImageCellProps extends CellAlignProps {
  imagePosition?: 'left' | 'top';
}

export const StyledImageCell = styled.div<ImageCellProps>`
  display: flex;
  flex-direction: ${({ imagePosition }) =>
    imagePosition === 'top' ? 'column' : 'row'};
  align-items: center;
  padding: ${CELL_SPACING.padding};
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  font-size: ${CELL_TYPOGRAPHY.fontSize};
  line-height: ${CELL_TYPOGRAPHY.lineHeight};
  gap: ${({ imagePosition }) =>
    imagePosition === 'top' ? '8px' : CELL_SPACING.gap};
  color: ${CELL_COLORS.primary};
  justify-content: ${({ align }) => getJustifyContent(align)};
`;

interface CellImageProps extends ImageShapeProps {
  size?: 'small' | 'medium' | 'large';
}

export const StyledCellImage = styled.img<CellImageProps>`
  width: ${({ size }) => {
    switch (size) {
      case 'large':
        return '48px';
      case 'medium':
        return '32px';
      default:
        return '24px';
    }
  }};
  height: ${({ size }) => {
    switch (size) {
      case 'large':
        return '48px';
      case 'medium':
        return '32px';
      default:
        return '24px';
    }
  }};
  border-radius: ${({ shape }) => (shape === 'square' ? '4px' : '50%')};
  object-fit: cover;
`;

export const StyledTooltipContent = styled.span`
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  font-size: ${CELL_TYPOGRAPHY.fontSizeSmall};
  color: ${CELL_COLORS.primary};
  padding: 4px 8px;
`;

export const StyledAxisCell = styled.div<CellAlignProps>`
  display: flex;
  align-items: center;
  width: ${({ align }) => (align === 'right' ? '100%' : 'auto')};
  padding: ${CELL_SPACING.padding};
  padding-right: ${({ align }) =>
    align === 'right'
      ? CELL_SPACING.paddingRightAxisRight
      : CELL_SPACING.padding};
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  font-size: 16px;
  font-weight: 400;
  gap: ${CELL_SPACING.gap};
  justify-content: ${({ align }) => getJustifyContent(align)};
`;

export const StyledAxisText = styled.span`
  font-size: 16px;
  font-weight: 400;
  color: ${CELL_COLORS.primary};
`;

export const StyledAxisSubtext = styled.span`
  font-size: ${CELL_TYPOGRAPHY.fontSizeSmall};
  color: ${CELL_COLORS.secondary};
`;

export const StyledSecondaryValue = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 140%;
  color: ${CELL_COLORS.secondary};
`;

export const StyledValueSeparator = styled.span`
  color: ${CELL_COLORS.secondary};
`;

export const StyledHeaderGridCell = styled.div<CellAlignProps>`
  display: flex;
  flex-direction: column;
  padding: ${CELL_SPACING.padding};
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  gap: ${CELL_SPACING.gapSmall};
  align-items: ${({ align }) => {
    switch (align) {
      case 'center':
        return 'center';
      case 'right':
        return 'flex-end';
      default:
        return 'flex-start';
    }
  }};
`;

export const StyledHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${CELL_SPACING.gapSmall};
`;

export const StyledGridMainText = styled.span`
  font-size: ${CELL_TYPOGRAPHY.fontSize};
  font-weight: ${CELL_TYPOGRAPHY.fontWeightBold};
  color: ${CELL_COLORS.primary};
  flex: 1;
`;

export const StyledGridSubText = styled.span`
  font-size: ${CELL_TYPOGRAPHY.fontSizeSmall};
  color: ${CELL_COLORS.secondary};
`;

export const StyledGridSecondaryText = styled.span`
  font-size: ${CELL_TYPOGRAPHY.fontSizeSmall};
  color: ${CELL_COLORS.secondary};
  flex: 1;
`;

export const StyledGridIconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const StyledCheckboxCell = styled.div<CellAlignProps>`
  display: flex;
  align-items: center;
  padding: ${CELL_SPACING.padding};
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  justify-content: ${({ align }) => getJustifyContent(align)};
  gap: ${CELL_SPACING.gap};
`;

interface StyledCheckInputProps {
  checked: 'none' | 'selected' | 'indeterminate';
  isDisabled?: boolean;
  hasError?: boolean;
}

export const StyledCheckInput = styled.div<StyledCheckInputProps>`
  height: ${TABLE_SPACING.checkbox.size};
  width: ${TABLE_SPACING.checkbox.size};
  min-height: ${TABLE_SPACING.checkbox.size};
  min-width: ${TABLE_SPACING.checkbox.size};
  max-height: ${TABLE_SPACING.checkbox.size};
  max-width: ${TABLE_SPACING.checkbox.size};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${TABLE_COLORS.border.medium};
  border-radius: 4px;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ checked }) =>
    checked === 'selected' &&
    `
    background-color: ${TABLE_COLORS.interactive.primary};
    border-color: ${TABLE_COLORS.interactive.primary};
  `}

  ${({ checked }) =>
    checked === 'indeterminate' &&
    `
    background-color: ${TABLE_COLORS.interactive.primary};
    border-color: ${TABLE_COLORS.interactive.primary};
  `}

  ${({ checked }) =>
    checked === 'none' &&
    `
    background-color: transparent;
    border-color: ${TABLE_COLORS.border.medium};
  `}

  ${({ isDisabled }) =>
    isDisabled &&
    `
    opacity: 0.5;
    background-color: ${TABLE_COLORS.background.disabled};
    border-color: ${TABLE_COLORS.border.default};
    cursor: not-allowed;
    pointer-events: none;
  `}

  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${TABLE_COLORS.interactive.error};
  `}

  &:hover {
    ${({ isDisabled }) =>
      !isDisabled &&
      `
      border: 2px solid ${TABLE_COLORS.interactive.primary};
    `}
  }
`;

export const StyledCheckboxLabel = styled.span`
  font-size: ${CELL_TYPOGRAPHY.fontSize};
  color: ${CELL_COLORS.primary};
`;

export const StyledHiddenInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const StyledCheckboxIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #141414;

  svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }
`;

export const StyledIconCell = styled.div<CellAlignProps>`
  display: flex;
  align-items: center;
  padding: ${CELL_SPACING.padding};
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  justify-content: ${({ align }) => getJustifyContent(align)};
  gap: ${CELL_SPACING.gap};
`;

interface IconWrapperProps {
  iconSize?: 'small' | 'medium' | 'large' | 'xlarge';
}

const getIconSize = (size?: 'small' | 'medium' | 'large' | 'xlarge') => {
  switch (size) {
    case 'small':
      return '16px';
    case 'medium':
      return '20px';
    case 'large':
      return '22px';
    case 'xlarge':
      return '32px';
    default:
      return '20px';
  }
};

export const StyledIconWrapper = styled.span<IconWrapperProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ iconSize }) => getIconSize(iconSize)};
  min-height: ${({ iconSize }) => getIconSize(iconSize)};
  color: ${CELL_COLORS.primary};

  svg {
    width: ${({ iconSize }) => getIconSize(iconSize)};
    height: ${({ iconSize }) => getIconSize(iconSize)};
  }
`;

export const StyledIconImage = styled.img<IconWrapperProps>`
  width: ${({ iconSize }) => getIconSize(iconSize)};
  height: ${({ iconSize }) => getIconSize(iconSize)};
  object-fit: contain;
`;

export const StyledIconLabel = styled.span`
  font-size: ${CELL_TYPOGRAPHY.fontSize};
  color: ${CELL_COLORS.primary};
`;

export const INDEX_TAG_COLORS = {
  up: {
    background: '#E6F9E6',
    text: '#007800',
  },
  down: {
    background: '#FEE2E2',
    text: '#B91C1C',
  },
  neutral: {
    background: 'rgba(242, 242, 242, 1)',
    text: '#5C5C5C',
  },
};

interface IndexTagProps {
  backgroundColor: string;
  textColor: string;
}

export const StyledIndexTagCell = styled.div<CellAlignProps>`
  display: flex;
  align-items: center;
  padding: ${CELL_SPACING.padding};
  justify-content: ${({ align }) => getJustifyContent(align || 'center')};
  width: 100%;
  box-sizing: border-box;
`;

export const StyledIndexTag = styled.div<IndexTagProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  font-size: 12px;
  font-weight: 400;
  line-height: ${CELL_TYPOGRAPHY.lineHeight};
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ textColor }) => textColor};
  width: 40px;
  height: 26px;
  box-sizing: border-box;
`;

type BarChartLabelPositionProp = {
  labelPosition?: 'adjacent' | 'end';
};

export const StyledBarChartCell = styled.div<CellAlignProps>`
  display: flex;
  align-items: center;
  padding: ${TABLE_SPACING.cell.paddingLarge};
  width: 100%;
  box-sizing: border-box;
  gap: ${CELL_SPACING.gap};
`;

export const StyledBarContainer = styled.div<BarChartLabelPositionProp>`
  flex: 1;
  display: flex;
  align-items: center;
  height: 24px;
  min-width: 0;
  gap: ${({ labelPosition }) =>
    labelPosition === 'adjacent' ? CELL_SPACING.gap : '0'};
  overflow: ${({ labelPosition }) =>
    labelPosition === 'adjacent' ? 'visible' : 'hidden'};
`;

interface BarFillProps {
  percentage: number;
  barColor?: string;
}

export const StyledBarFill = styled.div<BarFillProps>`
  height: 100%;
  flex: 0 0 ${({ percentage }) => `${Math.min(Math.max(percentage, 0), 100)}%`};
  background-color: ${({ barColor }) =>
    barColor || TABLE_COLORS.interactive.primary};
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  transition: flex-basis 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 0;
`;

const BarLabelBase = styled.span`
  font-family: ${CELL_TYPOGRAPHY.fontFamily};
  font-size: ${CELL_TYPOGRAPHY.fontSizeSmall};
  font-weight: ${CELL_TYPOGRAPHY.fontWeightMedium};
`;

export const StyledBarLabel = styled(BarLabelBase)<BarChartLabelPositionProp>`
  color: ${CELL_COLORS.primary};
  font-weight: ${CELL_TYPOGRAPHY.fontWeightNormal};
  white-space: nowrap;
  flex-shrink: 0;
  ${({ labelPosition }) =>
    labelPosition === 'end' &&
    `
      min-width: 45px;
      text-align: right;
    `}
`;

export const StyledBarInternalLabel = styled(BarLabelBase)`
  color: ${TABLE_COLORS.text.primary};
  white-space: nowrap;
`;
