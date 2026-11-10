import { memo } from 'react';
import { useIntl } from 'react-intl';

import { MarkdownRenderer } from 'components/ai/components/atoms/MarkdownRenderer';
import { Skeleton, SkeletonBorderRadius } from 'components/Skeleton';

import { Alert } from '../../../../../components/Alert';
import { skeletonSizes } from '../../constants';
import { useAISummaryData } from '../../hooks/useAISummaryData/useAISummaryData';
import { AISummaryProps } from '../../types';
import { StyledSummaryContainer } from './AISummaryAlert.styles';

const getContainerTestId = (dataTestId?: string, pageName?: string) =>
  dataTestId ? `${dataTestId}-ai-summary-content` : `ai-summary-${pageName}`;

const getSkeletonTestId = (dataTestId?: string, pageName?: string) =>
  dataTestId
    ? `${dataTestId}-skeleton-ai-summary-loading`
    : `skeleton-ai-summary-${pageName}-loading`;

const getAlertTestId = (dataTestId?: string, pageName?: string) =>
  dataTestId ? `${dataTestId}-alert` : `alert-${pageName}`;

export const AISummaryAlert = ({
  pageName,
  kpiGroup,
  dataTestId,
  subFilters = null,
  summaryPageIdentifier,
  hasExpandedAction = true,
}: AISummaryProps) => {
  const { formatMessage } = useIntl();
  const { summary, loading, alertType } = useAISummaryData({
    pageName,
    kpiGroup,
    subFilters,
    summaryPageIdentifier,
  });

  if (loading) {
    return (
      <StyledSummaryContainer
        data-testid={getContainerTestId(dataTestId, pageName)}
      >
        <Skeleton
          data-testid={getSkeletonTestId(dataTestId, pageName)}
          width={'100%'}
          height={skeletonSizes.height}
          length={skeletonSizes.length}
          borderRadius={skeletonSizes.borderRadius as SkeletonBorderRadius}
        />
      </StyledSummaryContainer>
    );
  }

  const { resume, seeMore } = summary;

  const expandedAction = seeMore
    ? {
        actionMessage: formatMessage({ id: 'AISummary.MainPages.seeMore' }),
        retracMessage: formatMessage({ id: 'AISummary.MainPages.seeLess' }),
        expandedMessage: <MarkdownRenderer content={seeMore} />,
      }
    : null;

  return (
    <StyledSummaryContainer
      data-testid={getContainerTestId(dataTestId, pageName)}
    >
      <Alert
        dataTestId={getAlertTestId(dataTestId, pageName)}
        type={alertType}
        message={<MarkdownRenderer content={resume} />}
        expandedAction={hasExpandedAction ? expandedAction : null}
      />
    </StyledSummaryContainer>
  );
};

export const AISummary = memo(AISummaryAlert);
