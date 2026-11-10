import { useCallback, useEffect, useMemo, useState } from 'react';
import { IntlFormatters } from 'react-intl';

import { SegmentedControl } from '@hexa-ui/components';
import { SubFilter } from 'components';
import { Skeleton } from 'components/Skeleton/Skeleton';
import { usePageFilterApplied, useSubFilters } from 'hooks';
import { POSBookTable } from 'pages/components';
import { BrandRanking } from 'pages/components/BrandRanking/BrandRanking';
import { globalBrandsTableConfig } from 'pages/components/POSBookTable/config/tableConfigs/globalBrandsTableConfig';
import { TableHeader } from 'pages/pillars/Category/POSBook/components';
import { POS_BOOK_PAGE_NAME } from 'pages/pillars/Category/POSBook/POSBook';
import { StyledSectionTitle } from 'shared/Styles';

import {
  StyledPOSContentSection,
  StyledPOSHeaderContainer,
} from '../../../../POSBook.styles';
import {
  PRICE_SEGMENTS_ALL_BRAND,
  PRICE_SEGMENTS_KEY_BRAND,
  SEGMENT_OPTIONS,
  VIEW_TYPES,
} from '../../constants';
import { useBrandParticipationData } from '../../hooks/useBrandParticipationData/useBrandParticipationData';
import { getParticipationTableConfig } from '../../utils';
import { StyledBrandParticipationContent } from './BrandParticipation.styles';

interface BrandParticipationProps {
  formatMessage: IntlFormatters['formatMessage'];
  lastDataRefresh: string;
  dataTestId?: string;
}

const formatTestId = (
  base: string | undefined,
  template: string,
): string | undefined => (base ? template.replace('{}', base) : undefined);

const SkeletonLoader = ({ dataTestId }: { dataTestId?: string }) => (
  <Skeleton
    width="1290px"
    height="684px"
    length={1}
    dataTestId={formatTestId(dataTestId, 'skeleton-{}')}
  />
);

export const BrandParticipation: React.FC<BrandParticipationProps> = ({
  formatMessage,
  lastDataRefresh,
  dataTestId,
}) => {
  const [selectedView, setSelectedView] = useState('portfolio');
  const { isGlobalZone } = usePageFilterApplied(POS_BOOK_PAGE_NAME);
  const { activeSubFilters } = useSubFilters();

  const handleViewChange = useCallback((value: string) => {
    setSelectedView(value);
  }, []);

  const segmentOptions = useMemo(() => {
    return isGlobalZone
      ? SEGMENT_OPTIONS
      : SEGMENT_OPTIONS.filter(
          (item) => item.value !== VIEW_TYPES.GLOBAL_BRANDS,
        );
  }, [isGlobalZone]);

  useEffect(() => {
    if (selectedView === VIEW_TYPES.GLOBAL_BRANDS && !isGlobalZone) {
      setSelectedView(VIEW_TYPES.PORTFOLIO);
    }
  }, [selectedView, isGlobalZone]);

  const title = useMemo(() => {
    return formatMessage({
      id: `Category.POSBook.LeadTheCategory.brandParticipation.${selectedView}.title`,
    });
  }, [selectedView, formatMessage]);

  const hasPriceSegmentFilter = useMemo(() => {
    return selectedView === VIEW_TYPES.RANKINGS && !isGlobalZone;
  }, [selectedView, isGlobalZone]);

  const isCohortFilterVisible = useMemo(
    () => selectedView !== VIEW_TYPES.PORTFOLIO || isGlobalZone,
    [selectedView, isGlobalZone],
  );

  const { data: currentData, loading } =
    useBrandParticipationData(selectedView);

  const processedData = useMemo(
    () => ({
      portfolio:
        selectedView === VIEW_TYPES.PORTFOLIO ? currentData?.tableData : null,
      globalBrands:
        selectedView === VIEW_TYPES.GLOBAL_BRANDS
          ? currentData?.tableData
          : null,
      ranking:
        selectedView === VIEW_TYPES.RANKINGS ? currentData?.ranking : null,
    }),
    [selectedView, currentData],
  );

  const tableConfig = useMemo(() => {
    return getParticipationTableConfig(isGlobalZone);
  }, [isGlobalZone]);

  const cohortDisplay = useMemo(
    () =>
      activeSubFilters?.cohorts === 'All'
        ? { value: '', label: 'Select a Cohort' }
        : { value: activeSubFilters?.cohorts, label: 'Cohort' },
    [activeSubFilters],
  );

  const priceSegmentLabel = useMemo(
    () =>
      activeSubFilters?.[PRICE_SEGMENTS_KEY_BRAND] === PRICE_SEGMENTS_ALL_BRAND
        ? 'Select a Price Segment'
        : 'Price Segment',
    [activeSubFilters],
  );

  const renderContent = () => {
    switch (selectedView) {
      case 'portfolio':
        return (
          <POSBookTable
            loading={loading}
            data={processedData.portfolio}
            config={tableConfig}
            dataTestId={formatTestId(dataTestId, '{}-portfolio')}
          />
        );
      case 'rankings':
        return loading ? (
          <SkeletonLoader
            dataTestId={formatTestId(dataTestId, '{}-rankings')}
          />
        ) : (
          <BrandRanking
            ranking={processedData.ranking}
            dataTestId={formatTestId(dataTestId, '{}-rankings')}
          />
        );
      case 'global-brands':
        return loading ? (
          <SkeletonLoader
            dataTestId={formatTestId(dataTestId, '{}-global-brands')}
          />
        ) : (
          <POSBookTable
            loading={loading}
            data={processedData.globalBrands}
            config={globalBrandsTableConfig}
            groupHeaderHeight={81}
            dataTestId={formatTestId(dataTestId, '{}-global-brands')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <StyledPOSContentSection
      data-testid={formatTestId(dataTestId, 'section-{}')}
    >
      <StyledPOSHeaderContainer
        data-testid={formatTestId(dataTestId, 'header-container-{}')}
      >
        <StyledSectionTitle data-testid={formatTestId(dataTestId, 'title-{}')}>
          {formatMessage({
            id: 'Category.POSBook.LeadTheCategory.brandParticipation.title',
          })}
        </StyledSectionTitle>
        <SegmentedControl
          value={selectedView}
          defaultValue="portfolio"
          options={segmentOptions}
          onValueChange={handleViewChange}
        />
      </StyledPOSHeaderContainer>
      <StyledBrandParticipationContent
        data-testid={formatTestId(dataTestId, 'content-{}')}
      >
        <TableHeader
          title={title}
          lastDataRefresh={lastDataRefresh}
          dataTestId={dataTestId}
          filters={
            <>
              {isCohortFilterVisible && (
                <SubFilter.Select
                  apiKey="cohorts"
                  stateKey="cohorts"
                  value={cohortDisplay.value}
                  valueLabel={cohortDisplay.label}
                  placeholder=""
                  chips
                />
              )}

              {hasPriceSegmentFilter && (
                <SubFilter.Select
                  apiKey="price-segments"
                  stateKey={PRICE_SEGMENTS_KEY_BRAND}
                  valueLabel={priceSegmentLabel}
                  placeholder=""
                  allKey={PRICE_SEGMENTS_ALL_BRAND}
                  chips
                />
              )}
            </>
          }
        />
        {renderContent()}
      </StyledBrandParticipationContent>
    </StyledPOSContentSection>
  );
};
