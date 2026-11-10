/**
 * Checks if the search input element is currently focused
 */
export const isSearchInputFocused = (): boolean => {
  const activeElement = document.activeElement as HTMLElement;
  return (
    activeElement instanceof HTMLInputElement &&
    activeElement.name === 'react-select-search'
  );
};

/**
 * Checks if a click target is within the select component
 */
export const isTargetInsideSelect = (
  target: Element,
  selectRef: React.RefObject<HTMLDivElement>,
  id: string,
): boolean => {
  if (!selectRef.current) return false;

  return (
    selectRef.current === target ||
    !!target.closest(`[id*="${id}"]`) ||
    target.classList.value.includes(`${id}-select`)
  );
};
