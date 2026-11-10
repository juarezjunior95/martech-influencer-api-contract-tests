import { Icon } from '@hexa-ui/components2';
import { Pin, PinFilled } from '@hexa-ui/icons2';

export const BigNumberPin = ({ pinned }: { pinned: boolean }) => {
  return pinned ? (
    <Icon
      data-testid="pin-filled"
      icon={PinFilled}
      size="medium"
      style={{ margin: 'auto 0' }}
    />
  ) : (
    <Icon
      data-testid="pin"
      icon={Pin}
      size="medium"
      style={{ margin: 'auto 0' }}
    />
  );
};
