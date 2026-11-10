import { RankDataItem } from 'pages/pillars/ValueCreation/GrowthLeague/types';

export type TieScenario =
  'no-tie' | '1st-tie-simple' | '1st-tie-triple' | '2nd-tie';

export interface TieAnalysis {
  scenario: TieScenario;
  sortedRankData: RankDataItem[];
}

export const detectTieScenario = (rankData: RankDataItem[]): TieAnalysis => {
  if (!rankData || rankData.length === 0) {
    return {
      scenario: 'no-tie',
      sortedRankData: [],
    };
  }

  const top3 = rankData.slice(0, 3);

  const positionCounts = top3.reduce(
    (acc, item) => {
      const position = String(item.position);
      acc[position] = (acc[position] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const firstPositionCount = positionCounts['1'] || 0;
  const secondPositionCount = positionCounts['2'] || 0;

  let scenario: TieScenario;

  if (firstPositionCount === 3) {
    scenario = '1st-tie-triple';
  } else if (firstPositionCount === 2) {
    scenario = '1st-tie-simple';
  } else if (secondPositionCount === 2) {
    scenario = '2nd-tie';
  } else {
    scenario = 'no-tie';
  }

  const sortedRankData = sortTiedCountries(top3);

  return {
    scenario,
    sortedRankData,
  };
};

const compareCountryNames = (a: RankDataItem, b: RankDataItem): number => {
  return a.countryName.localeCompare(b.countryName);
};

export const sortTiedCountries = (rankData: RankDataItem[]): RankDataItem[] => {
  if (!rankData || rankData.length === 0) {
    return [];
  }

  const groupedByPosition = rankData.reduce(
    (acc, item) => {
      const position = String(item.position);
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(item);
      return acc;
    },
    {} as Record<string, RankDataItem[]>,
  );

  Object.keys(groupedByPosition).forEach((position) => {
    const countries = groupedByPosition[position];
    if (countries.length > 1) {
      countries.sort(compareCountryNames);
    }
  });

  const sortedData: RankDataItem[] = [];
  const positions = Object.keys(groupedByPosition).sort((a, b) =>
    a.localeCompare(b),
  );

  positions.forEach((position) => {
    sortedData.push(...groupedByPosition[position]);
  });

  return sortedData;
};

export const toDataIndex = (index: number): 0 | 1 | 2 => {
  if (index < 0 || index > 2) {
    throw new Error(`Invalid index: ${index}. Expected 0, 1, or 2.`);
  }
  return index as 0 | 1 | 2;
};
