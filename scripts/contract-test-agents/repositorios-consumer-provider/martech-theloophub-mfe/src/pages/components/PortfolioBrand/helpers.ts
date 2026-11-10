export const resolveHeightAfterAlerts = (
  baseHeightPx: number,
  hasAlerts: boolean,
  alertContainerEl: HTMLElement | null | undefined,
): number => {
  if (!hasAlerts || !alertContainerEl) {
    return baseHeightPx;
  }

  return baseHeightPx - alertContainerEl.clientHeight;
};
