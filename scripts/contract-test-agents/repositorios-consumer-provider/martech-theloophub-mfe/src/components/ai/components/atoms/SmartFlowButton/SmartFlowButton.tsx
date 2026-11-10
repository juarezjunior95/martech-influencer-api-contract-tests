import { Close, SmartFlow } from '../Icon';
import { ActiveTitle, CloseIcon, PillButton } from './SmartFlowButton.styles';

export interface SmartFlowButtonProps {
  active?: boolean;
  activeTitle?: string;
  onClick: () => void;
  onClose?: () => void;
  disabled?: boolean;
}

export const SmartFlowButton = ({
  active = false,
  activeTitle,
  onClick,
  onClose,
  disabled = false,
}: SmartFlowButtonProps) => {
  return (
    <PillButton
      type="button"
      isActive={active}
      onClick={onClick}
      disabled={disabled}
      aria-label={active ? `Smart Flow: ${activeTitle}` : 'Smart Flows'}
    >
      <SmartFlow size={22} />
      {active && activeTitle ? (
        <ActiveTitle>{activeTitle}</ActiveTitle>
      ) : (
        'Smart Flows'
      )}
      {active && onClose && (
        <CloseIcon
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-hidden
        >
          <Close size={14} />
        </CloseIcon>
      )}
    </PillButton>
  );
};
