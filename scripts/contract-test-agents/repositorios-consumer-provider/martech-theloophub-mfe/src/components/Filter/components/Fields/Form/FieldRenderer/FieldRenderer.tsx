import { ComponentType } from 'react';

import { FieldProps } from 'components/Filter/types';
import { usePageFilterApplied, usePageFilterForm } from 'hooks';
import { Option } from 'models/Filters';

import { AudienceTargetingBrandsCompField } from '../AudienceTargetingBrandsCompField/AudienceTargetingBrandsCompField';
import { AudienceTargetingBrandsField } from '../AudienceTargetingBrandsField/AudienceTargetingBrandsField';
import { BeerPriceSegmentField } from '../BeerPriceSegmentField/BeerPriceSegmentField';
import { BrandFilterGroupingsField } from '../BrandFilterGroupingFields/BrandFilterGroupingFields';
import { BrandsAbiField } from '../BrandsAbiField/BrandsAbiField';
import { BrandsCompField } from '../BrandsCompField/BrandsCompField';
import { BrandsField } from '../BrandsField/BrandsField';
import { CountryField } from '../CountryField/CountryField';
import { DistributionScopesField } from '../DistributionScopesField/DistributionScopesField';
import { GlobalBrandsField } from '../GlobalBrandsField/GlobalBrandsField';
import { GrowthLeversField } from '../GrowthLeversField/GrowthLeversField';
import { KPIField } from '../KPIField/KpiField';
import { PortfoliosField } from '../PortfoliosField/PortfoliosField';
import { PosPeriodsField } from '../PosPeriodsField/PosPeriodsField';
import { ProductScopeField } from '../ProductScopeField/ProductScopeField';
import { ScopesField } from '../ScopesField/ScopesField';
import { SegmentsField } from '../SegmentsField/SegmentsField';
import { SubBrandsField } from '../SubBrandsField/SubBrandsField';
import { SubScopesField } from '../SubScopesField/SubScopesField';
import { YearsField } from '../YearsField/YearsField';
import { YtdMonthField } from '../YtdMonthField/YtdMonthField';
import { ZoneField } from '../ZoneField/ZoneField';

interface FieldRendererProps {
  fieldKey: string;
  pageName: string;
  isAutoApply: boolean;
  dataTestId?: string;
  onValueChange: (fieldKey: string, option: Option) => void;
}

const FIELD_COMPONENTS: Record<string, ComponentType<FieldProps>> = {
  zone: ZoneField,
  country: CountryField,
  years: YearsField,
  segments: SegmentsField,
  product_scope: ProductScopeField,
  brands: BrandsField,
  sub_brands: SubBrandsField,
  brands_abi: BrandsAbiField,
  brands_comp: BrandsCompField,
  beer_price_segment: BeerPriceSegmentField,
  global_brands: GlobalBrandsField,
  growth_levers: GrowthLeversField,
  value_creation_growth_levers: GrowthLeversField,
  'ytd-month': YtdMonthField,
  scopes: ScopesField,
  sub_scopes: SubScopesField,
  audience_targeting_brands: AudienceTargetingBrandsField,
  audience_targeting_brands_comp: AudienceTargetingBrandsCompField,
  pos_periods: PosPeriodsField,
  distribution_scopes: DistributionScopesField,
  kpis: KPIField,
  brand_filter_groupings: BrandFilterGroupingsField,
  portfolios: PortfoliosField,
  periods: PosPeriodsField,
} as const;

export const FieldRenderer = ({
  fieldKey,
  pageName,
  isAutoApply,
  onValueChange,
  dataTestId,
}: FieldRendererProps) => {
  const { applied } = usePageFilterApplied(pageName);
  const { form } = usePageFilterForm(pageName);

  const getCurrentValue = (key: string) => {
    return isAutoApply ? applied[key] : form[key];
  };

  const FieldComponent = FIELD_COMPONENTS[fieldKey];

  if (!FieldComponent) {
    return null;
  }

  return (
    <FieldComponent
      data-testid={
        dataTestId ? `field-renderer-${fieldKey}-${dataTestId}` : undefined
      }
      fieldKey={fieldKey}
      pageName={pageName}
      onValueChange={onValueChange}
      getCurrentValue={getCurrentValue as (key: string) => string}
    />
  );
};
