import { Button } from '../components/atoms/Button';
import { Toaster } from '../components/atoms/Toaster';
import { Sandbox } from '../components/organisms/Sandbox';
import { toast } from '../utils/toastStore';

const FEEDBACK_TOAST_SUCCESS = 'Feedback submitted successfully.';
const FEEDBACK_TOAST_ERROR =
  "Couldn't submit feedback. Please try again later.";

const FEEDBACK_TOAST_ERROR_WITH_RETRY = "Couldn't submit feedback.";

const DEMO_LONG_DURATION_MS = 15_000;

export const ToasterExample = () => {
  return (
    <Sandbox
      title="Toaster"
      description="Toaster global (InsightsCopilot); same messages as the feedback."
    >
      <div style={{ position: 'relative' }}>
        <Toaster />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() =>
              toast({
                type: 'success',
                message: FEEDBACK_TOAST_SUCCESS,
              })
            }
          >
            Success toast
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              toast({
                type: 'error',
                message: FEEDBACK_TOAST_ERROR,
              })
            }
          >
            Error toast
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              toast({
                type: 'error',
                message: FEEDBACK_TOAST_ERROR_WITH_RETRY,
                enableRetry: true,
                action: {
                  label: 'Try again',
                  onClick: () => {
                    toast({ type: 'success', message: FEEDBACK_TOAST_SUCCESS });
                  },
                },
              })
            }
          >
            Error + Try again (Clara)
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                type: 'success',
                message: `Long duration (${DEMO_LONG_DURATION_MS / 1000}s).`,
                duration: DEMO_LONG_DURATION_MS,
              })
            }
          >
            Long duration toast
          </Button>
        </div>
      </div>
    </Sandbox>
  );
};
