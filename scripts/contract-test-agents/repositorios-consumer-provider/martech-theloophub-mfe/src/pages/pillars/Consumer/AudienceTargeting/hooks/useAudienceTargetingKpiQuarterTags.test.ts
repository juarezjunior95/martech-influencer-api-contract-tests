import { CalendarClock } from '@hexa-ui/icons2';
import { renderHook } from '@testing-library/react-hooks';
import { useLastDataRefresh } from 'contexts/LastDataRefresh/LastDataRefresh';

import { useAudienceTargetingKpiQuarterTags } from './useAudienceTargetingKpiQuarterTags';

const mockFormatDateToQuarterYear = jest.fn();

jest.mock('contexts/LastDataRefresh/LastDataRefresh', () => ({
  useLastDataRefresh: jest.fn(),
}));

jest.mock('utils/format', () => ({
  formatDateToQuarterYear: (...args: unknown[]) =>
    mockFormatDateToQuarterYear(...args),
}));

describe('useAudienceTargetingKpiQuarterTags', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFormatDateToQuarterYear.mockImplementation((d: Date | undefined) =>
      d ? 'Q-FORMATTED' : '',
    );
  });

  it('formats pos date and returns one tag with CalendarClock', () => {
    const posDate = new Date('2024-06-15');
    (useLastDataRefresh as jest.Mock).mockReturnValue({
      lastDataRefreshKpisDate: { pos: posDate },
    });

    const { result } = renderHook(() => useAudienceTargetingKpiQuarterTags());

    expect(mockFormatDateToQuarterYear).toHaveBeenCalledWith(posDate);
    expect(result.current).toHaveLength(1);
    expect(result.current[0].icon).toBe(CalendarClock);
    expect(result.current[0].text).toBe(':Q-FORMATTED');
  });

  it('passes undefined to formatter when pos date is missing', () => {
    (useLastDataRefresh as jest.Mock).mockReturnValue({
      lastDataRefreshKpisDate: {},
    });

    renderHook(() => useAudienceTargetingKpiQuarterTags());

    expect(mockFormatDateToQuarterYear).toHaveBeenCalledWith(undefined);
  });
});
