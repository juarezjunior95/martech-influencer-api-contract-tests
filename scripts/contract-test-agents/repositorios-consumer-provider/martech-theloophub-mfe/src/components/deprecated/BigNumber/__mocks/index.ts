import { dataMock as headerContentMock } from 'components/HeaderContent/__mocks';

import { BigNumberData } from '../components/BigNumberContent/BigNumberContent';

export const dataMock: BigNumberData = {
  title: 'Volume',
  measure: 'Mio hl',
  tooltipContent: headerContentMock,
  bigNumber: 12345,
  bigNumberUnit: 'k',
  variation: 0,
  variationMeasure: '%',
  variationDirection: 'up',
  versus: 'vs 0000`FY',
  total: 0,
  totalMeasure: '%',
  totalLabel: 'of total value',
  period: '00/0000',
};

export const dataBigNumberVariationMock: BigNumberData = {
  title: 'Volume',
  measure: 'Mio hl',
  tooltipContent: headerContentMock,
  bigNumber: 0,
  bigNumberUnit: '%',
  bigNumberDirection: 'up',
  versus: 'vs 0000`FY',
  total: 0,
  totalMeasure: '%',
  totalLabel: 'of total value',
  period: '00/0000',
};

export const emptyDataMock = {
  title: 'Volume',
  measure: 'Mio hl',
  tooltipContent: headerContentMock,
  empty: true,
};
