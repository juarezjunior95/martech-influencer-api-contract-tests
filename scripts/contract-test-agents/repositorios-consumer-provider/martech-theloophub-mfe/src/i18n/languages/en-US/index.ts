import MessageMap from '../../i18n.d';
import { AISummary } from './AISummary';
import { Category } from './Category';
import { ConnectionsCreativity } from './ConnectionsCreativity';
import { Consumer } from './Consumer';
import { ExploreFurther } from './ExploreFurther';
import { Innovation } from './Innovation';
import { Pillars } from './Pillars';
import { PortfolioBrand } from './PortfolioBrand';
import { Sidebar } from './Sidebar';
import { TradeExecution } from './TradeExecution';
import { ValueCreation } from './ValueCreation';

const enUS: MessageMap = {
  Pillars: {
    ...Pillars,
  },
  test: {
    translate: 'Translate',
    missing: 'Only English option available',
  },
  Category: {
    ...Category,
  },
  ConnectionsCreativity: {
    ...ConnectionsCreativity,
  },
  Consumer: {
    ...Consumer,
  },
  PortfolioBrand: {
    ...PortfolioBrand,
  },
  TradeExecution: {
    ...TradeExecution,
  },
  ValueCreation: {
    ...ValueCreation,
  },
  Innovation: {
    ...Innovation,
  },
  Sidebar: {
    ...Sidebar,
  },
  Error: {
    noRecords: 'There are no records that match the',
    filteredParameters: 'filtered parameters',
  },
  AISummary: {
    ...AISummary,
  },
  ExploreFurther: {
    ...ExploreFurther,
  },
  Label: {
    Abi: 'ABI',
    portfolio: 'Portfolio',
    deepDive: 'Deep Dive',
    competitor: 'Competitor',
    source: 'Source',
    refresh: 'Refresh',
    anaplan: 'Anaplan',
    sunlight: 'Sunlight',
    kantar: 'Kantar',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    quarter: 'Quarter',
    year: 'Year',
    brands: 'Brands',
    country: 'Country',
    brand: 'Brand',
  },
};

export default enUS;
