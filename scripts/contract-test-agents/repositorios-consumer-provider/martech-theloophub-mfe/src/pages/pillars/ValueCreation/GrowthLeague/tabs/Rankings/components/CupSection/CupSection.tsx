import { useMemo } from 'react';

import { TableDataType } from 'components/Table/types';
import { useSubFilters } from 'hooks';
import { FilterValue } from 'models/Filters';
import { GL_COMPETITIONS } from 'pages/pillars/ValueCreation/GrowthLeague/constants';
import { StyledSection } from 'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles';
import { ContainerWithScroll } from 'utils/container';

import { useCupKpiRequests } from '../../hooks/useKpiRequests';
import { CupFilter } from '../CupFilter/CupFilter';
import { GridTable } from '../GridTable/GridTable';
import { LoadingTableSkeleton } from '../LoadingTableSkeleton/LoadingTableSkeleton';

interface CupSectionProps {
  dataTestId?: string;
}

const hasTableData = (data: unknown): data is { table: TableDataType } =>
  data != null && typeof data === 'object' && 'table' in data;

export const CupSection: React.FC<CupSectionProps> = ({ dataTestId }) => {
  const { activeSubFilters } = useSubFilters();

  const activeCup = useMemo(() => {
    return activeSubFilters[GL_COMPETITIONS] || '';
  }, [activeSubFilters]);

  const getCupSuffix = (
    activeCup: FilterValue,
    activeSubFilters: Record<string, FilterValue>,
  ): string => {
    const activeCupString = String(activeCup);
    const CUP_PREFIX = `${GL_COMPETITIONS}_${activeCupString}`;
    const subCup = activeSubFilters[CUP_PREFIX] || '';

    let baseSuffix = '';
    if (subCup) {
      const separator = '_';
      baseSuffix = `${activeCupString}${separator}${subCup}`;
    } else {
      baseSuffix = activeCupString;
    }

    return baseSuffix;
  };

  const suffix = useMemo(
    () => getCupSuffix(activeCup, activeSubFilters),
    [activeCup, activeSubFilters],
  );

  const isBrandsFiltered = suffix === 'megabrands_cup_brand';

  const { kpiData, loading } = useCupKpiRequests(suffix);

  const kpiDataFormated = hasTableData(kpiData) ? kpiData.table : kpiData;

  return (
    <StyledSection
      data-testid={dataTestId ? `cup-section-${dataTestId}` : undefined}
    >
      <CupFilter
        dataTestId={dataTestId ? `${dataTestId}-cup-filter` : undefined}
      />

      <ContainerWithScroll
        data-testid={
          dataTestId ? `cup-section-container-scroll-${dataTestId}` : undefined
        }
        overflow="autoX"
      >
        {loading ? (
          <LoadingTableSkeleton
            dataTestId={dataTestId ? `${dataTestId}-cup-section` : undefined}
          />
        ) : (
          <GridTable
            data={kpiDataFormated}
            leagueType={suffix}
            isBrandView={isBrandsFiltered}
          />
        )}
      </ContainerWithScroll>
    </StyledSection>
  );
};
