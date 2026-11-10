import styled from '@emotion/styled';

import { TABLE_COLORS } from '../../styles/colors';
import { TABLE_SPACING } from '../../styles/spacing';
import { TABLE_TYPOGRAPHY } from '../../styles/typography';

interface PageButtonProps {
  active?: boolean;
}

interface PaginationButtonProps {
  disabled?: boolean;
  position?: 'first' | 'middle' | 'last' | 'single';
}

const PAGINATION_BORDER = `1px solid ${TABLE_COLORS.border.header}`;

export const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${TABLE_SPACING.gap.large};
  width: 100%;
`;

export const CounterText = styled.span`
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.sm};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.normal};
  color: ${TABLE_COLORS.text.primary};
  white-space: nowrap;
`;

export const ItemsPerPageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${TABLE_SPACING.gap.medium};
`;

export const ItemsPerPageLabel = styled.span`
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.sm};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.normal};
  color: ${TABLE_COLORS.text.primary};
  white-space: nowrap;
`;

export const ItemsPerPageSelect = styled.select`
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.sm};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.normal};
  color: ${TABLE_COLORS.text.primary};
  background-color: ${TABLE_COLORS.background.primary};
  border: ${PAGINATION_BORDER};
  border-radius: ${TABLE_SPACING.gap.medium};
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${TABLE_COLORS.border.medium};
  }

  &:focus {
    outline: none;
    border-color: ${TABLE_COLORS.text.primary};
  }
`;

export const NavigationGroup = styled.div`
  display: flex;
  align-items: center;
  border: ${PAGINATION_BORDER};
  border-radius: 24px;
  background-color: ${TABLE_COLORS.background.primary};
  overflow: hidden;
`;

export const PaginationButton = styled.button<PaginationButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 40px;
  border: none;
  border-right: ${({ position }) =>
    position === 'last' || position === 'single' ? 'none' : PAGINATION_BORDER};
  border-radius: ${({ position }) => {
    if (position === 'first') return '23px 0 0 23px';
    if (position === 'last') return '0 23px 23px 0';
    return '0';
  }};
  background-color: ${TABLE_COLORS.background.primary};
  color: ${TABLE_COLORS.text.primary};
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease-in-out;
  padding: 0 12px;
  gap: 10px;

  svg {
    width: 10px;
    height: 10px;
    flex-shrink: 0;
    stroke-width: 1;
    color: ${TABLE_COLORS.text.primary};
  }

  &:hover:not(:disabled) {
    background-color: ${TABLE_COLORS.background.disabled};
  }

  &:active:not(:disabled) {
    background-color: ${TABLE_COLORS.border.primary};
  }

  &:disabled {
    cursor: not-allowed !important;

    svg {
      color: ${TABLE_COLORS.text.muted};
      pointer-events: none;
    }
  }
`;

export const PaginationNumbers = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
`;

export const PageButton = styled.button<PageButtonProps>`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 40px;
  padding: 0 ${TABLE_SPACING.gap.large};
  border: none;
  border-radius: 0;
  background-color: ${TABLE_COLORS.background.primary};
  color: ${({ active }) =>
    active ? TABLE_COLORS.text.primary : TABLE_COLORS.text.secondary};
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.sm};
  font-weight: ${({ active }) =>
    active ? 700 : TABLE_TYPOGRAPHY.fontWeight.normal};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: ${({ active }) => (active ? '100%' : '0')};
    height: 2px;
    background-color: ${TABLE_COLORS.text.primary};
    transition: width 0.2s ease-in-out;
  }

  &:hover {
    background-color: ${TABLE_COLORS.background.disabled};
    color: ${TABLE_COLORS.text.primary};
  }

  &:active {
    background-color: ${TABLE_COLORS.border.primary};
  }
`;
