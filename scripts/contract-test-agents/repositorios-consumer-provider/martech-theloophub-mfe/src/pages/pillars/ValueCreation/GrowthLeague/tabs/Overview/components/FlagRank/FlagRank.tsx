import { SkeletonLoader } from '@hexa-ui/components';
import {
  Position3,
  RankData,
} from 'pages/pillars/ValueCreation/GrowthLeague/types';

import {
  StyledBoxContent,
  StyledFlagItemContainer,
  StyledFlagsBox,
  StyledFlagText,
  StyledFlaItem,
  StyledImage,
} from './FlagRank.styles';

interface FlagRankProps {
  dataTestId?: string;
  rankData: RankData;
  loading?: boolean;
}

export const FlagRank: React.FC<FlagRankProps> = ({
  rankData,
  loading,
  dataTestId,
}) => {
  if (loading) {
    return (
      <StyledFlagsBox
        data-testid={dataTestId ? `flag-rank-${dataTestId}` : undefined}
      >
        <SkeletonLoader height="200px" width="330px" />
        <SkeletonLoader height="280px" width="514px" />
        <SkeletonLoader height="200px" width="330px" />
      </StyledFlagsBox>
    );
  }

  return (
    <StyledFlagsBox
      data-testid={dataTestId ? `flag-rank-${dataTestId}` : undefined}
    >
      {rankData?.rank?.slice(0, 3).map((item, index) => (
        <StyledFlaItem
          data-testid={
            dataTestId ? `flag-rank-item-${index}-${dataTestId}` : undefined
          }
          position={item.position as Position3}
          key={item.countryName}
        >
          <StyledFlagItemContainer
            data-testid={
              dataTestId
                ? `flag-rank-item-container-${index}-${dataTestId}`
                : undefined
            }
            position={item.position as Position3}
          >
            {item.flag !== 'flag' && (
              <StyledImage
                data-testid={
                  dataTestId
                    ? `flag-rank-item-image-${index}-${dataTestId}`
                    : undefined
                }
                src={item.flag}
                alt={`${item.countryName} flag`}
              />
            )}
            <StyledBoxContent>
              <StyledFlagText
                data-testid={
                  dataTestId
                    ? `flag-rank-item-text-${index}-${dataTestId}`
                    : undefined
                }
                position={item.position as Position3}
              >
                # {item.position} {item.countryName}
              </StyledFlagText>
            </StyledBoxContent>
          </StyledFlagItemContainer>
        </StyledFlaItem>
      ))}
    </StyledFlagsBox>
  );
};
