import { Card, Heading } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledCategoryGrowthLeversCard = styled(Card, {
  display: 'flex',
  flexDirection: 'row',
  border: '1px solid #e2e2e2',
  boxShadow: 'none !important',
  width: '330px',
  height: '195px',
});

export const GrowthLeversContainer = styled('div', {
  display: 'flex',
  width: '100%',

  variants: {
    borderBottom: {
      true: {
        borderBottom: '1px solid #E5E5E5',
      },
      false: {
        borderBottom: 'none',
      },
    },

    borderRight: {
      true: {
        borderRight: '1px solid #E5E5E5',
      },
      false: {
        borderRight: 'none',
      },
    },
  },
});

export const CategoryTitle = styled(Heading, {
  fontSize: '1rem !important',
  color: '#5C5C5C !important',
  marginTop: '8px',
});

export const ImageContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '90px',
  height: '90px',
});

export const LeftContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  borderRight: '1px solid #e2e2e2',
  height: '100%',

  variants: {
    showImage: {
      true: {
        width: '160px',
      },
      false: {
        width: '200px',
      },
    },
  },

  defaultVariants: {
    showImage: true,
  },
});

export const RightContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
});
