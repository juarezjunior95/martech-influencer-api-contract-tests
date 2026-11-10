import type { ValueCreationGrowthLeverOption } from "@domain/config/presets/value-creation/value-creation.types";

/** Mirrors Drupal `ValueCreation::SUPERIOR_CORE` and siblings. */
export const VALUE_CREATION_SUPERIOR_CORE = "Superior Core";
export const VALUE_CREATION_LEAD_PREMIUN = "Lead Premium";
export const VALUE_CREATION_BALANCED_CHOICES = "Balanced Choices";
export const VALUE_CREATION_BEYOND_BEER = "Beyond Beer";

export const VALUE_CREATION_GROWTH_LEVERS_TEMPLATE: ValueCreationGrowthLeverOption[] =
  [
    {
      label: VALUE_CREATION_SUPERIOR_CORE,
      value: VALUE_CREATION_SUPERIOR_CORE,
      disabled: true,
    },
    {
      label: VALUE_CREATION_LEAD_PREMIUN,
      value: VALUE_CREATION_LEAD_PREMIUN,
      disabled: true,
    },
    {
      label: VALUE_CREATION_BALANCED_CHOICES,
      value: VALUE_CREATION_BALANCED_CHOICES,
      disabled: true,
    },
    {
      label: VALUE_CREATION_BEYOND_BEER,
      value: VALUE_CREATION_BEYOND_BEER,
      disabled: true,
    },
  ];

export const VALUE_CREATION_GEO_EUR = "EUR";
export const VALUE_CREATION_GEO_ABI = "ABI";

/**
 * Static geo rows — same structure as Drupal `ValueCreation::GEO_MAPPING`.
 */
export const VALUE_CREATION_GEO_MAPPING: Record<
  string,
  Record<
    string,
    {
      label: string;
      quick_filter_label: string;
      zone: string;
      value: string;
      growth_levers: ValueCreationGrowthLeverOption[];
    }
  >
> = {
  [VALUE_CREATION_GEO_ABI]: {
    [VALUE_CREATION_GEO_ABI]: {
      label: "All",
      quick_filter_label: "Global",
      zone: VALUE_CREATION_GEO_ABI,
      value: VALUE_CREATION_GEO_ABI,
      growth_levers: VALUE_CREATION_GROWTH_LEVERS_TEMPLATE.map((g) => ({
        ...g,
      })),
    },
  },
  [VALUE_CREATION_GEO_EUR]: {
    [VALUE_CREATION_GEO_ABI]: {
      label: "All",
      quick_filter_label: "Europe",
      zone: VALUE_CREATION_GEO_EUR,
      value: VALUE_CREATION_GEO_ABI,
      growth_levers: VALUE_CREATION_GROWTH_LEVERS_TEMPLATE.map((g) => ({
        ...g,
      })),
    },
  },
};

export function cloneGrowthLeverTemplate(): ValueCreationGrowthLeverOption[] {
  return VALUE_CREATION_GROWTH_LEVERS_TEMPLATE.map((g) => ({ ...g }));
}
