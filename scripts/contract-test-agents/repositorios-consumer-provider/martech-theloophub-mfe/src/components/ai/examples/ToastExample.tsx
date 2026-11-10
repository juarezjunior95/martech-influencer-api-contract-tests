import { useState } from 'react';

import { Button } from '../components/atoms/Button';
import { Toast } from '../components/atoms/Toast';
import { Sandbox } from '../components/organisms/Sandbox';

const FEEDBACK_TOAST_SUCCESS = 'Feedback submitted successfully.';

const FEEDBACK_TOAST_ERROR = "Couldn't submit feedback.";
const ToastBlock = ({
  type,
  message,
  enableRetry,
  action,
}: {
  type: 'success' | 'error';
  message: string;
  enableRetry?: boolean;
  action?: { label: string; onClick: () => void };
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <Button size="small" variant="secondary" onClick={() => setVisible(true)}>
        Show again
      </Button>
    );
  }

  return (
    <Toast
      type={type}
      message={message}
      duration={0}
      onClose={() => setVisible(false)}
      enableRetry={enableRetry}
      action={action}
    />
  );
};

export const ToastExample = () => {
  return (
    <Sandbox
      title="Toast"
      description="Clara AI Alerts: Only Success or Error in Atom Toast"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Success
          </h4>
          <div style={{ position: 'relative', minHeight: 100 }}>
            <ToastBlock type="success" message={FEEDBACK_TOAST_SUCCESS} />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Error
          </h4>
          <div style={{ position: 'relative', minHeight: 100 }}>
            <ToastBlock type="error" message={FEEDBACK_TOAST_ERROR} />
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 12px', fontSize: 13, color: '#666' }}>
            Error with retry
          </h4>
          <div style={{ position: 'relative', minHeight: 100 }}>
            <ToastBlock
              type="error"
              message="Couldn't submit feedback."
              enableRetry
              action={{ label: 'Try again', onClick: () => undefined }}
            />
          </div>
        </div>
      </div>
    </Sandbox>
  );
};
