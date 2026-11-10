import { SkeletonLoader } from '@hexa-ui/components';
import { Select } from 'components';
import { Option } from 'models/Filters';
import {
  Position3,
  RankData,
} from 'pages/pillars/ValueCreation/GrowthLeague/types';

import {
  detectTieScenario,
  toDataIndex,
} from '../../../../utils/tiesDetection';
import {
  StyledCupWinnerBoxContent,
  StyledCupWinnerCountryFlag,
  StyledCupWinnerItem,
  StyledCupWinnerItemContainer,
  StyledCupWinnersBox,
  StyledCupWinnerText,
  StyledCupWinnerTitle,
  StyledImage,
} from './CupWinners.styles';

interface CupWinnersProps {
  dataTestId?: string;
  rankData: RankData;
  label?: string;
  loading?: boolean;
  onSelectedChange?: (value: string) => void;
  currentSelectValue?: string;
  options?: {
    value: string;
    label: string;
  }[];
}

export const CupWinners: React.FC<CupWinnersProps> = ({
  dataTestId,
  rankData,
  label,
  loading,
  onSelectedChange,
  currentSelectValue,
  options,
}) => {
  if (loading) {
    return (
      <StyledCupWinnersBox
        data-testid={dataTestId ? `cup-winners-box-${dataTestId}` : undefined}
      >
        <SkeletonLoader
          data-testid={dataTestId ? `${dataTestId}skeleton-loader` : undefined}
          height="128px"
          width="295px"
        />
        <SkeletonLoader
          data-testid={dataTestId ? `${dataTestId}-skeleton-loader` : undefined}
          height="72px"
          width="295px"
        />
        <SkeletonLoader
          data-testid={dataTestId ? `${dataTestId}-skeleton-loader` : undefined}
          height="58px"
          width="295px"
        />
      </StyledCupWinnersBox>
    );
  }

  const handleOnChange = (op: Option) => {
    onSelectedChange(op.value as string);
  };

  const tieAnalysis = detectTieScenario(rankData?.rank || []);
  const { scenario, sortedRankData } = tieAnalysis;

  return (
    <StyledCupWinnersBox
      data-testid={dataTestId ? `cup-winners-box-${dataTestId}` : undefined}
    >
      {options ? (
        <Select
          data-testid={
            dataTestId ? `${dataTestId}-cup-winners-select` : undefined
          }
          id="cup-winners-select"
          valueLabel={label}
          value={currentSelectValue}
          onValueChange={handleOnChange}
          options={options}
          appearance="plain"
          showValueSelected={false}
        />
      ) : (
        <StyledCupWinnerTitle
          data-testid={
            dataTestId ? `cup-winner-title-${dataTestId}` : undefined
          }
        >
          {label || rankData.label}
        </StyledCupWinnerTitle>
      )}
      {sortedRankData.map((item, index) => (
        <StyledCupWinnerItem
          data-testid={
            dataTestId ? `cup-winner-item-${dataTestId}-${index}` : undefined
          }
          position={item.position as Position3}
          tieScenario={scenario}
          dataIndex={toDataIndex(index)}
          key={item.countryName}
        >
          <StyledCupWinnerItemContainer
            data-testid={
              dataTestId
                ? `cup-winner-item-container-${dataTestId}-${index}`
                : undefined
            }
            position={item.position as Position3}
            tieScenario={scenario}
            dataIndex={toDataIndex(index)}
          >
            {item.flag !== 'flag' && (
              <StyledImage
                data-testid={
                  dataTestId
                    ? `cup-winner-item-image-${dataTestId}-${index}`
                    : undefined
                }
                src={item.flag}
                alt={`${item.countryName} flag`}
              />
            )}
            <StyledCupWinnerBoxContent
              data-testid={
                dataTestId
                  ? `cup-winner-item-box-content-${dataTestId}-${index}`
                  : undefined
              }
            >
              {item.brand ? (
                <>
                  <StyledCupWinnerCountryFlag
                    data-testid={
                      dataTestId
                        ? `cup-winner-item-country-flag-${dataTestId}-${index}`
                        : undefined
                    }
                  >
                    {item.countryName}
                  </StyledCupWinnerCountryFlag>

                  <StyledCupWinnerText
                    data-testid={
                      dataTestId
                        ? `cup-winner-item-text-${dataTestId}-${index}`
                        : undefined
                    }
                    position={item.position as Position3}
                  >
                    {item.position === '1'
                      ? `${item.position} # ${item.brand}`
                      : `# ${item.position} ${item.brand}`}
                  </StyledCupWinnerText>
                </>
              ) : (
                <StyledCupWinnerText
                  data-testid={
                    dataTestId
                      ? `cup-winner-item-text-${dataTestId}-${index}`
                      : undefined
                  }
                  position={item.position as Position3}
                >
                  # {item.position} {item.countryName}
                </StyledCupWinnerText>
              )}
            </StyledCupWinnerBoxContent>
          </StyledCupWinnerItemContainer>
        </StyledCupWinnerItem>
      ))}
    </StyledCupWinnersBox>
  );
};
