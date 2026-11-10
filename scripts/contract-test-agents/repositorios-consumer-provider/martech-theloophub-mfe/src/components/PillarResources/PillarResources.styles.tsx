import { Chip, Heading, SearchField } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';

export const StyledPillarResourcesContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  padding: '0 24px 24px 24px',
});

export const StyledPillarResourcesActions = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '8px',
});

export const StyledPillarResourcesContent = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  gap: '16px',
  flexWrap: 'wrap',
});

export const StyledNoFavoritesFound = styled(Heading, {
  width: '100%',
  padding: '$6',
  textAlign: 'center !important',
  fontFamily: '$paragraph',
  fontSize: '$3',
  color: '$neutral80',
});

export const StyledNoResultsFound = styled(Heading, {
  width: '100%',
  padding: '$6',
  textAlign: 'center !important',
  fontFamily: '$paragraph',
  fontSize: '$3',
  color: '$neutral80',
});

export const StyledPillarResourcesSearch = styled(SearchField.Root, {
  variants: {
    size: {
      medium: {
        height: '32px',
      },
    },
  },
});

export const PillarResourcesFilterButton = styled(Chip.Root, {
  padding: '$2 12px',
  height: '39px',
  marginRight: '1px',
  variants: {
    selected: {
      true: {
        outlineColor: 'rgba(0, 110, 219, 1)',
        p: {
          color: 'rgba(0, 110, 219, 1)',
        },
        svg: {
          color: 'rgba(0, 110, 219, 1)',
        },
      },
    },
  },
});

export const PillarResourcesFilterLabel = styled(Chip.Label, {
  display: 'flex',
  gap: 8,
});
