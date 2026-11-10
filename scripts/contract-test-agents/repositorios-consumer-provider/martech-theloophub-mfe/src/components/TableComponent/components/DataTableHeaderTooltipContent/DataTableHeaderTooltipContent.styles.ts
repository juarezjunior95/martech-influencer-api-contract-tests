import styled from '@emotion/styled';

import { TABLE_BORDER_RADIUS, TABLE_SPACING } from '../../styles/spacing';

const INDENT_WIDTH = `calc(${TABLE_SPACING.gap.large} + ${TABLE_SPACING.gap.small})`;

export const TitleRow = styled.div<{ $compact?: boolean }>(
  {},
  ({ $compact }) => ({
    display: 'flex',
    gap: TABLE_SPACING.gap.medium,
    alignItems: 'flex-start',
    marginBottom: $compact ? 0 : TABLE_SPACING.gap.medium,
  }),
);

export const Bullet = styled('div')<{ $color: string }>(({ $color }) => ({
  width: TABLE_BORDER_RADIUS.large,
  height: TABLE_BORDER_RADIUS.large,
  borderRadius: '50%',
  background: $color,
  flexShrink: 0,
  marginTop: '10px',
}));

export const DescriptionBlock = styled.div<{ $indent: boolean }>(
  ({ $indent }) => ({
    paddingLeft: $indent ? INDENT_WIDTH : 0,
  }),
);
