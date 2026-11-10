import { BigNumberData } from 'components/deprecated';

export const powerVsLqMock: BigNumberData = {
  title: 'Power vs LQ',
  bigNumber: 2.0,
  bigNumberUnit: 'pp',
  bigNumberDirection: 'up', // up or down, can be by color, but need to change on other pages
  versus: 'vs Q4`24',
  total: 53.4,
  totalPrefix: '#:',
  totalMeasure: '[%]',
  dateRefresh: "Q1'25",
};

export const powerVsLyMock: BigNumberData = {
  title: 'Power vs LY',
  bigNumber: 0.4,
  bigNumberUnit: 'pp',
  bigNumberDirection: 'up',
  versus: 'vs Q1`24',
  total: 53.4,
  totalPrefix: '#:',
  totalMeasure: '[%]',
  dateRefresh: "Q1'25",
};

export const emptyBigNumbersMock: BigNumberData = {
  title: 'Power vs LQ',
  empty: true,
};
