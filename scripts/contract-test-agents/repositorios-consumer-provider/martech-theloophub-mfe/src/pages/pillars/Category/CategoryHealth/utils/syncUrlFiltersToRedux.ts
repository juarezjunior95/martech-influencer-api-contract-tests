import type { Dispatch } from 'redux';
import { applyFilters, resetAndApplyDefaults } from 'redux/slices/filters';

interface UrlFilterValues {
  zone: string | null;
  country: string | null;
  years: string | null;
  segments: string | null;
}

export function syncUrlFiltersToRedux(
  dispatch: Dispatch,
  applied: Record<string, any> | undefined,
  urlFilters: UrlFilterValues,
): boolean {
  const keys: Array<{ urlValue: string | null; reduxKey: string }> = [
    { urlValue: urlFilters.zone, reduxKey: 'zone' },
    { urlValue: urlFilters.country, reduxKey: 'country' },
    { urlValue: urlFilters.years, reduxKey: 'years' },
    { urlValue: urlFilters.segments, reduxKey: 'segments' },
  ];

  let needsSync = false;

  keys.forEach(({ urlValue, reduxKey }) => {
    const reduxValue = applied?.[reduxKey];
    if (
      (urlValue && urlValue !== String(reduxValue)) ||
      (!urlValue && reduxValue)
    ) {
      needsSync = true;
    }
  });

  if (needsSync) {
    const newForm = { ...applied };

    keys.forEach(({ urlValue, reduxKey }) => {
      if (urlValue) {
        newForm[reduxKey] = urlValue;
      } else if (applied?.[reduxKey]) {
        newForm[reduxKey] = null;
      }
    });

    dispatch(resetAndApplyDefaults({ form: newForm }));
    dispatch(applyFilters());
  }

  return needsSync;
}
