// TODO: MARTLH-10573 — temporary hide requested by product team. Revert when ready.
export const TEMP_HIDE_CUP_WINNERS = true;

export const SEGMENT_OPTIONS_BESS = [
  {
    value: 'BeesCupAcceleration',
    label: 'Acceleration',
  },
  {
    value: 'BeesCupMaturity',
    label: 'Maturity',
  },
];
export const SEGMENT_OPTIONS_MEGABRANDS = [
  {
    value: 'MegabrandsCupCountry',
    label: 'Megabrands Dashboards Country',
  },
  {
    value: 'MegabrandsCupBrands',
    label: 'Megabrands Dashboards Brands',
  },
];

export const SEGMENT_OPTIONS_CHANNEL = [
  {
    value: 'KaCupLeagueA',
    label: 'League A',
  },
  {
    value: 'KaCupLeagueB',
    label: 'League B',
  },
];

export type CupKeys = {
  megaBrands: 'mega_brands_cup' | 'mega_brands_cup_country';
  bees: 'bees_cup_acceleration' | 'bees_cup_maturity';
  channel: 'ka_cup_league_a' | 'ka_cup_league_b';
  dtc: 'dtc_cup';
};

export type CupConfig = {
  key: keyof CupKeys;
  labelKeys: string[];
  options?: Array<{ label: string; value: string }>;
  getSelectValue?: (cupKey: string) => string;
};

export const CUP_KEY_MAPPING: Record<string, Partial<CupKeys>> = {
  MegabrandsCupBrands: { megaBrands: 'mega_brands_cup' },
  MegabrandsCupCountry: { megaBrands: 'mega_brands_cup_country' },
  BeesCupAcceleration: { bees: 'bees_cup_acceleration' },
  BeesCupMaturity: { bees: 'bees_cup_maturity' },
  KaCupLeagueA: { channel: 'ka_cup_league_a' },
  KaCupLeagueB: { channel: 'ka_cup_league_b' },
  DtcCup: { dtc: 'dtc_cup' },
};

export const CUPS_CONFIG: CupConfig[] = [
  {
    key: 'megaBrands',
    labelKeys: [
      'ValueCreation.GrowthLeague.CupWinners.MegabrandsDashboards',
      'ValueCreation.GrowthLeague.CupWinners.MegabrandsDashboardsCountry',
    ],
    options: SEGMENT_OPTIONS_MEGABRANDS,
    getSelectValue: (key) =>
      key === 'mega_brands_cup'
        ? 'MegabrandsCupBrands'
        : 'MegabrandsCupCountry',
  },
  {
    key: 'channel',
    labelKeys: [
      'ValueCreation.GrowthLeague.CupWinners.KaCupLeagueA',
      'ValueCreation.GrowthLeague.CupWinners.KaCupLeagueB',
    ],
    options: SEGMENT_OPTIONS_CHANNEL,
    getSelectValue: (key) =>
      key === 'ka_cup_league_a' ? 'KaCupLeagueA' : 'KaCupLeagueB',
  },
  {
    key: 'bees',
    labelKeys: [
      'ValueCreation.GrowthLeague.CupWinners.BeesCupAcceleration',
      'ValueCreation.GrowthLeague.CupWinners.BeesCupMaturity',
    ],
    options: SEGMENT_OPTIONS_BESS,
    getSelectValue: (key) =>
      key === 'bees_cup_acceleration'
        ? 'BeesCupAcceleration'
        : 'BeesCupMaturity',
  },
  {
    key: 'dtc',
    labelKeys: ['ValueCreation.GrowthLeague.CupWinners.DtcCup'],
  },
];
