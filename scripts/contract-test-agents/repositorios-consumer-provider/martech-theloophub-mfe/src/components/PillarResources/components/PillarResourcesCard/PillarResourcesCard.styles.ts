import { Button, Card, Heading, Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledPillarResourcesCard = styled(Card, {
  display: 'flex',
  width: '248px',
  height: '164px',
  padding: '$4',
  justifyContent: 'space-between',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '$2',
  cursor: 'pointer',
  boxShadow: 'none',
  animation: 'all 0.5s ease',

  '@media (min-width: 1440px)': {
    width: '288px',
  },
  '@media (min-width: 1920px)': {
    width: '335px',
  },

  '&:hover': {
    border: '1px solid #F5E003',
    boxShadow: 'none',
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 40%, #E5B611 109.07%), #FFF',
  },

  variants: {
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
    },
  },
});

export const StyledCardHeader = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  gap: '12px',
});

export const StyledHeaderLeft = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
  minWidth: 0,
});

export const StyledIconContainer = styled('div', {
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  minWidth: '40px',
  borderRadius: '50%',
  backgroundColor: '#141414a3',
  flexShrink: 0,

  '@media (min-width: 1920px)': {
    display: 'flex',
  },

  variants: {
    highlighted: {
      true: {
        background: 'linear-gradient(217deg, #F5E003 0%, #D3A238 75%)',

        '& svg, & img': {
          color: '#141414',
        },
      },
      false: {},
    },
    disabled: {
      true: {
        backgroundColor: '#E0E0E0',
      },
      false: {},
    },
  },

  '& svg, & img': {
    width: '20px',
    height: '20px',
    color: '#FFFFFF',
  },
});

export const StyledTitleContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  minWidth: 0,
  flex: 1,
});

export const StyledPillarLabel = styled(Paragraph, {
  display: 'none',
  fontSize: '12px !important',
  lineHeight: '12px !important',
  color: '#1414148f !important',
  margin: 0,
  fontWeight: '400',

  '@media (min-width: 1920px)': {
    display: 'block',
  },

  variants: {
    highlighted: {
      true: {
        color: '#1414148f',
      },
      false: {},
    },
    disabled: {
      true: {
        color: '#E0E0E0',
      },
      false: {},
    },
  },
});

export const StyledToolTitle = styled(Heading, {
  fontSize: '16px !important',
  lineHeight: '20px !important',
  color: '#141414',
  margin: 0,
  fontWeight: 'bold',

  variants: {
    disabled: {
      true: {
        color: '#E0E0E0',
      },
      false: {},
    },
  },
});

export const StyledFavoriteButton = styled('button', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  minWidth: '24px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  padding: 0,
  flexShrink: 0,

  '& svg': {
    width: '20px',
    height: '20px',
    transition: 'color 150ms ease',
  },

  '&:hover svg': {
    color: '#e5b611',
  },

  variants: {
    disabled: {
      true: {
        cursor: 'not-allowed',
      },
      false: {},
    },
    isFavorite: {
      true: {
        svg: {
          color: 'rgba(229, 182, 17, 1)',
        },
      },
      false: {
        svg: {
          color: 'rgba(20, 20, 20, 1)',
        },
      },
    },
  },
});

export const StyledCardBody = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '48px',
  flex: 1,
});

export const StyledDescription = styled(Paragraph, {
  fontSize: '12px !important',
  lineHeight: '20px !important',
  color: '#1414148f !important',
  margin: 0,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
});

export const StyledCardFooter = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
  marginTop: 'auto',
});

export const StyledTagsWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '4px',
  flexWrap: 'wrap',
});

export const StyledReportButton = styled(Button, {
  borderRadius: '6px',
  padding: '8px 16px !important',
  fontSize: '14px !important',
  fontWeight: '500',
  backgroundColor: '#FFE5CC',
  color: '#D2691E',
  border: 'none',

  '&:hover': {
    backgroundColor: '#FFD9B3',
  },

  variants: {
    highlighted: {
      true: {
        backgroundColor: '#F5E003',
        color: '#D2691E',
        '&:hover': {
          backgroundColor: '#E5D003',
        },
      },
      false: {},
    },
    disabled: {
      true: {
        backgroundColor: '#F5F5F5',
        color: '#E0E0E0',
        cursor: 'not-allowed',
        pointerEvents: 'none',
      },
      false: {},
    },
  },
});

export const StyledComingSoonButton = styled(Button, {
  borderRadius: '6px',
  padding: '8px 16px !important',
  fontSize: '14px !important',
  fontWeight: '500',
  backgroundColor: '#F5F5F5',
  color: '#E0E0E0',
  border: 'none',
  cursor: 'not-allowed',
  pointerEvents: 'none',
});

export const StyledCardLink = styled('a', {
  textDecoration: 'none',
  color: 'inherit',
});

