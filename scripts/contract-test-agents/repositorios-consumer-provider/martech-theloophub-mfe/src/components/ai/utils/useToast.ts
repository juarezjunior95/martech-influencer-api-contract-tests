import {
  dismiss,
  getSnapshot,
  subscribe,
  toast,
  type ToastData,
} from './toastStore';
import { useStore } from './useStore';

export type { ToastData } from './toastStore';

export interface UseToastReturn {
  toast: ToastData | null;
  showToast: (data: ToastData) => void;
  dismissToast: () => void;
}

export function useToast(): UseToastReturn {
  const current = useStore(subscribe, getSnapshot);

  return { toast: current, showToast: toast, dismissToast: dismiss };
}
