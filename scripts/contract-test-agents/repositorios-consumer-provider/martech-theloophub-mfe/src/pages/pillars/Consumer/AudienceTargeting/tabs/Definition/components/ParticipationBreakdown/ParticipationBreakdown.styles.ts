import styled from '@emotion/styled';
import { theme } from 'theme';

import { PARTICIPATION_BREAKDOWN_BRAND_PALETTE } from './constants';

export const PARTICIPATION_BREAKDOWN_CONTENT_HEIGHT = '600px';

export const PARTICIPATION_BREAKDOWN_TABLE_TEST_ID =
  'participation-breakdown-inner-table';

const SEGMENT_TICK_COLOR = theme.colors.charts.bg.neutrals['40'];
const SEGMENT_TICK_HEIGHT = '1px';
const SEGMENT_TICK_WIDTH = '4px';

const BRAND_HEADER_TITLE_HEIGHT = '40px';
const BRAND_HEADER_SUBCOLUMNS_HEIGHT = '28px';

const buildBrandHeaderColorRules = (
  tableId: string,
  palette: readonly string[],
): string =>
  palette
    .map(
      (color, idx) => `
  [data-testid="${tableId}-header"] > div:nth-child(${idx + 3}) > div > div:first-child {
    background-color: ${color};
    border-radius: 11px 11px 0 0;
  }`,
    )
    .join('');

export const StyledOverviewContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  [data-testid*='-header-cell-'] {
    height: auto;
  }

  [data-testid*='-header-cell-'] > div:first-child {
    flex: 0 0 ${BRAND_HEADER_TITLE_HEIGHT};
    height: ${BRAND_HEADER_TITLE_HEIGHT};
  }

  [data-testid*='-header-cell-'] > div:last-child {
    flex: 0 0 ${BRAND_HEADER_SUBCOLUMNS_HEIGHT};
    height: ${BRAND_HEADER_SUBCOLUMNS_HEIGHT};
  }

  ${buildBrandHeaderColorRules(
    PARTICIPATION_BREAKDOWN_TABLE_TEST_ID,
    PARTICIPATION_BREAKDOWN_BRAND_PALETTE,
  )}

  [data-testid='${PARTICIPATION_BREAKDOWN_TABLE_TEST_ID}-body']
    [data-testid*='-cell-'] {
    border-right: none;
  }

  [data-testid$='-segment'] {
    position: relative;
  }

  [data-testid$='-segment']::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 0;
    width: ${SEGMENT_TICK_WIDTH};
    height: ${SEGMENT_TICK_HEIGHT};
    background-color: ${SEGMENT_TICK_COLOR};
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

export const StyledNoDataContainer = styled.div`
  width: 100%;
  height: ${PARTICIPATION_BREAKDOWN_CONTENT_HEIGHT};
  display: flex;
  justify-content: center;
  align-items: center;
`;
