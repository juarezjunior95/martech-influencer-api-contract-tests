import { dismiss, getSnapshot, subscribe } from '../../../utils/toastStore';
import { useStore } from '../../../utils/useStore';
import { Toast } from '../Toast';

export const Toaster = () => {
  const toastData = useStore(subscribe, getSnapshot);

  if (!toastData) return null;

  return <Toast {...toastData} onClose={dismiss} />;
};
