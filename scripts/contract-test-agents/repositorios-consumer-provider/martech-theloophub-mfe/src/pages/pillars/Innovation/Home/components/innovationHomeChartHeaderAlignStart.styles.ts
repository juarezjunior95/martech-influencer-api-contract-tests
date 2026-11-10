import { styled } from '@hexa-ui/theme';

export const INNOVATION_HOME_CHART_HEADER_ALIGN_START_CLASS =
  'innovation-home-chart-header-align-start';

export const StyledInnovationChartHeaderAlignStart = styled('div', {
  width: '100%',
  minWidth: 0,
  alignSelf: 'stretch',
  boxSizing: 'border-box',

  '& [data-testid$="-chart-header-content"] > div:first-of-type': {
    alignItems: 'flex-start !important',
  },

  '& [data-testid$="-chart-header-title"]': {
    textAlign: 'left',
  },

  '& [data-testid$="-chart-header-measure"]': {
    textAlign: 'left',
  },
});
