import { styled } from '@hexa-ui/theme';

import { createTieVariants } from '../../../../utils/tieVariants';

export const StyledCupWinnersBox = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '8px',
});

export const StyledCupWinnerItem = styled('div', {
  position: 'relative',
  width: '100%',

  variants: {
    position: {
      1: {
        order: '1',
      },
      2: {
        order: '2',
      },
      3: {
        order: '3',
      },
    },
    tieScenario: {
      'no-tie': {},
      '1st-tie-simple': {},
      '1st-tie-triple': {},
      '2nd-tie': {},
    },
    dataIndex: {
      0: {},
      1: {},
      2: {},
    },
  },
});

export const StyledCupWinnerItemContainer = styled('div', {
  position: 'relative',
  overflow: 'hidden',

  variants: {
    position: {
      1: {
        borderRadius: '8px',
        paddingBottom: '41.56%',
      },
      2: {
        borderRadius: '4px',
        paddingBottom: '23.38%',
      },
      3: {
        borderRadius: '4px',
        paddingBottom: '18.83%',
      },
    },
    ...createTieVariants({
      firstTieSimple: ['32.5%', '32.5%', '18.83%'],
      firstTieTriple: ['28%', '28%', '28%'],
      secondTie: ['41.56%', '21.1%', '21.1%'],
    }).variants,
  },

  compoundVariants: [
    ...createTieVariants({
      firstTieSimple: ['32.5%', '32.5%', '18.83%'],
      firstTieTriple: ['28%', '28%', '28%'],
      secondTie: ['41.56%', '21.1%', '21.1%'],
    }).compoundVariants,
  ],
});

export const StyledImage = styled('img', {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

export const StyledCupWinnerBoxContent = styled('div', {
  width: '100%',
  height: '100%',
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'end',
  alignItems: 'start',
  gap: '4px',
  objectFit: 'cover',
  position: 'absolute',
  background:
    ' linear-gradient(0deg, rgba(23, 23, 23, 0.24), rgba(23, 23, 23, 0.24)), linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.88) 100%)',
});

export const StyledCupWinnerCountryFlag = styled('span', {
  color: '#fff',
  fontFamily: '$heading',
  fontSize: '12px',
  lineHeight: '16px',
  fontWeight: '600',

  padding: '2px 4px',
  background: '#FFFFFF3D',
  borderRadius: '100px',
});

export const StyledCupWinnerText = styled('div', {
  color: '#fff',
  fontFamily: '$heading',
  variants: {
    position: {
      1: {
        fontSize: '20px',
      },
      2: {
        fontSize: '16px',
      },
      3: {
        fontSize: '16px',
      },
    },
  },
});

export const StyledCupWinnerTitle = styled('div', {
  width: '100%',
  fontFamily: '$heading',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  color: 'rgba(20, 20, 20, 0.56)',
});
