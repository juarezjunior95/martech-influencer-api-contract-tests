import styled from '@emotion/styled';

const iconSizeMap = {
  large: '24px',
  medium: '20px',
  small: '16px',
};

export const StyledPageTitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

export const StyledPageTitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
`;

export const StyledPageTitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StyledPageTitleRightContent = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export const StyledInfoIconWrapper = styled.div<{
  size?: 'large' | 'medium' | 'small';
}>`
  display: flex;
  align-items: center;

  & svg {
    width: ${({ size = 'large' }) => iconSizeMap[size]};
    height: ${({ size = 'large' }) => iconSizeMap[size]};
  }
`;

export const StyledPageDescription = styled.p`
  font-family: 'Work Sans', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  color: #444654;
  margin: 0;
`;
