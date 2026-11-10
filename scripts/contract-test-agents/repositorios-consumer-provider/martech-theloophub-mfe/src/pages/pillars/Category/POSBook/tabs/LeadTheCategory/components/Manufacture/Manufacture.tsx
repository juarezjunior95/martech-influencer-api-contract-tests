import { useMemo } from 'react';
import { IntlFormatters } from 'react-intl';

import { SubFilter } from 'components';
import { usePageFilterApplied, useSubFilters } from 'hooks';
import { POSBookTable } from 'pages/components';
import { TableHeader } from 'pages/pillars/Category/POSBook/components';
import { POS_BOOK_PAGE_NAME } from 'pages/pillars/Category/POSBook/POSBook';

import { StyledPOSContentSection } from '../../../../POSBook.styles';
import {
  PRICE_SEGMENTS_ALL_MANUFACTURE,
  PRICE_SEGMENTS_KEY_MANUFACTURE,
} from '../../constants';
import { useManufactureData } from '../../hooks/useManufactureData/useManufactureData';
import { getParticipationTableConfig } from '../../utils';

interface ManufactureProps {
  formatMessage: IntlFormatters['formatMessage'];
  lastDataRefresh: string;
  dataTestId?: string;
}

export const Manufacture: React.FC<ManufactureProps> = ({
  formatMessage,
  lastDataRefresh,
  dataTestId,
}) => {
  const { isGlobalZone } = usePageFilterApplied(POS_BOOK_PAGE_NAME);
  const { activeSubFilters } = useSubFilters();

  const priceSegment =
    activeSubFilters?.[PRICE_SEGMENTS_KEY_MANUFACTURE] ||
    PRICE_SEGMENTS_ALL_MANUFACTURE;

  const { tableData, loading } = useManufactureData();

  const title = formatMessage({
    id: `Category.POSBook.LeadTheCategory.manufacture.title`,
  });

  const tableConfig = useMemo(() => {
    return getParticipationTableConfig(isGlobalZone);
  }, [isGlobalZone]);

  return (
    <StyledPOSContentSection
      marginBottom={true}
      data-testid={dataTestId ? `section-${dataTestId}` : undefined}
    >
      <TableHeader
        title={title}
        lastDataRefresh={lastDataRefresh}
        dataTestId={dataTestId}
        filters={
          <SubFilter.Select
            apiKey="price-segments"
            stateKey={PRICE_SEGMENTS_KEY_MANUFACTURE}
            value={
              priceSegment === PRICE_SEGMENTS_ALL_MANUFACTURE
                ? ''
                : priceSegment
            }
            valueLabel={
              priceSegment === PRICE_SEGMENTS_ALL_MANUFACTURE
                ? 'Select a Price Segment'
                : 'Price Segment'
            }
            placeholder=""
            allKey={PRICE_SEGMENTS_ALL_MANUFACTURE}
            chips
          />
        }
      />

      <POSBookTable
        loading={loading}
        data={tableData}
        config={tableConfig}
        dataTestId={dataTestId}
      />
    </StyledPOSContentSection>
  );
};
