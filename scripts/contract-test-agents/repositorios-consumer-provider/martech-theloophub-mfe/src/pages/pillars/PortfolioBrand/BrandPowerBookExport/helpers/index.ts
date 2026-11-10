export const getInsightsByPath = (obj: any, path: string): any => {
  if (!obj || !path) return undefined;

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return result;
};

export const normalizeInsightsToArray = (
  insights: string | string[] | undefined,
): string[] => {
  if (!insights) return [];
  return Array.isArray(insights) ? insights : [insights];
};

export const getInsightsArrayByPath = (obj: any, path: string): string[] => {
  const insights = getInsightsByPath(obj, path);
  return normalizeInsightsToArray(insights);
};

export { resolveHeightAfterAlerts } from 'pages/components/PortfolioBrand/helpers';
