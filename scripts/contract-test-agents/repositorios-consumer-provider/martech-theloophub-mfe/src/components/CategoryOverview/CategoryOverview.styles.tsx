import { Card, Paragraph } from '@hexa-ui/components';
import { styled } from '@hexa-ui/theme';
import tokens from '@hexa-ui/tokens/dist/json/nested.json';
import BalancedChoices from 'assets/img/CategoryOverview/balanced_choices.png';
import BeerParticipation from 'assets/img/CategoryOverview/beer_participation.png';
import BeyondBeer from 'assets/img/CategoryOverview/beyond_beer.png';
import SuperiorCore from 'assets/img/CategoryOverview/core_superiority.png';
import LeadPremium from 'assets/img/CategoryOverview/lead_premium.png';
import { theme } from 'theme';

export const StyledCard = styled(Card, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  padding: '18px 16px 16px',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  variants: {
    width: {
      243: {
        width: '243px',
      },
      311: {
        width: '311px',
        paddingLeft: '36px',
      },
    },
  },
});

export const StyledHeader = styled('div', {
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
  gap: '6px',
});

export const StyledHeadline = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const StyledMainContent = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
});

export const StyledImage = styled('div', {
  minWidth: tokens.measure.dimension.multiplier[20],
  minHeight: tokens.measure.dimension.multiplier[20],
  margin: '0 auto',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  variants: {
    backgroundImage: {
      BeerParticipation: {
        backgroundImage: `url(${BeerParticipation})`,
      },
      BeyondBeer: {
        backgroundImage: `url(${BeyondBeer})`,
      },
      SuperiorCore: {
        backgroundImage: `url(${SuperiorCore})`,
      },
      BalancedChoices: {
        backgroundImage: `url(${BalancedChoices})`,
      },
      LeadPremium: {
        backgroundImage: `url(${LeadPremium})`,
      },
    },
  },
});

export const StyledIndicatorTitle = styled(Paragraph, {
  fontSize: '12px !important',
});

export const StyledNumbersInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const StyledDetailedInfo = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const StyledNumber = styled(Paragraph, {
  '&.up': {
    color: theme.colors.charts.txt.status.increase,
  },
  '&.down': {
    color: theme.colors.charts.txt.status.decrease,
  },

  variants: {
    color: {
      up: {
        color: theme.colors.charts.txt.status.increase,
      },
      down: {
        color: theme.colors.charts.txt.status.decrease,
      },
    },
  },
});
