import { ActionButtonStyled } from './ActionButton.styles';

interface ActionButtonProps {
  children: string | React.ReactNode;
  onClick: () => void;
  type: 'info' | 'success' | 'warning' | 'error' | 'neutral' | 'AI';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  type,
}) => (
  <ActionButtonStyled onClick={onClick} alertType={type}>
    {children}
  </ActionButtonStyled>
);
