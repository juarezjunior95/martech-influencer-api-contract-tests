import { styled } from '@hexa-ui/theme';

export const BrandRankingContainer = styled('div', {
  width: '1290px',
  display: 'grid',
  gap: '24px',

  variants: {
    marginBottom: {
      true: {
        marginBottom: '48px',
      },
      false: {
        marginBottom: '0px',
      },
    },

    isExport: {
      true: {
        width: '100%',
      },
    },
  },
});
