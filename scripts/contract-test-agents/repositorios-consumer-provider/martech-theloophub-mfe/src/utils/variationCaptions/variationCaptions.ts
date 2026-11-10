import { PORTFOLIOS_TYPES } from 'pages/constants';

const getVariationCaptionTitle = (
  chartData: any,
  portfolioType?: string,
): string => {
  const allTitles = chartData.variationCaptions
    .map((caption: any) => caption.titles)
    .find((titles: any) => titles && Object.keys(titles).length > 0);

  if (!portfolioType || !allTitles) {
    return '-';
  }

  const portfolioKey = portfolioType.toLowerCase();

  const portfolioKeyMap: Record<string, string> = {
    [PORTFOLIOS_TYPES.MEGABRANDS]: `${PORTFOLIOS_TYPES.MEGABRANDS}`,
    [PORTFOLIOS_TYPES.EXPANSION]: `${PORTFOLIOS_TYPES.EXPANSION}`,
    [PORTFOLIOS_TYPES.SUSTAIN]: `${PORTFOLIOS_TYPES.SUSTAIN}`,
    [PORTFOLIOS_TYPES.TAIL]: `${PORTFOLIOS_TYPES.TAIL}`,
  };

  const titleKey = portfolioKeyMap[portfolioKey];
  if (!titleKey) {
    return '-';
  }

  return allTitles[titleKey] || '-';
};

export const processVariationCaptions = (data: any, portfolioType?: string) => {
  if (!Array.isArray(data?.variationCaptions)) {
    return [];
  }

  return data.variationCaptions.map((line: any) => ({
    title: portfolioType
      ? getVariationCaptionTitle(data, portfolioType)
      : line.title,
    subtitle: line.subtitle,
    data: line.data.map((item) => ({
      value: item.value?.toString() || '',
      measure: item.unit_of_measure || '',
      color: item.color,
    })),
  }));
};
