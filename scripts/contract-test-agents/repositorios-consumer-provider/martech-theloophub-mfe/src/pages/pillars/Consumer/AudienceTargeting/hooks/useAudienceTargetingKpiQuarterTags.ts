import { type ElementType, useMemo } from 'react';

import { CalendarClock } from '@hexa-ui/icons2';
import { useLastDataRefresh } from 'contexts/LastDataRefresh/LastDataRefresh';
import { formatDateToQuarterYear } from 'utils/format';

export type AudienceTargetingHeaderTag = {
  icon: ElementType;
  text: string;
};

/**
 * Header tag with calendar icon and quarter/year from POS last data refresh.
 */
export function useAudienceTargetingKpiQuarterTags(): AudienceTargetingHeaderTag[] {
  const { lastDataRefreshKpisDate } = useLastDataRefresh();
  const text = useMemo(
    () => formatDateToQuarterYear(lastDataRefreshKpisDate?.pos),
    [lastDataRefreshKpisDate],
  );

  return useMemo(
    () => [{ icon: CalendarClock, text: text ? `:${text}` : '' }],
    [text],
  );
}
