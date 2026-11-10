export const GL_COMPETITIONS = 'gl-competitions';

export const LEAGUE_OPTIONS = [
  { value: 'super-league', id: 'ValueCreation.GrowthLeague.leagues.super' },
  { value: 'premier-league', id: 'ValueCreation.GrowthLeague.leagues.premier' },
];

export const TABLE_WIDTHS = {
  // Leaderboard | Total | Hero (4 KPIs) | Enabler (3 KPIs) | Performance (10 KPIs)
  'super-league': ['322px', '125px', '500px', '375px', '1250px'],
  'premier-league': ['322px', '125px', '500px', '375px', '1250px'],

  megabrands_cup_country: ['322px', '935px'],
  megabrands_cup_brand: ['520px', '935px'],
  channels_cup_league_a: ['322px', '935px'],
  channels_cup_league_b: ['322px', '935px'],
  bees_cup_acceleration_index: ['322px', '1500px'],
  bees_cup_maturity_index: ['322px', '2900px'],
  dtc_cup: ['322px', '935px'],
};
