import { styled } from '@hexa-ui/theme';

export const StyledFlagsBox = styled('div', {
  width: '100%',
  display: 'flex',
  paddingTop: '48px',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
});

export const StyledFlaItem = styled('div', {
  position: 'relative',

  variants: {
    position: {
      1: {
        width: 'calc(43.44% - 10.67px)',
        borderRadius: '8px',
        order: '2',
        padding: '1px',
        background:
          'linear-gradient(317.35deg, #FFEA00 -12.35%, #D3A238 105.27%)',
      },
      2: {
        width: 'calc(28.28% - 10.67px)',
        borderRadius: '8px',
        order: '1',
        padding: '1px',
        background: 'rgba(20, 20, 20, 0.12)',
      },
      3: {
        width: 'calc(28.28% - 10.67px)',
        order: '3',
        borderRadius: '8px',
        padding: '1px',
        background: 'rgba(20, 20, 20, 0.12)',
      },
    },
  },
});

export const StyledFlagItemContainer = styled('div', {
  position: 'relative',
  overflow: 'hidden',

  variants: {
    position: {
      1: {
        borderRadius: '8px',
        paddingBottom: '52.59%',
      },
      2: {
        borderRadius: '8px',
        paddingBottom: '58.07%',
      },
      3: {
        borderRadius: '8px',
        paddingBottom: '45.89%',
      },
    },
  },
});

export const StyledFlagText = styled('div', {
  color: '#fff',
  fontFamily: '$heading',
  variants: {
    position: {
      1: {
        fontSize: '40px',
      },
      2: {
        fontSize: '24px',
      },
      3: {
        fontSize: '24px',
      },
    },
  },
});

export const StyledImage = styled('img', {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

export const StyledBoxContent = styled('div', {
  width: '100%',
  height: '100%',
  padding: '32px 24px',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  objectFit: 'cover',
  position: 'absolute',
  background:
    'linear-gradient(0deg, rgba(23, 23, 23, 0.24), rgba(23, 23, 23, 0.24)), linear-gradient(180deg, rgba(0, 0, 0, 0) -7.96%, #000000 129.96%)',
});
