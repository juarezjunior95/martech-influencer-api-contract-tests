import { SectionHeaderProps } from 'pages/components/SectionHeader';

const VOLUME_BAR_CHART_COLOR_CONFIG: Record<string, string> = {
  'Previous Year': '#DAC8A9',
  'Current Year': '#EBB400',
  Budget: '#99D6FF',
};

const VOLUME_BAR_CHART_LEGEND_STYLE = {
  shape: 'square' as SectionHeaderProps['legendShape'],
  size: 'small' as SectionHeaderProps['legendSize'],
};

const VOLUME_BAR_CHART_LABEL_BACKGROUND =
  VOLUME_BAR_CHART_COLOR_CONFIG['Budget'];

export {
  VOLUME_BAR_CHART_COLOR_CONFIG,
  VOLUME_BAR_CHART_LABEL_BACKGROUND,
  VOLUME_BAR_CHART_LEGEND_STYLE,
};
