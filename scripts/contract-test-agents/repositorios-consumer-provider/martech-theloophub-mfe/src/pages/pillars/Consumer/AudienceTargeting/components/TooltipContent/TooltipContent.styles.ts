import styled from '@emotion/styled';
import { theme } from 'theme';

export const StyledTooltipContainer = styled.div``;

export const StyledTooltipHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledTooltipTitle = styled.h2`
  font-weight: bold;
  font-family: ${theme.fonts.heading};
  color: ${theme.colors.txt.default};
  margin: 0 0 8px 0;
  font-size: 24px;
  line-height: 1.2;
`;

export const StyledTooltipSubtitle = styled.p`
  font-size: 14px;
  font-weight: 600;
  font-family: ${theme.fonts.paragraph};
  color: ${theme.colors.txt.default};
  margin: 0 0 16px 0;
`;

export const StyledTooltipText = styled.p`
  font-size: 14px;
  font-weight: 400;
  font-family: ${theme.fonts.paragraph};
  color: ${theme.colors.txt.default};
  margin: 0;
  white-space: pre-line;
`;

export const StyledTooltipContent = styled.div<{ $paddingLeft?: boolean }>`
  padding-left: ${({ $paddingLeft }) => ($paddingLeft ? '24px' : '0')};
`;
