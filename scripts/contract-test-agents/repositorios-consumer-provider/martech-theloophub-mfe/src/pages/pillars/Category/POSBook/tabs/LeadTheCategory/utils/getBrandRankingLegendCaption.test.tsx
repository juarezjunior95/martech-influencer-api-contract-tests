import type { CaptionItem } from 'components';
import type { RankedContainerData } from 'pages/components/BrandRanking/types';

import { COMPETITOR_LEGEND_LABEL } from '../constants';
import { getBrandRankingLegendCaption } from './getBrandRankingLegendCaption';

const baseCaption: CaptionItem[] = [
  {
    label: 'ABI Brand',
    color: '#E8D19D',
    fontWeight: 'medium',
    pointStyle: 'roundedRectangle',
    border: '#1414141F',
  },
  {
    label: COMPETITOR_LEGEND_LABEL,
    color: '#C0D1DC',
    fontWeight: 'medium',
    pointStyle: 'roundedRectangle',
    border: '#1414141F',
  },
];

const rankingWithSourceAtIndex2 = (
  source: string[] | undefined,
): RankedContainerData =>
  ({
    labels: [
      ['A', 'a'],
      ['B', 'b'],
    ],
    datasets: [
      { data: [1, 2], source: ['abi', 'abi'], unitMeasure: ['%', '%'] },
      { data: [1, 2], unitMeasure: ['%', '%'], source: ['abi', 'abi'] },
      {
        data: [1, 2],
        source: source ?? ['abi', 'comp'],
        unitMeasure: ['%', '%'],
      },
    ],
  }) as RankedContainerData;

describe('getBrandRankingLegendCaption', () => {
  it('returns full caption when datasets[2].source contains comp (lowercase)', () => {
    const ranking = rankingWithSourceAtIndex2(['abi', 'comp']);
    expect(getBrandRankingLegendCaption(ranking, baseCaption)).toEqual(
      baseCaption,
    );
  });

  it('treats COMP as competitor (case-insensitive)', () => {
    const ranking = rankingWithSourceAtIndex2(['abi', 'COMP']);
    expect(getBrandRankingLegendCaption(ranking, baseCaption)).toEqual(
      baseCaption,
    );
  });

  it('removes Competitor caption when no comp segment in source', () => {
    const ranking = rankingWithSourceAtIndex2(['abi', 'abi']);
    const out = getBrandRankingLegendCaption(ranking, baseCaption);
    expect(out).toHaveLength(1);
    expect(out[0].label).toBe('ABI Brand');
  });

  it('removes Competitor when datasets is empty', () => {
    const ranking: RankedContainerData = {
      labels: [],
      datasets: [],
    };
    const out = getBrandRankingLegendCaption(ranking, baseCaption);
    expect(out).toHaveLength(1);
    expect(out[0].label).toBe('ABI Brand');
  });

  it('removes Competitor when datasets has fewer than 3 entries (no datasets[2])', () => {
    const ranking: RankedContainerData = {
      labels: [['A', 'a']],
      datasets: [
        { data: [1], source: ['comp'], unitMeasure: ['%'] },
        { data: [1], unitMeasure: ['%'], source: ['comp'] },
      ],
    };
    const out = getBrandRankingLegendCaption(ranking, baseCaption);
    expect(out).toHaveLength(1);
  });

  it('removes Competitor when datasets[2] exists but source is missing', () => {
    const ranking: RankedContainerData = {
      labels: [['A', 'a']],
      datasets: [
        { data: [1], source: ['comp'], unitMeasure: ['%'] },
        { data: [1], unitMeasure: ['%'], source: ['comp'] },
        { data: [1], unitMeasure: ['%'] } as RankedContainerData['datasets'][0],
      ],
    };
    const out = getBrandRankingLegendCaption(ranking, baseCaption);
    expect(out).toHaveLength(1);
  });

  it('does not treat non-comp strings as competitor', () => {
    const ranking = rankingWithSourceAtIndex2(['abi', 'complete']);
    const out = getBrandRankingLegendCaption(ranking, baseCaption);
    expect(out).toHaveLength(1);
  });
});
