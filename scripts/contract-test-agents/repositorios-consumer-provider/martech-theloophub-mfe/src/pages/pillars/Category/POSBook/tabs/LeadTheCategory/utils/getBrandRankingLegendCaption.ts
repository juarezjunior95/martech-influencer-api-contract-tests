import type { CaptionItem } from 'components';
import type { RankedContainerData } from 'pages/components/BrandRanking/types';

import { COMPETITOR_LEGEND_LABEL } from '../constants';

export function getBrandRankingLegendCaption(
  ranking: RankedContainerData,
  caption: CaptionItem[],
): CaptionItem[] {
  // datasets[2] is the bar-chart colouring dataset by BFF / formatter convention (same index as
  // RankedVerticalBar). Dataset[] has no typed positional contract — if the formatter changes
  // order, source becomes undefined and the Competitor legend is hidden even when bars are comp.
  const source = ranking.datasets?.[2]?.source;
  const hasCompetitorBar =
    Array.isArray(source) &&
    source.some((s) => String(s).toLowerCase() === 'comp');

  if (hasCompetitorBar) {
    return caption;
  }

  return caption.filter((item) => item.label !== COMPETITOR_LEGEND_LABEL);
}
