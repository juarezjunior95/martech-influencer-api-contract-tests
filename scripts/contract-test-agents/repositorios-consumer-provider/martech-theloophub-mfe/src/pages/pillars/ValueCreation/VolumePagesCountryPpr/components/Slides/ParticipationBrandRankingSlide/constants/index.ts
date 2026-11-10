import type { CaptionItem } from 'components';

export const PARTICIPATION_BRAND_RANKING_EXPORT_CAPTION: CaptionItem[] = [
  {
    label: 'ABI Brand',
    color: '#FDD349',
    fontWeight: 'medium',
    pointStyle: 'roundedRectangle',
    border: '#1414141F',
  },
  {
    label: 'Competitor',
    color: '#CBCAC7',
    fontWeight: 'medium',
    pointStyle: 'roundedRectangle',
    border: '#1414141F',
  },
];

export const getParticipationBrandRankingBarColors = (
  source: string[],
): string[] =>
  source
    ? source.map((s) => (s.toLowerCase() === 'comp' ? '#CBCAC7' : '#FDD349'))
    : ['#FDD349'];
