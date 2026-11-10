import styled from '@emotion/styled';

import { TABLE_COLORS } from './colors';
import { TABLE_SPACING } from './spacing';
import { TABLE_TYPOGRAPHY } from './typography';

interface TableSectionProps {
  position?: 'top' | 'middle' | 'bottom' | 'standalone';
  noBorder?: boolean;
}

export const StyledTableSection = styled.div<TableSectionProps>`
  width: 100%;
  overflow: visible;
  background-color: ${TABLE_COLORS.background.transparent};
`;

export const StyledTableSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${TABLE_SPACING.section.padding};
  background-color: ${TABLE_COLORS.background.secondary};
  border-bottom: 1px solid ${TABLE_COLORS.border.primary};
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.heading};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.md};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.semibold};
  color: ${TABLE_COLORS.text.primary};
`;

export const StyledTableSectionTitle = styled.span`
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.heading};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.md};
  font-weight: ${TABLE_TYPOGRAPHY.fontWeight.semibold};
  color: ${TABLE_COLORS.text.primary};
`;

export const StyledTableSectionBody = styled.div`
  overflow-x: auto;
`;

export const StyledTableSectionFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${TABLE_SPACING.section.paddingSmall};
  background-color: ${TABLE_COLORS.background.secondary};
  border-top: 1px solid ${TABLE_COLORS.border.primary};
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.sm};
  color: ${TABLE_COLORS.text.secondary};
`;

export const StyledFooterInfo = styled.span`
  font-family: ${TABLE_TYPOGRAPHY.fontFamily.body};
  font-size: ${TABLE_TYPOGRAPHY.fontSize.sm};
  color: ${TABLE_COLORS.text.secondary};
`;

export const StyledFooterPagination = styled.div`
  display: flex;
  align-items: center;
  gap: ${TABLE_SPACING.gap.medium};
`;

export const StyledTableFooterWrapper = styled.div`
  margin-top: ${TABLE_SPACING.gap.large};
`;
