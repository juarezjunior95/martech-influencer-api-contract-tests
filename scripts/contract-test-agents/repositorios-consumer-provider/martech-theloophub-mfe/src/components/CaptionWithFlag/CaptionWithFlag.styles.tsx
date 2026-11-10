import styled from '@emotion/styled';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';

export const StyledCaptionContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  overflow: hidden;
`;

export const StyledLabelText = styled.span`
  display: block;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  font-family: 'Work Sans', sans-serif;
  line-height: 18px;
`;

interface StyledFlagImgProps {
  $flagSize?: number;
}

export const StyledFlagImg = styled.img<StyledFlagImgProps>`
  width: ${({ $flagSize = 40 }) => $flagSize}px;
  height: ${({ $flagSize = 40 }) => $flagSize}px;
  border: 1px solid ${tokens.color.foundation.border.secondary};
  border-radius: 50%;
`;
