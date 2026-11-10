type DetachedNode = {
  node: Node;
  parent: Node;
  nextSibling: Node | null;
  placeholder: HTMLElement | null;
};

const EXPORT_PAGE_SECTION_SELECTOR = '[data-page-name]';

const findActivePageSection = (element: HTMLElement): HTMLElement | null => {
  const section = element.closest(EXPORT_PAGE_SECTION_SELECTOR);
  return section instanceof HTMLElement ? section : null;
};

const detachNode = (node: Node, detached: DetachedNode[]): void => {
  const parent = node.parentNode;
  if (!parent) return;

  let placeholder: HTMLElement | null = null;
  if (node instanceof HTMLElement) {
    const rect = node.getBoundingClientRect();
    placeholder = document.createElement('div');
    placeholder.dataset.exportDetachedPlaceholder = 'true';
    placeholder.style.width = `${Math.ceil(rect.width)}px`;
    placeholder.style.height = `${Math.ceil(rect.height)}px`;
    placeholder.style.pointerEvents = 'none';
    placeholder.style.visibility = 'hidden';
  }

  detached.push({
    node,
    parent,
    nextSibling: node.nextSibling,
    placeholder,
  });

  const childNode = node as ChildNode;

  if (placeholder) {
    childNode.replaceWith(placeholder);
    return;
  }

  childNode.remove();
};

const restoreDetachedNodes = (detached: DetachedNode[]): void => {
  const reversedDetached = [...detached].reverse();

  reversedDetached.forEach(({ node, parent, nextSibling, placeholder }) => {
    if (placeholder?.parentNode === parent) {
      placeholder.replaceWith(node);
      return;
    }

    if (nextSibling?.parentNode === parent) {
      (nextSibling as ChildNode).before(node);
      return;
    }

    parent.appendChild(node);
  });
};

const lockBodyScroll = (): (() => void) => {
  const originalOverflow = document.body.style.overflow;

  document.body.style.overflow = 'hidden';

  return () => {
    document.body.style.overflow = originalOverflow;
  };
};

export type MinimizedDomCapture = {
  detachedCount: number;
  remainingPageSections: number;
  cleanup: () => void;
};

/**
 * Temporarily removes other export slides from the live document.
 * html2canvas clones the whole document - with 80 slides mounted this is
 * very slow. Detaching siblings keeps styles/canvas on the target slide
 * because we never clone it out of the styled document.
 */
export const minimizeDomForCapture = (
  element: HTMLElement,
): MinimizedDomCapture => {
  const unlockScroll = lockBodyScroll();
  const activeSection = findActivePageSection(element);
  const detached: DetachedNode[] = [];

  if (activeSection) {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(EXPORT_PAGE_SECTION_SELECTOR),
    );
    const activeIndex = sections.indexOf(activeSection);

    sections.forEach((section, index) => {
      if (
        index === activeIndex ||
        index === activeIndex - 1 ||
        index === activeIndex + 1
      ) {
        return;
      }
      detachNode(section, detached);
    });
  } else {
    let container: HTMLElement | null = element.parentElement;

    while (container) {
      const hasSiblingSlides = Array.from(container.children).some(
        (child) =>
          child instanceof HTMLElement &&
          child !== element &&
          !child.contains(element) &&
          child.querySelector(EXPORT_PAGE_SECTION_SELECTOR),
      );

      if (hasSiblingSlides) break;
      container = container.parentElement;
    }

    if (container) {
      Array.from(container.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        if (child === element || child.contains(element)) return;
        if (element.contains(child)) return;
        detachNode(child, detached);
      });
    }
  }

  return {
    detachedCount: detached.length,
    remainingPageSections: document.querySelectorAll(
      EXPORT_PAGE_SECTION_SELECTOR,
    ).length,
    cleanup: () => {
      unlockScroll();
      restoreDetachedNodes(detached);
    },
  };
};
