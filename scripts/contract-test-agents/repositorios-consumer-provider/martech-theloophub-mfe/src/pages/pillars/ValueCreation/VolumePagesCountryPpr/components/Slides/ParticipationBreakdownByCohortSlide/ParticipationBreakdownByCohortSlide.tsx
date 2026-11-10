import React from 'react';

import { POSBookTable } from 'pages/components';

import {
  StyledParticipationBreakdownSlideRoot,
  StyledParticipationBreakdownTablePanel,
} from './ParticipationBreakdownByCohortSlide.styles';
import type { ParticipationBreakdownByCohortSlideProps } from './types';

export const ParticipationBreakdownByCohortSlide: React.FC<
  ParticipationBreakdownByCohortSlideProps
> = ({
  loading,
  data,
  config,
  dataTestId,
  isExport = true,
  rowHeight = 56,
}) => {
  return (
    <StyledParticipationBreakdownSlideRoot data-testid={dataTestId}>
      <StyledParticipationBreakdownTablePanel>
        <POSBookTable
          loading={loading}
          data={data}
          config={config}
          dataTestId={dataTestId ? `${dataTestId}-pos-book-table` : undefined}
          isExport={isExport}
          rowHeight={rowHeight}
        />
      </StyledParticipationBreakdownTablePanel>
    </StyledParticipationBreakdownSlideRoot>
  );
};
