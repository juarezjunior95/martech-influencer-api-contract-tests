import styled from '@emotion/styled';
import { theme } from 'theme';

export const StyledTierCard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 0px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.txt.default}14;
  background-color: #ffffff;
  min-width: 0;
`;

export const StyledTierHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px 24px;
  border-bottom: 1px solid ${theme.colors.charts.border.neutrals['20']};
`;

export const StyledChartWrapper = styled.div`
  height: 314px;
  width: 100%;
`;

export const StyledTierName = styled.p`
  margin: 0;
  font-family: 'Work Sans', sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  color: ${theme.colors.txt.default};
`;

export const StyledMetricsSection = styled.div`
  margin-left: 40px;
  margin-right: 16px;
  margin-top: 4px;
  > div:first-of-type > div:last-of-type {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
  }
  > div:last-of-type > div:first-of-type {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;
