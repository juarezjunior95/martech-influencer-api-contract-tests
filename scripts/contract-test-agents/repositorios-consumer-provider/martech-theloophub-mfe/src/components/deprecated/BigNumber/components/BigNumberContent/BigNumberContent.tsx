import { HeaderContentItem } from 'components/HeaderContent';

import {
  StyledBigNumberContainer,
  StyledBigNumberContent,
} from '../../BigNumber.styles';
import { BigNumberNoData } from '../BigNumberNoData/BigNumberNoData';
import { BigNumberOnlyAvailableByCountry } from '../BigNumberOnlyAvailableByCountry/BigNumberOnlyAvailableByCountry';
import { BigNumberPeriodSection } from '../BigNumberPeriodSection/BigNumberPeriodSection';
import { BigNumberPin } from '../BigNumberPin/BigNumberPin';
import { BigNumberSection } from '../BigNumberSection/BigNumberSection';
import { BigNumberTitleSection } from '../BigNumberTitleSection/BigNumberTitleSection';
import { BigNumberTotalSection } from '../BigNumberTotalSection/BigNumberTotalSection';

export interface BigNumberBaseData {
  title?: string;
  measure?: string;
  tooltipContent?: HeaderContentItem[];
}

export interface BigNumberOptionalData {
  empty?: boolean;
  bigNumber?: number;
  bigNumberUnit?: string;
  bigNumberDirection?: string;
  variation?: number;
  variationMeasure?: string;
  variationDirection?: string;
  versus?: string;
  total?: number;
  totalPrefix?: string;
  totalMeasure?: string;
  totalLabel?: string;
  totalUnitOfMeasureLabel?: string;
  period?: string;
  divider?: boolean;
  titleSize?: 'H2' | 'H3' | 'H4' | 'H5';
  dateRefresh?: string;
  lastEstimated?: string;
  unavailable?: boolean;
}

export type BigNumberData = BigNumberBaseData & BigNumberOptionalData;

interface Props {
  data: BigNumberData;
  hasPin?: boolean;
  isPinned?: boolean;
  divider?: boolean;
  typeTitle?: string;
  gap?: 'sm' | 'xs';
}

export const BigNumberContent = ({
  data,
  hasPin,
  isPinned = false,
  divider = false,
  gap,
  ...props
}: Props): JSX.Element => {
  const renderBody = () => {
    if (data.empty) return <BigNumberNoData />;

    if (data.unavailable && props.typeTitle === 'categoryHealth') {
      return <BigNumberOnlyAvailableByCountry />;
    }

    return (
      <>
        <BigNumberSection data={data} borderTop={divider} />
        <BigNumberTotalSection data={data} />
        <BigNumberPeriodSection period={data.period} />
      </>
    );
  };

  return (
    <StyledBigNumberContainer data-testid="big-number-content">
      {!data.empty && hasPin && <BigNumberPin pinned={isPinned} />}
      <StyledBigNumberContent gap={gap}>
        <BigNumberTitleSection data={data} />
        {renderBody()}
      </StyledBigNumberContent>
    </StyledBigNumberContainer>
  );
};
