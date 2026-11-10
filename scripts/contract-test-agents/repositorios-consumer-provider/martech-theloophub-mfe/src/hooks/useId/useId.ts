import { useState } from 'react';

let idCounter = 0;
/**
 * Stable unique ID for DOM and accessibility attributes (React 17–safe).
 * Use a descriptive prefix per call site (e.g. `'tooltip'`, `'modal'`).
 */
export function useId(prefix = 'id'): string {
  const [id] = useState(() => `${prefix}-${++idCounter}`);
  return id;
}
