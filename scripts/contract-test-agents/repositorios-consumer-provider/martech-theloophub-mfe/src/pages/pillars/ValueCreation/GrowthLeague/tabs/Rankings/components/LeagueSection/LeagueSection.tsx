import { useLayoutEffect, useState } from 'react';

import NoDataYet from 'components/NoDataYet/NoDataYet';
import { TableDataType } from 'components/Table/types';
import { StyledSection } from 'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles';
import { ContainerWithScroll } from 'utils/container';

import { useKpiRequests } from '../../hooks/useKpiRequests';
import { GridTable } from '../GridTable/GridTable';
import { LeagueSelector } from '../LeagueSelector/LeagueSelector';
import { LoadingTableSkeleton } from '../LoadingTableSkeleton/LoadingTableSkeleton';
import { StyledEmptyContainer } from './LeagueSection.styles';

interface LeagueSectionProps {
  leagueType: string;
  setLeagueType: (value: string) => void;
  dataTestId?: string;
}

export const LeagueSection: React.FC<LeagueSectionProps> = ({
  leagueType,
  setLeagueType,
  dataTestId,
}) => {
  const { leagues } = useKpiRequests();

  const [currentLeague, setCurrentLeague] = useState({
    kpiData: null,
    loading: true,
    error: null,
  });

  useLayoutEffect(() => {
    if (leagueType === 'premier-league') {
      setCurrentLeague(leagues.premierLeague);
    } else {
      setCurrentLeague(leagues.superLeague);
    }
  }, [leagueType, leagues]);

  const renderContent = (currentLeague: {
    kpiData: { table: TableDataType; empty: boolean };
    loading: boolean;
  }) => {
    if (currentLeague?.loading) {
      return (
        <LoadingTableSkeleton
          dataTestId={dataTestId ? `${dataTestId}-league-section` : undefined}
        />
      );
    }
    if (currentLeague?.kpiData?.empty) {
      return (
        <StyledEmptyContainer
          data-testid={
            dataTestId ? `${dataTestId}-league-section-empty` : undefined
          }
        >
          <NoDataYet
            dataTestId={dataTestId ? `${dataTestId}-league-section` : undefined}
          />
        </StyledEmptyContainer>
      );
    }
    const table = currentLeague?.kpiData?.table;
    if (table && (table.header || (table as any).columnDefs)) {
      return (
        <GridTable
          dataTestId={dataTestId ? `${dataTestId}-league-section` : undefined}
          data={table}
          leagueType={leagueType}
        />
      );
    }
  };
  return (
    <StyledSection
      data-testid={dataTestId ? `league-section-${dataTestId}` : undefined}
    >
      <LeagueSelector
        dataTestId={dataTestId ? `${dataTestId}-league-section` : undefined}
        leagueType={leagueType}
        setLeagueType={setLeagueType}
      />

      <ContainerWithScroll
        data-testid={
          dataTestId ? `${dataTestId}-league-section-scroll` : undefined
        }
        overflow="autoX"
      >
        {renderContent(currentLeague)}
      </ContainerWithScroll>
    </StyledSection>
  );
};
