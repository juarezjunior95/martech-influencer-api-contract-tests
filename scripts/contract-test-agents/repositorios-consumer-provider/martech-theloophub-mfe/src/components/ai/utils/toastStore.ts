import type { ToastAction } from '../components/atoms/Toast';

export interface ToastData {
  type: 'success' | 'error';
  message: string;
  duration?: number;
  enableRetry?: boolean;
  action?: ToastAction;
}

type Listener = (state: ToastData | null) => void;

let current: ToastData | null = null;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((fn) => fn(current));
}

export function toast(data: ToastData) {
  current = data;
  notify();
}

export function dismiss() {
  current = null;
  notify();
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getSnapshot() {
  return current;
}
