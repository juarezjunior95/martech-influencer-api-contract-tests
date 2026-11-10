import { SkeletonLoader } from '@hexa-ui/components';
import { RankingTag } from 'components';
import {
  Position5,
  RankData,
} from 'pages/pillars/ValueCreation/GrowthLeague/types';

import {
  StyledBoxMedal,
  StyledCountryName,
  StyledImage,
  StyledImageBox,
  StyledLeaderBoardContainer,
  StyledLeaderBoardItem,
  StyledLeaderCountryInfo,
  StyledLeagueTitle,
  StyledValue,
} from './Leaderboard.styles';

interface LeaderBoardProps {
  title: string;
  rankData: RankData;
  loading?: boolean;
  dataTestId?: string;
}

const SKELETON_KEYS = [
  'leaderboard-skeleton-1',
  'leaderboard-skeleton-2',
  'leaderboard-skeleton-3',
  'leaderboard-skeleton-4',
  'leaderboard-skeleton-5',
];

const getColorVariant = (value: string) => {
  const numberValue = Number.parseInt(value, 10);
  if (numberValue >= 80) {
    return 'green';
  }
  if (numberValue >= 60) {
    return 'orange';
  }
  return 'red';
};

export const Leaderboard = ({
  title,
  rankData,
  loading,
  dataTestId,
}: LeaderBoardProps) => {
  const buildTestId = (suffix: string) =>
    dataTestId ? `leaderboard-${suffix}${dataTestId}` : undefined;

  if (loading) {
    return (
      <StyledLeaderBoardContainer data-testid={buildTestId('')}>
        <StyledLeagueTitle data-testid={buildTestId('title-')}>
          {title}
        </StyledLeagueTitle>

        {SKELETON_KEYS.map((key) => (
          <SkeletonLoader
            key={key}
            data-testid={buildTestId('skeleton-')}
            height="82px"
            width="622px"
          />
        ))}
      </StyledLeaderBoardContainer>
    );
  }

  return (
    <StyledLeaderBoardContainer data-testid={buildTestId('')}>
      <StyledLeagueTitle data-testid={buildTestId('title-')}>
        {title}
      </StyledLeagueTitle>

      {rankData?.rank.slice(0, 5).map((item) => (
        <StyledLeaderBoardItem
          data-testid={buildTestId('item-')}
          position={item.position as Position5}
          key={item.countryName}
        >
          <StyledLeaderCountryInfo
            data-testid={buildTestId('item-country-info-')}
          >
            <StyledBoxMedal data-testid={buildTestId('item-medal-box-')}>
              <RankingTag
                dataTestId={
                  dataTestId ? `${dataTestId}-leaderboard` : undefined
                }
                position={item.position as Position5}
                type="medal"
              />
            </StyledBoxMedal>
            <StyledImageBox data-testid={buildTestId('item-image-box-')}>
              {item.flag !== 'flag' && (
                <StyledImage
                  data-testid={buildTestId('item-flag-')}
                  src={item.flag}
                  alt={`${item.countryName} flag`}
                />
              )}
            </StyledImageBox>
            <StyledCountryName data-testid={buildTestId('item-country-name-')}>
              {item.countryName}
            </StyledCountryName>
          </StyledLeaderCountryInfo>
          <StyledValue
            data-testid={buildTestId('item-value-')}
            color={getColorVariant(item.value)}
          >
            {item.value} {item.measure}
          </StyledValue>
        </StyledLeaderBoardItem>
      ))}
    </StyledLeaderBoardContainer>
  );
};
