import { RankDataItem } from '../types';
import {
  detectTieScenario,
  sortTiedCountries,
  toDataIndex,
} from './tiesDetection';

const createMockRankItem = (
  countryName: string,
  position: string | number,
  value = '100',
): RankDataItem => ({
  countryName,
  position,
  flag: `https://flags.example.com/${countryName.toLowerCase()}.png`,
  value,
  measure: 'pts',
});

describe('tiesDetection', () => {
  describe('detectTieScenario', () => {
    describe('no-tie scenarios', () => {
      it.each([
        [
          'numeric positions',
          [
            createMockRankItem('Brazil', 1),
            createMockRankItem('Argentina', 2),
            createMockRankItem('Colombia', 3),
          ] as RankDataItem[],
        ],
        [
          'string positions',
          [
            createMockRankItem('Brazil', '1'),
            createMockRankItem('Argentina', '2'),
            createMockRankItem('Colombia', '3'),
          ] as RankDataItem[],
        ],
      ])('detects no-tie for %s', (_label, rankData) => {
        const result = detectTieScenario(rankData);
        expect(result.scenario).toBe('no-tie');
        expect(result.sortedRankData).toHaveLength(3);
      });
    });

    describe('1st-tie-simple scenarios (2 items at position 1)', () => {
      const rankData: RankDataItem[] = [
        createMockRankItem('Brazil', 1),
        createMockRankItem('Argentina', 1),
        createMockRankItem('Colombia', 3),
      ];

      it('detects scenario and sorts tied countries alphabetically', () => {
        const result = detectTieScenario(rankData);

        expect(result.scenario).toBe('1st-tie-simple');
        expect(result.sortedRankData[0].countryName).toBe('Argentina');
        expect(result.sortedRankData[1].countryName).toBe('Brazil');
        expect(result.sortedRankData[2].countryName).toBe('Colombia');
      });
    });

    describe('1st-tie-triple scenarios (3 items at position 1)', () => {
      it('detects scenario and sorts all tied countries alphabetically', () => {
        const rankData: RankDataItem[] = [
          createMockRankItem('Colombia', 1),
          createMockRankItem('Brazil', 1),
          createMockRankItem('Argentina', 1),
        ];

        const result = detectTieScenario(rankData);

        expect(result.scenario).toBe('1st-tie-triple');
        expect(result.sortedRankData[0].countryName).toBe('Argentina');
        expect(result.sortedRankData[1].countryName).toBe('Brazil');
        expect(result.sortedRankData[2].countryName).toBe('Colombia');
      });
    });

    describe('2nd-tie scenarios (2 items at position 2)', () => {
      it('detects scenario and sorts tied 2nd-place countries alphabetically', () => {
        const rankData: RankDataItem[] = [
          createMockRankItem('Brazil', 1),
          createMockRankItem('Colombia', 2),
          createMockRankItem('Argentina', 2),
        ];

        const result = detectTieScenario(rankData);

        expect(result.scenario).toBe('2nd-tie');
        expect(result.sortedRankData[0].countryName).toBe('Brazil');
        expect(result.sortedRankData[1].countryName).toBe('Argentina');
        expect(result.sortedRankData[2].countryName).toBe('Colombia');
      });
    });

    describe('edge cases', () => {
      it.each([
        ['empty array', [] as RankDataItem[]],
        ['null', null as unknown as RankDataItem[]],
        ['undefined', undefined as unknown as RankDataItem[]],
      ])('returns no-tie with empty sorted data for %s', (_label, input) => {
        const result = detectTieScenario(input);
        expect(result.scenario).toBe('no-tie');
        expect(result.sortedRankData).toEqual([]);
      });

      it('handles fewer than three items', () => {
        const rankData: RankDataItem[] = [
          createMockRankItem('Brazil', 1),
          createMockRankItem('Argentina', 2),
        ];

        const result = detectTieScenario(rankData);

        expect(result.scenario).toBe('no-tie');
        expect(result.sortedRankData).toHaveLength(2);
      });

      it('only considers top three items when more are provided', () => {
        const rankData: RankDataItem[] = [
          createMockRankItem('Brazil', 1),
          createMockRankItem('Argentina', 1),
          createMockRankItem('Colombia', 3),
          createMockRankItem('Mexico', 4),
          createMockRankItem('Peru', 5),
        ];

        const result = detectTieScenario(rankData);

        expect(result.scenario).toBe('1st-tie-simple');
        expect(result.sortedRankData).toHaveLength(3);
      });
    });
  });

  describe('sortTiedCountries', () => {
    it.each([
      ['empty array', [] as RankDataItem[], []],
      ['null', null as unknown as RankDataItem[], []],
      ['undefined', undefined as unknown as RankDataItem[], []],
    ])('returns empty array for %s', (_label, input, expected) => {
      expect(sortTiedCountries(input)).toEqual(expected);
    });

    it('sorts countries at the same position alphabetically', () => {
      const rankData: RankDataItem[] = [
        createMockRankItem('Colombia', 1),
        createMockRankItem('Argentina', 1),
        createMockRankItem('Brazil', 1),
      ];

      const result = sortTiedCountries(rankData);

      expect(result[0].countryName).toBe('Argentina');
      expect(result[1].countryName).toBe('Brazil');
      expect(result[2].countryName).toBe('Colombia');
    });

    it('maintains order when countries are not tied', () => {
      const rankData: RankDataItem[] = [
        createMockRankItem('Brazil', 1),
        createMockRankItem('Argentina', 2),
        createMockRankItem('Colombia', 3),
      ];

      const result = sortTiedCountries(rankData);

      expect(result[0].countryName).toBe('Brazil');
      expect(result[1].countryName).toBe('Argentina');
      expect(result[2].countryName).toBe('Colombia');
    });

    it('sorts multiple groups of tied countries separately', () => {
      const rankData: RankDataItem[] = [
        createMockRankItem('Colombia', 1),
        createMockRankItem('Argentina', 1),
        createMockRankItem('Peru', 3),
        createMockRankItem('Mexico', 3),
      ];

      const result = sortTiedCountries(rankData);

      expect(result[0].countryName).toBe('Argentina');
      expect(result[1].countryName).toBe('Colombia');
      expect(result[2].countryName).toBe('Mexico');
      expect(result[3].countryName).toBe('Peru');
    });

    it('handles single item array', () => {
      const rankData: RankDataItem[] = [createMockRankItem('Brazil', 1)];

      const result = sortTiedCountries(rankData);

      expect(result).toHaveLength(1);
      expect(result[0].countryName).toBe('Brazil');
    });
  });

  describe('toDataIndex', () => {
    it.each([
      [0, 0],
      [1, 1],
      [2, 2],
    ])('returns %i for index %i', (index, expected) => {
      expect(toDataIndex(index)).toBe(expected);
    });

    it.each([
      [-1, 'Invalid index: -1. Expected 0, 1, or 2.'],
      [3, 'Invalid index: 3. Expected 0, 1, or 2.'],
      [100, 'Invalid index: 100. Expected 0, 1, or 2.'],
    ])('throws for invalid index %i', (index, message) => {
      expect(() => toDataIndex(index)).toThrow(message);
    });
  });
});
