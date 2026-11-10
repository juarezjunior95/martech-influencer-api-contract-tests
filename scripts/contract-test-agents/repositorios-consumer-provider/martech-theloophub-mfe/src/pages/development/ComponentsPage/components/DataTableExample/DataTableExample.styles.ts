import styled from '@emotion/styled';

export const Container = styled.div`
  background: white;
  padding: 24px;
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(20, 20, 20, 0.08);
`;

export const SectionGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 50px;
`;

export const InfoCard = styled.div`
  width: 100%;
  padding: 16px 20px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  font-family: 'Work Sans', sans-serif;
`;

export const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e8e8e8;
`;

export const InfoCardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InfoCardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`;

export const InfoCardLabel = styled.span`
  color: #757575;
  min-width: 80px;
`;

export const InfoCardValue = styled.span`
  color: #141414;
  font-weight: 500;
`;

export const InfoCardTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #141414;
`;
