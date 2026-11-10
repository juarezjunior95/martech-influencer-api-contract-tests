import noDataYetIcon from 'assets/NoDataYet.svg';
import {
  StyledBigNumberNoDataYet,
  StyledBigNumberText,
} from 'components/deprecated/BigNumber/BigNumber.styles';

export const BigNumberNoData = () => {
  return (
    <StyledBigNumberNoDataYet>
      <img
        src={noDataYetIcon}
        width="56px"
        alt="no data yet"
        data-testid="no-data-yet-icon"
      />
      <StyledBigNumberText>Data not available</StyledBigNumberText>
    </StyledBigNumberNoDataYet>
  );
};
