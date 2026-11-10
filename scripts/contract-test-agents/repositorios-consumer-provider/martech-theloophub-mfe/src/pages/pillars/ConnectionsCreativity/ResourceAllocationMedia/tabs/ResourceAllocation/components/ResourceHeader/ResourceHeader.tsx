import React from 'react';
import { IntlFormatters } from 'react-intl';

import { Heading } from '@hexa-ui/components';
import { CalendarClock } from '@hexa-ui/icons';
import { Filter } from '@hexa-ui/icons2';
import { Tag } from 'components';
import { Select } from 'components/Form';
import { useLastDataRefresh } from 'contexts';
import { FilterOption } from 'models/Filters';

import {
  FilterContainer,
  HeaderContainer,
  TitleWrapper,
} from './ResourceHeader.styles';

interface ComparisonFilterProps {
  options: FilterOption[];
  value: string[];
  onChange: (values: string[]) => void;
}

interface ResourceHeaderProps {
  formatMessage: IntlFormatters['formatMessage'];
  comparisonFilter?: ComparisonFilterProps;
  dataTestId?: string;
}

export const ResourceHeader: React.FC<ResourceHeaderProps> = ({
  formatMessage,
  comparisonFilter,
  dataTestId,
}) => {
  const { lastDataRefreshKpisFormated } = useLastDataRefresh();
  const lastDataRefresh = lastDataRefreshKpisFormated?.media;

  const hasOptions =
    !!comparisonFilter &&
    comparisonFilter.options.some((g) => g.values.length > 0);

  return (
    <HeaderContainer data-testid={dataTestId}>
      <TitleWrapper>
        <Heading
          size="H3"
          data-testid={dataTestId ? `${dataTestId}-heading` : undefined}
        >
          {formatMessage({
            id: `ConnectionsCreativity.ResourceAllocationMedia.ResourceAllocationTab.sectionTitle`,
          })}
        </Heading>
        {lastDataRefresh && (
          <Tag
            Icon={CalendarClock}
            text={`: ${lastDataRefresh}`}
            dataTestId={
              dataTestId ? `${dataTestId}-last-data-refresh-tag` : undefined
            }
          />
        )}
      </TitleWrapper>

      {comparisonFilter && (
        <FilterContainer>
          <Select
            id="comparison-filter"
            options={comparisonFilter.options}
            value={comparisonFilter.value}
            onValueChange={(val: unknown) =>
              comparisonFilter.onChange(
                Array.isArray(val)
                  ? val.map((v) => {
                      if (typeof v === 'string') return v;
                      const inner = (v as { value: unknown }).value;
                      return typeof inner === 'string'
                        ? inner
                        : JSON.stringify(inner);
                    })
                  : [],
              )
            }
            multiple
            chips
            maxChips={2}
            searchable
            showSelectAll
            selectAllLabel={formatMessage({
              id: `ConnectionsCreativity.ResourceAllocationMedia.ResourceAllocationTab.sectionComparisonSelectAllLabel`,
            })}
            allSelectedChip={formatMessage({
              id: `ConnectionsCreativity.ResourceAllocationMedia.ResourceAllocationTab.sectionComparisonAllSelectedChip`,
            })}
            icon={Filter}
            valueLabel={formatMessage({
              id: `ConnectionsCreativity.ResourceAllocationMedia.ResourceAllocationTab.sectionComparisonValueLabel`,
            })}
            shape="pill"
            disabled={!hasOptions}
            dataTestId={
              dataTestId ? `${dataTestId}-comparison-filter` : undefined
            }
          />
        </FilterContainer>
      )}
    </HeaderContainer>
  );
};
