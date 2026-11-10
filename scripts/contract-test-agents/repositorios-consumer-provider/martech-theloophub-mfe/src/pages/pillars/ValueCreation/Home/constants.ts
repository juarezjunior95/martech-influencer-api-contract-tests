import BalancedChoicesImage from 'assets/img/GrowthLevers/balanced_choices.png';
import BeyondBeerImage from 'assets/img/GrowthLevers/beyond_beer.png';
import LeadPremiumImage from 'assets/img/GrowthLevers/lead_premium.png';
import SuperiorCoreImage from 'assets/img/GrowthLevers/superior_core.png';

export interface Kpi {
  kpi: string;
}

export const KPIS: Record<string, Kpi> = {
  volume: {
    kpi: 'volume',
  },
  netRevenue: {
    kpi: 'nr',
  },
  cores: {
    kpi: 'cores',
  },
  marketShare: {
    kpi: 'market_share',
  },
  brandPower: {
    kpi: 'power',
  },
};

export const IMAGES = {
  superiorCore: SuperiorCoreImage,
  leadPremium: LeadPremiumImage,
  balancedChoices: BalancedChoicesImage,
  beyondBeer: BeyondBeerImage,
};

export const TOOLTIP_IDS: Record<string, string> = {
  volume: 'ValueCreation.Home.tooltips.volume',
  netRevenue: 'ValueCreation.Home.tooltips.netRevenue',
  cores: 'ValueCreation.Home.tooltips.cores',
  marketShare: 'ValueCreation.Home.tooltips.marketShare',
  brandPower: 'ValueCreation.Home.tooltips.brandPower',
  'ABI Lovers': 'ValueCreation.Home.tooltips.abiLovers',
  Occasions: 'ValueCreation.Home.tooltips.occasions',
  'LDA-24 Participation': 'ValueCreation.Home.tooltips.lda24Participation',
  leadPremium: 'ValueCreation.Home.tooltips.leadPremium',
  superiorCore: 'ValueCreation.Home.tooltips.superiorCore',
  balancedChoices: 'ValueCreation.Home.tooltips.balancedChoices',
  beyondBeer: 'ValueCreation.Home.tooltips.beyondBeer',
};
