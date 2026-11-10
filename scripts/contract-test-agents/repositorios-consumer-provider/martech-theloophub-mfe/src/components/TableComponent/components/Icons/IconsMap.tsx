import {
  BarChart2,
  Beer,
  BeerBottles,
  Check,
  Close,
  Info,
  Placeholder,
  Search,
  StarFilled,
  StarUnfilled,
  World,
} from '@hexa-ui/icons2';

export const ICONS_MAP = {
  BarChart2,
  barChart: BarChart2,
  kpi: BarChart2,
  Beer,
  beer: Beer,
  BeerBottles,
  beerBottles: BeerBottles,
  category: BeerBottles,
  brands: Beer,
  World,
  world: World,
  region: World,
  Check,
  check: Check,
  Close,
  close: Close,
  Search,
  search: Search,
  StarFilled,
  starFilled: StarFilled,
  StarUnfilled,
  starUnfilled: StarUnfilled,
  Info,
  info: Info,
  Placeholder,
  placeholder: Placeholder,
  empty: Placeholder,
} as const;

export const isImagePath = (value: string): boolean => {
  return (
    /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(value) || value.startsWith('http')
  );
};
