import { PageIndexes } from 'pages/types';

export const calculatePageIndexes = (
  containerRef: React.RefObject<HTMLElement>,
): PageIndexes => {
  if (!containerRef.current) return {};

  const sections = containerRef.current.querySelectorAll('[data-page-name]');
  const pageIndexes: PageIndexes = {};

  sections.forEach((section, index) => {
    const sectionElement = section as HTMLElement;

    const pageName = sectionElement.dataset.pageName || `page-${index}`;

    pageIndexes[pageName] = {
      index: index + 1,
      name: pageName,
      element: sectionElement,
    };
  });

  return pageIndexes;
};
