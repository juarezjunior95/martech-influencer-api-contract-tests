import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { BasicContainer } from 'components';
import { useLastDataRefresh } from 'contexts';
import { useGoogleAnalytics } from 'hooks';
import { StyledGridCupContainer } from 'pages/pillars/ValueCreation/GrowthLeague/GrowthLeague.styles';
import {
  LeagueType,
  RankData,
} from 'pages/pillars/ValueCreation/GrowthLeague/types';
import { formatDateToMonthYear } from 'utils/format';

import {
  CUP_KEY_MAPPING,
  CupConfig,
  CupKeys,
  CUPS_CONFIG,
  TEMP_HIDE_CUP_WINNERS,
} from '../../constants';
import { useKpiRequests } from '../../hooks/useKpiRequests';
import { CupWinners } from '../CupWinners/CupWinners';
import { FlagRank } from '../FlagRank/FlagRank';
import { LeagueSelector } from '../LeagueSelector/LeagueSelector';
import { RankingLink } from '../RankingLink/RankingLink';

interface LeagueSectionProps {
  dataTestId?: string;
}

export const LeagueSection: React.FC<LeagueSectionProps> = ({ dataTestId }) => {
  const { formatMessage } = useIntl();
  const { lastDataRefreshKpisDate } = useLastDataRefresh();
  const trackGA = useGoogleAnalytics();

  const [cupKeys, setCupKeys] = useState<CupKeys>({
    megaBrands: 'mega_brands_cup_country',
    bees: 'bees_cup_acceleration',
    channel: 'ka_cup_league_a',
    dtc: 'dtc_cup',
  });

  const [selectedLeague, setSelectedLeague] =
    useState<LeagueType>('super-league');

  const handleCupChange = useCallback((value: string) => {
    const mapping = CUP_KEY_MAPPING[value];
    if (mapping) {
      setCupKeys((prev) => ({ ...prev, ...mapping }));
    }
  }, []);

  const handleLeagueChange = useCallback(
    (value: string) => {
      setSelectedLeague(value as LeagueType);
      trackGA({
        event_category: 'Growth league overview',
        event_action: 'Selected',
        event_label: value,
      });
    },
    [trackGA],
  );

  const { kpis } = useKpiRequests();

  const { kpiData: leagueChampionsData, loading: leagueChampionsLoading } =
    kpis.leagueChampions;

  const { kpiData: cupWinnersData, loading: cupWinnersLoading } =
    kpis.cupWinners;

  const activeRankData = useMemo(
    () =>
      leagueChampionsData?.leagueChampions?.find(
        (league) => league.label === selectedLeague,
      ),
    [leagueChampionsData, selectedLeague],
  );

  const getCupLabel = useCallback(
    (config: CupConfig) => {
      const cupKey = cupKeys[config.key];
      const labelIndex =
        cupKey.includes('cup_country') ||
        cupKey.includes('maturity') ||
        cupKey.includes('league_b') ||
        cupKey.includes('tier2')
          ? 1
          : 0;
      return formatMessage({ id: config.labelKeys?.[labelIndex] });
    },
    [cupKeys, formatMessage],
  );

  return (
    <BasicContainer
      dataTestId={dataTestId ? `${dataTestId}-league-section` : undefined}
      header={{
        title: formatMessage({
          id: 'ValueCreation.GrowthLeague.Overview.GrowthLeague',
          defaultMessage: '',
        }),
        titleSize: 'H2',
      }}
    >
      <BasicContainer
        dataTestId={dataTestId ? `${dataTestId}-league-champions` : undefined}
        header={{
          title: formatMessage({
            id: 'ValueCreation.GrowthLeague.Overview.LeagueWinners.title',
            defaultMessage: '',
          }),
          subtitle: `[${formatDateToMonthYear(lastDataRefreshKpisDate.growth_league)} Results]`,
          titleSize: 'H3',
          rightContent: (
            <LeagueSelector
              selectedLeague={selectedLeague}
              onLeagueChange={handleLeagueChange}
            />
          ),
        }}
        layout={{
          border: 'none',
          shadow: 'none',
          headerPadding: 'none',
        }}
      >
        <FlagRank
          dataTestId={
            dataTestId
              ? `${dataTestId}-league-champions-${selectedLeague}`
              : undefined
          }
          key={selectedLeague}
          rankData={activeRankData}
          loading={leagueChampionsLoading}
        />

        <RankingLink
          dataTestId={
            dataTestId
              ? `${dataTestId}-league-champions-link-${selectedLeague}`
              : undefined
          }
          to={`/reports/value-creation/growth-league/rankings?competition-type=league&league-type=${selectedLeague}`}
        />
      </BasicContainer>

      {!TEMP_HIDE_CUP_WINNERS && (
        <div style={{ marginTop: '1.5rem' }}>
          <BasicContainer
            dataTestId={dataTestId ? `${dataTestId}-cup-winners` : undefined}
            header={{
              title: formatMessage({
                id: 'ValueCreation.GrowthLeague.CupWinners.title',
                defaultMessage: '',
              }),
              subtitle: `[${formatMessage({
                id: 'ValueCreation.GrowthLeague.CupWinners.subtitle',
                defaultMessage: '',
              })}]`,
              titleSize: 'H3',
            }}
            layout={{
              border: 'none',
              headerPadding: 'none',
              shadow: 'none',
            }}
          >
            <StyledGridCupContainer
              data-testid={
                dataTestId ? `league-cup-winners-grid-${dataTestId}` : undefined
              }
            >
              {CUPS_CONFIG.map((config) => {
                const cupKey = cupKeys[config.key];
                return (
                  <CupWinners
                    dataTestId={
                      dataTestId
                        ? `${dataTestId}-league-cup-winner-${config.key}`
                        : undefined
                    }
                    key={config.key}
                    label={getCupLabel(config)}
                    rankData={
                      cupWinnersData?.cupWinners?.[cupKey] || ({} as RankData)
                    }
                    loading={cupWinnersLoading}
                    options={config.options}
                    onSelectedChange={handleCupChange}
                    currentSelectValue={
                      config.getSelectValue
                        ? config.getSelectValue(cupKey)
                        : undefined
                    }
                  />
                );
              })}
            </StyledGridCupContainer>

            <RankingLink
              dataTestId={
                dataTestId ? `${dataTestId}-league-cup-winners-link` : undefined
              }
              to="/reports/value-creation/growth-league/rankings?competition-type=cup"
            />
          </BasicContainer>
        </div>
      )}
    </BasicContainer>
  );
};
