import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import AISummaryVolPagesIcon from 'assets/img/AISummary/volume-pages.png';
import { DataStateHandler } from 'components';
import { MarkdownRenderer } from 'components/ai/components/atoms/MarkdownRenderer';
import { FilterValue } from 'models/Filters';

import { AI_SUMMARY_VOLUME_PAGES_ID } from '../../constants';
import { useAISummaryData } from '../../hooks/useAISummaryData/useAISummaryData';
import { AISummaryVolumePagesStyles as Styles } from './AISummaryVolumePages.styles';
import { AISummaryVolumePagesSkeleton } from './AISummaryVolumePagesSkeleton';
import { GradientTextSVG } from './GradientTextSVG';
import { extractFirstParagraph } from './utils';

interface AISummaryVolumePagesProps {
  pageName: string;
  subFilters: Record<string, FilterValue>;
  dataTestId: string;
}

export const AISummaryVolumePages = ({
  pageName,
  subFilters,
  dataTestId,
}: AISummaryVolumePagesProps) => {
  const { formatMessage } = useIntl();

  const title = formatMessage({ id: 'AISummary.VolumePages.title' });
  const subtitle = formatMessage({ id: 'AISummary.VolumePages.subtitle' });

  const { summary, loading } = useAISummaryData({
    pageName,
    summaryPageIdentifier: AI_SUMMARY_VOLUME_PAGES_ID,
    kpiGroup: 'volume',
    subFilters,
  });

  const { firstParagraph, rest } = useMemo(() => {
    if (!summary?.seeMore) return { firstParagraph: '', rest: '' };
    return extractFirstParagraph(summary.seeMore);
  }, [summary?.seeMore]);

  const hasContent = !loading && summary?.seeMore && !summary?.empty;

  return (
    <Styles.Container data-testid={`${dataTestId}-container`}>
      <Styles.Title data-testid={`${dataTestId}-title`}>
        <img src={AISummaryVolPagesIcon} alt="ai-summary-volume-pages" />
        <h1>{title}</h1>
      </Styles.Title>

      {loading && <AISummaryVolumePagesSkeleton />}

      {hasContent && (
        <Styles.Body data-testid={`${dataTestId}-body`}>
          <Styles.SectionIndicator>{subtitle}</Styles.SectionIndicator>
          {firstParagraph && (
            <GradientTextSVG>{firstParagraph}</GradientTextSVG>
          )}
          <MarkdownRenderer
            className="ai-summary-volume-pages"
            data-testid={`${dataTestId}-markdown`}
            content={rest}
            tableHorizontalScroll={false}
          />
        </Styles.Body>
      )}

      {!hasContent && (
        <Styles.Empty data-testid={`${dataTestId}-empty`}>
          <DataStateHandler
            empty
            loading={false}
            message={{
              title: 'An error occurred',
              description: 'Failed to generate AI insights.',
            }}
          >
            <></>
          </DataStateHandler>
        </Styles.Empty>
      )}
    </Styles.Container>
  );
};
