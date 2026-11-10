import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { CheckCircle, Close, ErrorOctagon } from '../Icon';
import {
  Container,
  Content,
  Message,
  ToastCloseButton,
  ToastRetryButton,
} from './Toast.styles';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  type?: 'success' | 'error';
  message: string | ReactNode;
  duration?: number;
  onClose: () => void;
  action?: ToastAction;
  enableRetry?: boolean;
  className?: string;
  style?: CSSProperties;
}

const icons = {
  success: CheckCircle,
  error: ErrorOctagon,
};

export const Toast: React.FC<ToastProps> = ({
  type = 'success',
  message,
  duration = 3000,
  onClose,
  action,
  enableRetry = false,
  className,
  style,
}) => {
  const [closing, setClosing] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleClose = useCallback(() => {
    setClosing(true);
    closeTimerRef.current = setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    if (duration <= 0) return;

    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  useEffect(() => {
    return () => clearTimeout(closeTimerRef.current);
  }, []);

  const Icon = icons[type];

  return (
    <Container
      type={type}
      closing={closing}
      className={className}
      style={style}
      role="alert"
    >
      <Icon size={20} />
      <Content>
        <Message>{message}</Message>
      </Content>
      {enableRetry && action && (
        <ToastRetryButton
          type="button"
          variant="outline"
          size="small"
          onClick={action.onClick}
        >
          {action.label}
        </ToastRetryButton>
      )}
      <ToastCloseButton
        type="button"
        variant="transparent"
        size="small"
        iconMode
        onClick={handleClose}
        aria-label="Close"
        startContent={<Close size={16} />}
      />
    </Container>
  );
};

Toast.displayName = 'Toast';
