import styled from '@emotion/styled';

export const StyledChartsOverflowArea = styled.div`
  overflow-y: auto;
  width: 100%;
  min-width: 0;
  max-height: 992px;
  padding: 8px 0;

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #f6f6f6;
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border-radius: 8px;
    border: 4px solid #f6f6f6;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: rgb(169, 169, 169);
  }
`;

export const StyledChartsAreaContainer = styled.div<{ $scrollActive: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  max-width: ${({ $scrollActive }) => ($scrollActive ? '1220px' : '1260px')};
  box-sizing: border-box;
`;
