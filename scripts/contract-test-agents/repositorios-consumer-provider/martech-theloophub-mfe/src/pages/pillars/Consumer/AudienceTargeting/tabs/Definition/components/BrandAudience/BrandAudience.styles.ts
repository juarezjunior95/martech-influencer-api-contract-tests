import styled from '@emotion/styled';
import { theme } from 'theme';

const BRAND_AUDIENCE_CARD_WIDTH = '396px';
const BRAND_AUDIENCE_CARD_HEIGHT = '160px';
const BRAND_AUDIENCE_INFO_ICON_SIZE = '16px';
// Not available in current theme tokens. Keep explicit value to match Figma for Halo empty state.
const HALO_EMPTY_TEXT_COLOR = '#D62222';

export const StyledAudienceGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fill, ${BRAND_AUDIENCE_CARD_WIDTH})`,
  gap: '16px',
});

export const StyledBrandAudienceCardShell = styled('div')({
  '.bigNumberCard': {
    width: BRAND_AUDIENCE_CARD_WIDTH,
    height: BRAND_AUDIENCE_CARD_HEIGHT,
    gap: '16px !important',
    margin: '0px !important',

    '&.selected': {
      borderRadius: '16px !important',
    },
  },

  '.bigNumberContainer': {
    gap: '16px !important',

    '&.selected': {
      borderRadius: '16px !important',
    },
  },

  '.noHaloAudience': {
    '> div > img': {
      width: '96px',
      height: '96px',
    },

    '> div > p': {
      color: HALO_EMPTY_TEXT_COLOR,
    },
  },
});

export const StyledCardHeaderTitleRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const StyledCardHeaderTitle = styled('span')({
  fontSize: '20px',
  fontWeight: 600,
  fontFamily: 'Inter, sans-serif',
  color: theme.colors.txt.default,
});

export const StyledCardHeaderInfoIcon = styled('span')({
  display: 'flex',
  alignItems: 'center',
  width: BRAND_AUDIENCE_INFO_ICON_SIZE,
  height: BRAND_AUDIENCE_INFO_ICON_SIZE,
  color: theme.colors.txt.secondary,
});

export const StyledCardHeaderSubtitle = styled('div')({
  fontSize: '14px',
  color: theme.colors.txt.secondary,
  marginTop: '4px',
  fontFamily: 'Inter, sans-serif',
});
