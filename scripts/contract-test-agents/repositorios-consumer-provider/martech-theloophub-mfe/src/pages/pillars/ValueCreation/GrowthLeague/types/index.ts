import { TableDataType } from 'components/Table/types';

export interface RankDataItem {
  countryName: string;
  position: string | number;
  flag: string;
  value: string;
  measure: string;
  brand?: string;
}

export interface RankData {
  label: string;
  rank: RankDataItem[];
}

export type JsonataFormatterType = {
  table: TableDataType;
};

export type Position3 = '1' | '2' | '3';
export type Position5 = '1' | '2' | '3' | '4' | '5';

export type LeagueType = 'premier-league' | 'super-league';

export type LeagueChampionsType = {
  leagueChampions: RankData[];
};
export type LeagueLeaderboardType = Record<LeagueType, RankData>;

export type CupType =
  | 'bees_cup_acceleration'
  | 'bees_cup_maturity'
  | 'ka_cup_league_a'
  | 'ka_cup_league_b'
  | 'dtc_cup'
  | 'mega_brands_cup'
  | 'mega_brands_cup_country';

export type CupWinnersType = Record<CupType, RankData>;
export type CupWinnersLabel = Record<CupType, string>;
