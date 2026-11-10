import styled from '@emotion/styled';

export const AISummaryVolumePagesStyles = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
  `,
  Title: styled.div`
    font-family: Barlow;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 8px;
    h1 {
      margin: 0;
    }
  `,
  Body: styled.div`
    padding: 0 8px;
  `,
  SectionIndicator: styled.p`
    margin: 3px 0 2px 0;
    font-family: Work Sans;
    font-weight: 600;
    font-size: 14px;
    color: #67665f;
  `,
  Empty: styled.div`
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    height: 938px;
  `,
};

export const AISummaryVolumePagesSkeletonStyles = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0 8px;
  `,

  FirstSectionSkeleton: styled.div`
    display: flex;
    gap: 24px;
  `,
  SecondSectionSkeleton: styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  `,
};

export const GradientTextSVGStyles = {
  Svg: styled.svg`
    display: block;
    margin-bottom: 24px;
  `,
};
