import { Card, Chip, Paragraph } from '@hexa-ui/components';
import { Icon } from '@hexa-ui/components2';
import { styled } from '@hexa-ui/theme';

export const StyledHeaderContainer = styled(Card, {
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 16px -8px rgba(20, 20, 20, 0.16) !important',
  padding: '16px',

  variants: {
    float: {
      true: {},
      false: {
        borderBottomLeftRadius: '0',
        borderBottomRightRadius: '0',
      },
    },
    inline: {
      true: {
        backgroundColor: 'transparent',
        boxShadow: 'none !important',
        padding: '0',
      },
      false: {},
    },
  },
});

export const StyledTitle = styled('p', {
  fontWeight: '600',
  fontFamily: '$heading',
  color: '#141414',
  margin: 0,
  variants: {
    size: {
      large: {
        fontSize: '20px',
        lineHeight: '20px',
      },
      small: {
        fontSize: '16px',
        lineHeight: '16px',
      },
      xxsmall: {
        fontSize: '12px',
        lineHeight: '12px',
      },
    },
  },
});

export const StyledHeaderContent = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  position: 'relative',
});

export const StyledRowContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',

  variants: {
    inline: {
      true: {
        alignItems: 'baseline',
        width: '100%',
      },
      false: {
        alignItems: 'center',
      },
    },
  },
});

export const StyledContentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',

  variants: {
    inline: {
      true: {
        alignItems: 'center',
      },
      false: {
        alignItems: 'flex-start',
      },
    },
    isVerticalInline: {
      true: {
        width: '100%',
      },
      false: {},
    },
  },
});

export const StyledActionsContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginLeft: '16px',
  gap: '16px',
});

export const StyledTitleContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',

  variants: {
    vertical: {
      true: {
        flexDirection: 'column',
      },
      false: {
        flexDirection: 'row',
      },
    },
  },
});

export const MeasureText = styled(Paragraph, {
  color: '#5C5C5C !important',
  marginLeft: '4px',
  whiteSpace: 'nowrap',

  variants: {
    isVertical: {
      true: {
        margin: '4px 0',
      },
      false: {},
    },
  },
});

export const DescriptionText = styled(Paragraph, {
  color: '#5C5C5C !important',
  marginTop: '8px',
});

export const StyledIconInfo = styled(Icon, {
  color: '#5C5C5C !important',
  marginLeft: '4px',
});

export const StyledChipRoot = styled(Chip.Root, {
  height: '14px !important',
  padding: '6px !important',
  marginTop: '8px',
  backgroundColor: '#FFFFFF !important',

  variants: {
    noMargin: {
      true: {
        marginTop: '0',
      },
      false: {},
    },
  },
});

export const StyledChipLabel = styled(Chip.Label, {
  color: '#5C5C5C !important',
  fontSize: '10px !important',
});

export const StyledTopRightChipRoot = styled(Chip.Root, {
  height: '14px !important',
  padding: '6px !important',
  position: 'absolute',
  top: '0',
  right: '0',
  backgroundColor: '#FFFFFF !important',
});
