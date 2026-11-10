import emptyStateIcon from 'assets/empty-state-category-health.png';
import {
  StyledBigNumberNoDataYet,
  StyledBigNumberText,
} from 'components/deprecated/BigNumber/BigNumber.styles';

export const BigNumberOnlyAvailableByCountry = () => {
  return (
    <StyledBigNumberNoDataYet>
      <img
        src={emptyStateIcon}
        width="56px"
        alt="no data yet"
        data-testid="no-data-yet-icon"
      />
      <StyledBigNumberText size="xsmall">
        Only available by country
      </StyledBigNumberText>
    </StyledBigNumberNoDataYet>
  );
};
