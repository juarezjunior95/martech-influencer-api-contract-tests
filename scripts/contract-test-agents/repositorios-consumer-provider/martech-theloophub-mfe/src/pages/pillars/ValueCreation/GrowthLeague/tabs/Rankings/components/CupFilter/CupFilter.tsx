import { useCallback, useEffect, useMemo, useState } from 'react';

import { SegmentedControl } from '@hexa-ui/components';
import { Select } from 'components';
import { FilterSkeleton } from 'components/SubFilter/components/FilterSkeleton/FilterSkeleton';
import { useGoogleAnalytics, useSubFilters } from 'hooks';
import { FilterValue } from 'models/Filters';
import { GL_COMPETITIONS } from 'pages/pillars/ValueCreation/GrowthLeague/constants';

import { CupFilterStyles, CupFilterStylesFit } from './CupFilter.styles';

interface Option {
  label: string;
  value: string;
  divisions?: Option[];
}

interface CupFilterProps {
  dataTestId?: string;
}

export const CupFilter: React.FC<CupFilterProps> = ({ dataTestId }) => {
  const trackGA = useGoogleAnalytics();
  const {
    activeSubFilters,
    subFiltersData,
    loadSubFilterData,
    setSubFilterValue,
    subFiltersLoaded,
  } = useSubFilters();

  const [divisions, setDivisions] = useState<Option[]>([]);

  const currentValue = useMemo(
    () => activeSubFilters[GL_COMPETITIONS] || '',
    [activeSubFilters],
  );

  const currentDivision = useMemo(
    () => activeSubFilters[`${GL_COMPETITIONS}_${currentValue}`] || '',
    [activeSubFilters, currentValue],
  );

  const filterData = useMemo(
    () => subFiltersData?.[GL_COMPETITIONS] || null,
    [subFiltersData],
  );

  const handleChange = useCallback(
    (op: Option) => {
      setSubFilterValue(GL_COMPETITIONS, op.value);
      trackGA({
        event_category: 'Sub cup',
        event_action: 'Selected',
        event_label: op.value,
      });
    },
    [setSubFilterValue, trackGA],
  );

  const handleDivisionChange = useCallback(
    (value: string) => {
      setSubFilterValue(`${GL_COMPETITIONS}_${currentValue}`, value);
      trackGA({
        event_category: 'Sub cup',
        event_action: 'Selected',
        event_label: value,
      });
    },
    [currentValue, setSubFilterValue, trackGA],
  );

  const updateDivisions = useCallback(
    (value: FilterValue) => {
      const selectedValue = filterData?.values?.find(
        (item: Option) => item.value === value,
      );

      if (selectedValue?.divisions?.length) {
        setDivisions(selectedValue.divisions);
        setSubFilterValue(
          `${GL_COMPETITIONS}_${value}`,
          selectedValue.divisions[0].value,
        );
      } else if (divisions.length > 0) {
        setDivisions([]);
        setSubFilterValue(`${GL_COMPETITIONS}_${value}`, '');
      }
    },
    [filterData, setSubFilterValue, divisions],
  );

  useEffect(() => {
    loadSubFilterData(GL_COMPETITIONS, {}, '');
  }, [loadSubFilterData]);

  useEffect(() => {
    if (currentValue) {
      updateDivisions(currentValue);
    }
  }, [currentValue, updateDivisions]);

  if (!subFiltersLoaded?.[GL_COMPETITIONS]) {
    return (
      <CupFilterStyles
        data-testid={dataTestId ? `cup-filter-${dataTestId}` : undefined}
      >
        <FilterSkeleton
          data-testid={
            dataTestId ? `cup-filter-skeleton-${dataTestId}` : undefined
          }
        />
      </CupFilterStyles>
    );
  }

  return (
    <CupFilterStyles
      data-testid={dataTestId ? `cup-filter-${dataTestId}` : undefined}
    >
      <CupFilterStylesFit
        data-testid={dataTestId ? `cup-filter-fit-${dataTestId}` : undefined}
      >
        <Select
          id="cup-filter-select"
          dataTestId={
            dataTestId ? `${dataTestId}-cup-filter-${currentValue}` : undefined
          }
          value={currentValue}
          shape="pill"
          size="medium"
          label=""
          onValueChange={handleChange}
          options={filterData?.values}
        />
      </CupFilterStylesFit>

      {divisions.length > 0 && (
        <SegmentedControl
          data-testid={
            dataTestId
              ? `${dataTestId}-cup-filter-segmented-control`
              : undefined
          }
          value={currentDivision as string}
          options={divisions}
          onValueChange={handleDivisionChange}
        />
      )}
    </CupFilterStyles>
  );
};