export const TagContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'fit-content',
  borderRadius: '$1',
  color: '$neutral100',
  userSelect: 'none',
  fontFamily: '$paragraph',
  fontWeight: '$normal',
  minHeight: '24px',

  svg: {
    width: '16px',
    height: '16px',
  },

  variants: {
    density: {
      default: {
        padding: '$1 $2',
        gap: '$1',
        fontSize: '$1',
        lineHeight: '0.625rem',
      },
      tight: {
        padding: '$1',
        fontSize: '0.625rem',
        lineHeight: '0.5rem',
      },
      loose: {
        gap: '$1',
        padding: '$2 0.75rem',
        fontSize: '$2',
        lineHeight: '0.75rem',
      },
    },
    color: {
      black: {
        color: 'rgba(61, 61, 61, 1)',
        backgroundColor: 'rgba(242, 242, 242, 1)',
      },
      red: {
        color: 'rgba(186, 11, 11, 1)',
        backgroundColor: 'rgba(255, 230, 230, 1)',
      },
      orange: {
        color: 'rgba(166, 89, 0, 1)',
        backgroundColor: 'rgba(255, 244, 230, 1)',
      },
      yellow: {
        color: 'rgba(135, 106, 0, 1)',
        backgroundColor: 'rgba(255, 249, 230, 1)',
      },
      lime: {
        color: 'rgba(77, 115, 0, 1)',
        backgroundColor: 'rgba(242, 249, 230, 1)',
      },
      green: {
        color: 'rgba(0, 120, 0, 1)',
        backgroundColor: 'rgba(230, 249, 230, 1)',
      },
      mint: {
        color: 'rgba(0, 122, 122, 1)',
        backgroundColor: 'rgba(230, 251, 251, 1)',
      },
      cyan: {
        color: 'rgba(0, 95, 142, 1)',
        backgroundColor: 'rgba(230, 245, 253, 1)',
      },
      purple: {
        color: 'rgba(89, 27, 157, 1)',
        backgroundColor: 'rgba(243, 235, 252, 1)',
      },
      blue: {
        color: 'rgba(0, 90, 181, 1)',
        backgroundColor: 'rgba(230, 242, 255, 1)',
      },
      pink: {
        color: 'rgba(153, 0, 77, 1)',
        backgroundColor: 'rgba(255, 230, 242, 1)',
      },
      magenta: {
        color: 'rgba(137, 38, 54, 1)',
        backgroundColor: 'rgba(253, 230, 235, 1)',
      },
      brown: {
        color: 'rgba(102, 83, 57, 1)',
        backgroundColor: 'rgba(242, 237, 230, 1)',
      },
    },
    clickable: {
      true: {
        cursor: 'pointer',
        border: 'none',
      },
    },
    onColor: {
      true: {
        transition: 'all 0.5s ease',
        backgroundColor: '$neutral0',
        border: 'none',
      },
    },
  },
  compoundVariants: [
    {
      color: 'black',
      clickable: true,
      css: {
        border: '1px solid rgba(88, 88, 88, 1)',
      },
    },
    {
      color: 'black',
      onColor: true,
      css: {
        color: 'rgba(88, 88, 88, 1)',
      },
    },
    {
      color: 'red',
      clickable: true,
      css: {
        border: '1px solid rgba(232, 39, 39, 1)',
      },
    },
    {
      color: 'red',
      onColor: true,
      css: {
        color: 'rgba(232, 39, 39, 1)',
      },
    },
    {
      color: 'orange',
      clickable: true,
      css: {
        border: '1px solid rgba(212, 115, 0, 1)',
      },
    },
    {
      color: 'orange',
      onColor: true,
      css: {
        color: 'rgba(212, 115, 0, 1)',
      },
    },
    {
      color: 'yellow',
      clickable: true,
      css: {
        border: '1px solid rgba(176, 136, 0, 1)',
      },
    },
    {
      color: 'yellow',
      onColor: true,
      css: {
        color: 'rgba(176, 136, 0, 1)',
      },
    },
    {
      color: 'lime',
      clickable: true,
      css: {
        border: '1px solid rgba(102, 153, 0, 1)',
      },
    },
    {
      color: 'lime',
      onColor: true,
      css: {
        color: 'rgba(102, 153, 0, 1)',
      },
    },
    {
      color: 'green',
      clickable: true,
      css: {
        border: '1px solid rgba(0, 153, 0, 1)',
      },
    },
    {
      color: 'mint',
      clickable: true,
      css: {
        border: '1px solid rgba(0, 156, 156, 1)',
      },
    },
    {
      color: 'mint',
      onColor: true,
      css: {
        color: 'rgba(0, 156, 156, 1)',
      },
    },
    {
      color: 'cyan',
      clickable: true,
      css: {
        border: '1px solid rgba(0, 134, 201, 1)',
      },
    },
    {
      color: 'cyan',
      onColor: true,
      css: {
        color: 'rgba(0, 134, 201, 1)',
      },
    },
    {
      color: 'purple',
      clickable: true,
      css: {
        border: '1px solid rgba(106, 33, 180, 1)',
      },
    },
    {
      color: 'purple',
      onColor: true,
      css: {
        color: 'rgba(106, 33, 180, 1)',
      },
    },
    {
      color: 'blue',
      clickable: true,
      css: {
        border: '1px solid rgba(0, 110, 219, 1)',
      },
    },
    {
      color: 'blue',
      onColor: true,
      css: {
        color: 'rgba(0, 110, 219, 1)',
      },
    },
    {
      color: 'pink',
      clickable: true,
      css: {
        border: '1px solid rgba(217, 0, 108, 1)',
      },
    },
    {
      color: 'pink',
      onColor: true,
      css: {
        color: 'rgba(217, 0, 108, 1)',
      },
    },
    {
      color: 'magenta',
      clickable: true,
      css: {
        border: '1px solid rgba(199, 55, 84, 1)',
      },
    },
    {
      color: 'magenta',
      onColor: true,
      css: {
        color: 'rgba(199, 55, 84, 1)',
      },
    },
    {
      color: 'brown',
      clickable: true,
      css: {
        border: '1px solid rgba(129, 105, 75, 1)',
      },
    },
    {
      color: 'brown',
      onColor: true,
      css: {
        color: 'rgba(129, 105, 75, 1)',
      },
    },
  ],
});
