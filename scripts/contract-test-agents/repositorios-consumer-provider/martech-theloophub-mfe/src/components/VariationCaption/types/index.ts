export interface VariationValue {
  value: string;
  unit_of_measure: string;
  color?: string;
}

export type VariationValueData = VariationValue | VariationValue[];

export interface VariationCaptionData {
  title: string;
  subtitle: string;
  label?: string;
  data: VariationValueData[];
}
