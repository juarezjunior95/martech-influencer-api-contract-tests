import { FilterConfig } from '../types';

export function exampleFilterConfig(key: string): FilterConfig {
  return {
    key,
    order: 1000,
    calculator: (filterData) => {
      const filterEntry = filterData[key as keyof typeof filterData];
      if (
        filterEntry &&
        typeof filterEntry === 'object' &&
        'default' in filterEntry
      ) {
        const defaultValue = (filterEntry as { default?: { value?: unknown } })
          .default?.value;
        if (defaultValue !== undefined) {
          return defaultValue as string | number | null;
        }
      }
      return null;
    },
    metadata: {
      displayName: key,
      description: `Example filter: ${key}`,
    },
  };
}
