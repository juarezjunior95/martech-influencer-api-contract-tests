import { ReactNode } from 'react';

import { DataStateHandler } from 'components';

import * as S from './InsightsSlide.styles';

type InsightsSlideProps = {
  title: string;
  content: ReactNode;
  titleSide?: 'left' | 'right';
  indexBadge?: number | string;
  loading?: boolean;
  error?: any;
  empty?: boolean;
  dataTestId?: string;
};

export const InsightsSlide = ({
  title,
  content,
  titleSide = 'left',
  indexBadge,
  loading,
  error,
  empty,
  dataTestId,
}: InsightsSlideProps) => {
  return (
    <S.StyledInsightsWrapper data-testid={dataTestId}>
      {indexBadge === undefined ? null : (
        <S.StyledIndexBadge>
          <S.StyledParagraph>{indexBadge}</S.StyledParagraph>
        </S.StyledIndexBadge>
      )}
      <DataStateHandler
        loading={loading}
        error={error}
        empty={empty}
        skeletonProps={{ height: '619px', width: '100%', length: 1 }}
      >
        <S.StyledInsightsContainer titleRight={titleSide === 'right'}>
          <S.StyledTitleInsight>
            <S.StyledTitle>{title}</S.StyledTitle>
          </S.StyledTitleInsight>
          <S.StyledContentInsight>
            <S.StyledContentWrapper>{content}</S.StyledContentWrapper>
          </S.StyledContentInsight>
        </S.StyledInsightsContainer>
      </DataStateHandler>
    </S.StyledInsightsWrapper>
  );
};
