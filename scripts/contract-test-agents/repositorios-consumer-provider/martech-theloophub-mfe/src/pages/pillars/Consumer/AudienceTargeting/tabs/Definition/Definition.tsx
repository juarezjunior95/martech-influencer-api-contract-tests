import { useState } from 'react';

import { TableDataType } from 'components/TableComponent';
import { useDataRefreshForTab } from 'contexts/DataRefreshModal/useDataRefreshForTab';

import { AudienceTargetingError } from '../../constants';
import { BrandAudience, ParticipationBreakdown } from './components';
import { BrandAudiencesTargetingCardModel } from './components/BrandAudience/types';
import { DefinitionContainer } from './Definition.styles';

interface DefinitionProps {
  dataTestId?: string;
  audienceData?: BrandAudiencesTargetingCardModel[];
  breakdownData?: TableDataType | null;
  isLoading?: boolean;
  error?: Error | null;
}

export const Definition = ({
  dataTestId,
  audienceData,
  breakdownData,
  isLoading,
  error,
}: DefinitionProps) => {
  useDataRefreshForTab('Audience Targeting - Definition');

  const [highlightedSegments, setHighlightedSegments] = useState<string[]>([]);

  // Page-level empty states (data refresh fail, permission required,
  // country without data) are handled globally in AudienceTargeting.tsx,
  // which hides the tabs and renders the correct NoDataAvailable component.
  const isCompetitorWithoutData =
    error?.message === AudienceTargetingError.CompetitorWithoutData;

  return (
    <DefinitionContainer>
      <BrandAudience
        data={audienceData}
        isLoading={isLoading ?? false}
        setHighlightedSegments={setHighlightedSegments}
        dataTestId={`${dataTestId}-brand-audience`}
        error={isCompetitorWithoutData ? null : (error ?? null)}
      />
      <ParticipationBreakdown
        data={breakdownData}
        dataTestId={`${dataTestId}-participation-breakdown`}
        isLoading={isLoading ?? false}
        highlightedItems={highlightedSegments}
        error={error ?? null}
      />
    </DefinitionContainer>
  );
};
