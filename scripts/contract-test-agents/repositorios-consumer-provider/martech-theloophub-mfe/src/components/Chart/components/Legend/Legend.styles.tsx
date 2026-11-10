import { Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledCaption = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  variants: {
    legendPosition: {
      center: {
        justifyContent: 'center',
      },
      left: {
        justifyContent: 'flex-start',
      },
      right: {
        justifyContent: 'flex-end',
      },
    },
    paddingRight: {
      '12': {
        paddingRight: '12px',
      },
      '20': {
        paddingRight: '20px',
      },
      '0': {
        paddingRight: '0px',
      },
    },
    captionStyle: {
      default: {
        flexWrap: 'wrap',
        width: '100%',
      },
      compact: {
        flexWrap: 'nowrap',
        width: '100%',
        // gap: '16px',
        // padding: '8px 16px',
        // backgroundColor: '$neutral100',
        // borderRadius: '8px',
        // boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    },
  },
});

export const StyledTextCaption = styled('div', {
  display: 'flex',
  alignItems: 'center',
  marginRight: '8px',
});

export const StyledText = styled(Paragraph, {
  margin: '0.7rem 1rem 0.75rem 0',
  variants: {
    fontWeight: {
      bold: {
        fontWeight: 'bold !important',
      },
      medium: {
        fontWeight: '600',
      },
    },
    font: {
      heading: {
        fontFamily: '$heading',
      },
      paragraph: {
        fontFamily: '$paragraph',
      },
    },
  },
});

export const StyledColorIndicator = styled('span', {
  content: '',
  display: 'inline-block',

  width: '16px',
  marginRight: '8px',
  variants: {
    chartType: {
      line: {
        height: '4px',
      },
      bar: {
        height: '16px',
      },
      'extended-bar': {
        height: '12px',
        width: '24px',
      },
    },
    pointStyle: {
      square: {
        borderRadius: '20%',
      },
      circle: {
        borderRadius: '50%',
      },
      triangle: {
        width: '14px',
        height: '12px',
        clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
      },
      smallLine: {
        height: '2px',
        borderRadius: '4px',
      },
      line: {
        height: '4px',
        borderRadius: '4px',
      },
      roundedRectangle: {
        borderRadius: '4px',
        width: '24px',
        height: '12px',
      },
      lineThicker: {
        height: '12px',
        width: '24px',
        borderRadius: '4px',
        marginBottom: '2px',
      },
      roundedThicker: {
        height: '12px',
        width: '24px',
        borderRadius: '8px',
        marginBottom: '2px',
      },
      rectRot: {
        width: '12px',
        height: '12px',
        transform: 'rotate(-45deg)',
      },
    },
  },
});
