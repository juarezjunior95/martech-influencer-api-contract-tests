import BronzeMedal from 'assets/bronze-medal.svg';
import GoldenMedal from 'assets/golden-medal.svg';
import SilverMedal from 'assets/silver-medal.svg';
import { createDataTestId } from 'utils/test/createDataTestId';

import {
  MedalBoxItem,
  NumberPosition,
  StyledRankPosition,
} from './RankingTag.styles';

type RankingTagProps = {
  position: string | number;
  type: 'medal' | 'ranking';
  dataTestId?: string;
};

export const RankingTag = ({
  position,
  type = 'medal',
  dataTestId,
}: RankingTagProps) => {
  const positionStr = String(position);

  const renderMedalItem = () => {
    const medalMapping: Record<string, { image: string; alt: string }> = {
      '1': {
        image: GoldenMedal,
        alt: 'Golden Medal',
      },
      '2': {
        image: SilverMedal,
        alt: 'Silver Medal',
      },
      '3': {
        image: BronzeMedal,
        alt: 'Bronze Medal',
      },
    } as const;

    if (!['1', '2', '3'].includes(positionStr)) {
      return (
        <StyledRankPosition
          data-testid={createDataTestId(dataTestId, 'ranking-tag-rank')}
        >
          {positionStr}
        </StyledRankPosition>
      );
    }

    return (
      <MedalBoxItem
        data-testid={createDataTestId(
          dataTestId,
          `ranking-tag-medal-${positionStr}`,
        )}
      >
        <img
          data-testid={createDataTestId(
            dataTestId,
            `ranking-tag-medal-${positionStr}-image`,
          )}
          src={medalMapping[positionStr].image}
          alt={medalMapping[positionStr].alt}
        />
        <NumberPosition
          data-testid={createDataTestId(
            dataTestId,
            `ranking-tag-medal-${positionStr}-position`,
          )}
        >
          {positionStr}
        </NumberPosition>{' '}
      </MedalBoxItem>
    );
  };

  if (type === 'medal') {
    return renderMedalItem();
  }

  if (type === 'ranking') {
    return (
      <StyledRankPosition
        position={positionStr as '1' | '2' | '3'}
        data-testid={createDataTestId(dataTestId, 'ranking-tag-rank')}
      >
        {positionStr}
      </StyledRankPosition>
    );
  }

  return (
    <div data-testid={createDataTestId(dataTestId, 'ranking-tag-default')}>
      {positionStr}
    </div>
  );
};
