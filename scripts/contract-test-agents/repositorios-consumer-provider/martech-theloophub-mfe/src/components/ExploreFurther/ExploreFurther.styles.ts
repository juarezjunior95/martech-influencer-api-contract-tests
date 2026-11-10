import { Link } from 'react-router-dom';

import styled from '@emotion/styled';
import { Card, Heading, Paragraph } from '@hexa-ui/components';
import { ArrowRight } from '@hexa-ui/icons';
import { styled as styledHexa } from '@hexa-ui/theme';

export const exploreFurtherBasicContainerBackground = '#F9F9F9';

export const StyledExploreFurtherRoot = styled.div<{ dataTestId: string }>(
  ({ dataTestId }) => ({
    width: '100%',
    [`& [data-testid="${dataTestId}-title"]`]: {
      fontSize: '32px !important',
      fontWeight: '600 !important',
    },
    [`& [data-testid="${dataTestId}-tooltip"]  div`]: {
      width: '24px',
    },
  }),
);

export const StyledExploreFurtherBody = styledHexa('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  width: '100%',
  padding: '0 24px 24px',
});

export const StyledExploreFurtherSubtitle = styledHexa('p', {
  margin: 0,
  marginTop: '-22px',
  fontFamily: '$paragraph',
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '18px',
  color: 'rgba(20, 20, 20, 0.56)',
});

export const StyledExploreFurtherCards = styledHexa('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gridAutoFlow: 'row',
  alignItems: 'stretch',
  gap: '16px',
  width: '100%',
  minWidth: 0,
  isolation: 'isolate',

  '@media (min-width: 1440px)': {
    gap: '24px',
  },
});

const commercialResultsOuterShell = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  alignSelf: 'stretch',
  color: 'inherit',
} as const;

export const StyledCardHeaderRow = styledHexa('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '16px',
  width: '100%',
});

export const StyledCardIcon = styledHexa('span', {
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '64px',
  minHeight: '64px',
  borderRadius: '50%',
  fontFamily: '$heading',
  fontSize: '20px',
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1,

  variants: {
    tone: {
      active: {
        backgroundColor: '#141414A3',
        color: '#FFFFFF',
      },
      muted: {
        backgroundColor: '#14141429',
        color: '#8F8F8F',
      },
    },
  },

  defaultVariants: {
    tone: 'active',
  },
});

export const StyledCardTextColumn = styledHexa('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$1',
  flex: 1,
  minWidth: 0,
});

export const StyledCardTitle = styledHexa(Heading, {
  fontSize: '20px !important',
  lineHeight: '20px !important',
  margin: 0,
  fontWeight: 'bold',
  color: '#141414',

  variants: {
    muted: {
      true: {
        color: '#14141452',
      },
    },
  },
});

export const StyledCardDescription = styledHexa(Paragraph, {
  fontSize: '16px !important',
  lineHeight: '20px !important',
  color: '#1414148f !important',
  margin: 0,

  variants: {
    muted: {
      true: {
        color: '#67665F !important',
      },
    },
  },
});

export const StyledCardFooter = styledHexa('div', {
  marginTop: 'auto',
  paddingLeft: 0,
  width: '100%',
  alignSelf: 'stretch',
  boxSizing: 'border-box',
});

export const StyledCardLinkLabel = styledHexa(Paragraph, {
  fontSize: '16px !important',
  lineHeight: '20px !important',
  fontWeight: '600',
  margin: 0,
  color: '#141414',

  variants: {
    muted: {
      true: {
        color: '#BDBDBD',
      },
    },
  },
});

export const StyledCommercialResultsLinkLabel = styledHexa(
  StyledCardLinkLabel,
  {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: '#554934 !important',
    variants: {
      disabled: {
        true: {
          color: '#0000005C !important',
        },
      },
    },
  },
);

export const StyledExploreFurtherLinkArrow = styledHexa(ArrowRight, {
  flexShrink: 0,
  color: 'inherit',
  '& svg': {
    width: '16px',
    height: '16px',
  },
});

const exploreFurtherCardVariants = {
  interactive: {
    true: {
      cursor: 'pointer',
      pointerEvents: 'auto',
      backgroundColor: '#FFFFFF',
      boxShadow: '0 0 0 0.0625rem #1414141F !important',
    },
    false: {
      cursor: 'default',
      pointerEvents: 'none',
      backgroundColor: '#FAFAFA',
      boxShadow: '0 0 0 0.0625rem #14141414 !important',
    },
  },
} as const;

const exploreFurtherCardBase = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  minHeight: '176px',
  padding: '50px 16px 25px',
  backgroundColor: '#FFFFFF',

  '@media (min-width: 1440px)': {
    minHeight: '192px',
  },
} as const;

export const StyledCommercialResultsCard = styledHexa(Card, {
  ...exploreFurtherCardBase,
  flex: 'none',

  variants: exploreFurtherCardVariants,

  defaultVariants: {
    interactive: true,
  },
});

export const StyledWatchTowerBody = styledHexa('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  width: '100%',
  flex: 1,
  minHeight: 0,
});

export const StyledCommercialResultsLink = styledHexa(Link, {
  ...commercialResultsOuterShell,
  textDecoration: 'none',
  variants: {
    interactive: {
      true: {
        cursor: 'pointer',
        pointerEvents: 'auto',
      },
      false: {
        cursor: 'default',
        pointerEvents: 'none',
      },
    },
  },
});
