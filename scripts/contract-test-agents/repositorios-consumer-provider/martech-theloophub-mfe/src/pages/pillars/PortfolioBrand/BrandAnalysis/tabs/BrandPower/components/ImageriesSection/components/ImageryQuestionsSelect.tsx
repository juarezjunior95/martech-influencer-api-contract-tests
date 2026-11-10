import React from 'react';

import { Select } from 'components';
import { Option } from 'models/Filters';
import { SubFilters } from 'models/SubFilters';

interface ImageryQuestionsSelectProps {
  activeSubFilters: SubFilters;
  setSubFilterValue: (subFilterKey: string, value: string) => void;
  subFiltersData: SubFilters;
  dataTestId?: string;
}

export const ImageryQuestionsSelect: React.FC<ImageryQuestionsSelectProps> = ({
  activeSubFilters,
  setSubFilterValue,
  subFiltersData,
  dataTestId,
}) => {
  const handleChange = (
    op: string | string[] | Option | Option[] | null | undefined,
  ) => {
    if (op == null) return;

    if (Array.isArray(op)) {
      if (op.length === 0) return;
      const firstValue = op[0];

      if (typeof firstValue === 'string') {
        setSubFilterValue('imagery_questions', firstValue);
        return;
      }

      const selectedFromArray =
        firstValue?.value ??
        (firstValue as { id?: string })?.id ??
        firstValue?.label;

      if (selectedFromArray === null || selectedFromArray === undefined) return;
      setSubFilterValue('imagery_questions', String(selectedFromArray));
      return;
    }

    if (typeof op === 'string') {
      setSubFilterValue('imagery_questions', op);
      return;
    }

    const selectedValue = op?.value ?? (op as { id?: string }).id ?? op?.label;

    if (selectedValue === null || selectedValue === undefined) return;
    setSubFilterValue('imagery_questions', String(selectedValue));
  };
  return (
    <Select
      value={activeSubFilters.imagery_questions}
      options={subFiltersData.imagery_questions?.values || []}
      shape="pill"
      size="medium"
      onValueChange={handleChange}
      id="imagery_questions_select"
      dataTestId={dataTestId}
    />
  );
};
