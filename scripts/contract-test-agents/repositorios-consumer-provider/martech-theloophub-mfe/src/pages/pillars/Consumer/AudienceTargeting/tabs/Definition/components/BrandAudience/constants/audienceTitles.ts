export const CORE_AUDIENCE_TITLE = 'Core Audience';
export const HALO_AUDIENCE_TITLE = 'Halo Audience';

const BASE_KEY = 'Consumer.AudienceTargeting.Definition.BrandAudience';

export const AUDIENCE_TOOLTIP_KEYS: Record<
  string,
  { title: string; subtitle: string; text: string }
> = {
  [CORE_AUDIENCE_TITLE]: {
    title: `${BASE_KEY}.coreAudience.tooltip.title`,
    subtitle: `${BASE_KEY}.coreAudience.tooltip.subtitle`,
    text: `${BASE_KEY}.coreAudience.tooltip.text`,
  },
  [HALO_AUDIENCE_TITLE]: {
    title: `${BASE_KEY}.haloAudience.tooltip.title`,
    subtitle: `${BASE_KEY}.haloAudience.tooltip.subtitle`,
    text: `${BASE_KEY}.haloAudience.tooltip.text`,
  },
};
