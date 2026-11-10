import { ColumnDefsConfig } from 'components';
import {
  combineCellClasses,
  customCohortCellClass,
  customCountryCellClass,
} from 'pages/components/POSBookTable/config/utils';

export const cohortExportTableConfig: ColumnDefsConfig = {
  alcohol: {
    headerClass: [
      'ag-header-bg-export-gray',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#CBCAC7'] },
  },
  beer: {
    headerClass: [
      'ag-header-bg-export-yellow',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#FDD349'] },
  },
  beyond_beer: {
    headerClass: [
      'ag-header-bg-export-blue',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#A8E0FF'] },
  },
  spirits: {
    headerClass: [
      'ag-header-bg-export-brown',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#DAC8A9'] },
  },
  wine: {
    headerClass: [
      'ag-header-bg-export-orange',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#FFBA8F'] },
  },

  label: {
    maxWidth: 130,
    cellClass: (params) => combineCellClasses(params, customCohortCellClass),
    headerComponentParams: { merge: true },
  },
};

export const globalParticipationExportTableConfig: ColumnDefsConfig = {
  alcohol: {
    headerClass: [
      'ag-header-bg-export-gray',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#CBCAC7'] },
  },
  beer: {
    headerClass: [
      'ag-header-bg-export-yellow',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#FDD349'] },
  },
  abinbev: {
    headerClass: [
      'ag-header-bg-export-blue',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#A8E0FF'] },
  },
  heineken_co: {
    headerClass: [
      'ag-header-bg-export-brown',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#DAC8A9'] },
  },
  other_competitors: {
    headerClass: [
      'ag-header-bg-export-orange',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#FFBA8F'] },
  },

  label: {
    maxWidth: 64,
    cellClass: (params) => combineCellClasses(params, customCountryCellClass),
    headerComponentParams: { merge: true },
  },
  country: {
    maxWidth: 54,
    cellClass: (params) => combineCellClasses(params, customCountryCellClass),
  },
};

export const countryParticipationExportTableConfig: ColumnDefsConfig = {
  manufacturer_0: {
    headerClass: [
      'ag-header-bg-export-gray',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#CBCAC7'] },
  },
  manufacturer_1: {
    headerClass: [
      'ag-header-bg-export-yellow',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#FDD349'] },
  },
  manufacturer_2: {
    headerClass: [
      'ag-header-bg-export-blue',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#A8E0FF'] },
  },
  manufacturer_3: {
    headerClass: [
      'ag-header-bg-export-brown',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#DAC8A9'] },
  },
  manufacturer_4: {
    headerClass: [
      'ag-header-bg-export-orange',
      'ag-header-pos-book',
      'bold-text',
    ],
    headerComponentParams: { chartBackground: ['#FFBA8F'] },
  },

  label: {
    maxWidth: 144,
    cellClass: (params) => combineCellClasses(params, customCohortCellClass),
    headerComponentParams: { merge: true },
  },
  beer: {
    headerClass: ['ag-header-bg-secondary-black', 'ag-header-pos-book'],
  },
};
