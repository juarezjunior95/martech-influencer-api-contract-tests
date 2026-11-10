import { StyledBigNumberCard } from './BigNumber.styles';
import {
  BigNumberContent,
  BigNumberData,
} from './components/BigNumberContent/BigNumberContent';

interface BigNumberProps {
  likeCard?: boolean;
  hasPin?: boolean;
  pinCallback?: () => void;
  isPinned?: boolean;
  data: BigNumberData;
  divider?: boolean;
  gap?: 'sm' | 'xs';
  dataTestId?: string;
}

export const BigNumber = ({
  dataTestId,
  likeCard = true,
  hasPin,
  pinCallback,
  isPinned = false,
  data,
  divider,
  gap,
  ...props
}: BigNumberProps): JSX.Element => {
  const content = (
    <BigNumberContent
      hasPin={hasPin}
      isPinned={isPinned}
      data={data}
      divider={divider}
      gap={gap}
      {...props}
    />
  );

  if (likeCard)
    return (
      <StyledBigNumberCard
        data-testid={
          dataTestId ? `big-number-card-${dataTestId}` : 'big-number-card'
        }
        border="small"
        elevated="medium"
        style={{ padding: '1.25rem', width: '236px' }}
        onClick={pinCallback}
        isPinned={isPinned}
        hasPin={hasPin}
      >
        {content}
      </StyledBigNumberCard>
    );

  return content;
};
