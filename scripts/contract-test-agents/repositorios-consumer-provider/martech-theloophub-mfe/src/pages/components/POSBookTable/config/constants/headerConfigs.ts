import { ColumnDefsConfig } from 'components';

export const commonHeaderConfig: ColumnDefsConfig = {
  alcohol: {
    headerClass: ['ag-header-bg-secondary-black', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#C9D1D6' },
  },
  beer: {
    headerClass: ['ag-header-bg-yellow', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F0DF78' },
  },
  core_co: {
    headerClass: ['ag-header-bg-yellow', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F0DF78' },
  },
  premium_co: {
    headerClass: ['ag-header-bg-yellow', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F0DF78' },
  },
  beyond_beer: {
    headerClass: ['ag-header-bg-orange', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#EEC879' },
  },
  spirits: {
    headerClass: ['ag-header-bg-blue', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1CFF4' },
  },
  wine: {
    headerClass: ['ag-header-bg-magenta', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F6B7D0' },
  },

  abinbev: {
    headerClass: ['ag-header-bg-orange', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#EEC879' },
  },
  abinbev_core_co: {
    headerClass: ['ag-header-bg-orange', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#EEC879' },
  },
  abinbev_premium_co: {
    headerClass: ['ag-header-bg-orange', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#EEC879' },
  },
  abi_beer: {
    headerClass: ['ag-header-bg-yellow', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F0DF78' },
  },
  heineken_co: {
    headerClass: ['ag-header-bg-green', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1E3BC' },
  },
  heineken_co_core_co: {
    headerClass: ['ag-header-bg-green', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1E3BC' },
  },
  heineken_co_premium_co: {
    headerClass: ['ag-header-bg-green', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1E3BC' },
  },
  manufacturer_0: {
    headerClass: ['ag-header-bg-secondary-black', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#C9D1D6' },
  },
  manufacturer_1: {
    headerClass: ['ag-header-bg-yellow', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F0DF78' },
  },
  manufacturer_2: {
    headerClass: ['ag-header-bg-green', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1E3BC' },
  },
  manufacturer_3: {
    headerClass: ['ag-header-bg-blue', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1CFF4' },
  },
  manufacturer_4: {
    headerClass: ['ag-header-bg-purple', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#B5BDF7' },
  },

  competitor_1: {
    headerClass: ['ag-header-bg-green', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1E3BC' },
  },
  competitor_2: {
    headerClass: ['ag-header-bg-blue', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1CFF4' },
  },
  competitor_3: {
    headerClass: ['ag-header-bg-purple', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#B5BDF7' },
  },
  other_competitors: {
    headerClass: ['ag-header-bg-blue', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1CFF4' },
  },

  total_abi: {
    headerClass: ['ag-header-bg-orange', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#EEC879' }, // ← added
  },
  total_abi_core_co: {
    // ← new entry
    headerClass: ['ag-header-bg-orange', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#EEC879' },
  },
  total_abi_premium_co: {
    // ← new entry
    headerClass: ['ag-header-bg-orange', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#EEC879' },
  },

  megabrands: {
    headerClass: ['ag-header-bg-yellow', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F0DF78' },
  },
  expansion: {
    headerClass: ['ag-header-bg-magenta', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F6B7D0' },
  },
  sustain: {
    headerClass: ['ag-header-bg-blue', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#A1CFF4' },
  },
  tail: {
    headerClass: ['ag-header-bg-purple', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#B5BDF7' },
  },
};

export const globalBrandsHeaderConfig: ColumnDefsConfig = {
  corona: {
    headerClass: ['ag-header-box-layout-yellow', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F4E89E' },
  },
  heineken: {
    headerClass: ['ag-header-box-layout-green', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#BBEBCF' },
  },
  budweiser: {
    headerClass: ['ag-header-box-layout-pink', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F9CBDD' },
  },
  michelob_ultra: {
    headerClass: ['ag-header-box-layout-blue', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#BBDCF7' },
  },
  stella_artois: {
    headerClass: ['ag-header-box-layout-orange', 'ag-header-pos-book'],
    headerComponentParams: { chartBackground: '#F3D79F' },
  },
};
