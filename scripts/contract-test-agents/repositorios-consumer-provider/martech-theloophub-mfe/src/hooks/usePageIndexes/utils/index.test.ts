import { calculatePageIndexes } from './index';

describe('calculatePageIndexes', () => {
  describe('Rendering', () => {
    it('should return empty object when containerRef.current is null', () => {
      const containerRef = { current: null } as React.RefObject<HTMLElement>;

      const result = calculatePageIndexes(containerRef);

      expect(result).toEqual({});
    });
  });

  describe('Functionality', () => {
    it('should return page indexes for sections with data-page-name attribute', () => {
      const container = document.createElement('div');

      const section1 = document.createElement('div');
      section1.dataset.pageName = 'intro';

      const section2 = document.createElement('div');
      section2.dataset.pageName = 'overview';

      container.appendChild(section1);
      container.appendChild(section2);
      document.body.appendChild(container);

      const containerRef = { current: container };
      const result = calculatePageIndexes(containerRef);

      expect(result['intro']).toEqual({
        index: 1,
        name: 'intro',
        element: section1,
      });
      expect(result['overview']).toEqual({
        index: 2,
        name: 'overview',
        element: section2,
      });

      document.body.removeChild(container);
    });

    it('should use fallback page name when dataset.pageName is empty', () => {
      const container = document.createElement('div');

      const section = document.createElement('div');
      section.dataset.pageName = '';

      container.appendChild(section);
      document.body.appendChild(container);

      const containerRef = { current: container };
      const result = calculatePageIndexes(containerRef);

      expect(result['page-0']).toBeDefined();
      expect(result['page-0'].index).toBe(1);

      container.remove();
    });

    it('should index pages starting from 1', () => {
      const container = document.createElement('div');

      for (let i = 0; i < 3; i++) {
        const section = document.createElement('div');
        section.dataset.pageName = `page-${i}`;
        container.appendChild(section);
      }

      document.body.appendChild(container);
      const containerRef = { current: container };
      const result = calculatePageIndexes(containerRef);

      expect(result['page-0'].index).toBe(1);
      expect(result['page-1'].index).toBe(2);
      expect(result['page-2'].index).toBe(3);

      container.remove();
    });
  });

  describe('States', () => {
    it('should return empty object when no sections found', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const containerRef = { current: container };
      const result = calculatePageIndexes(containerRef);

      expect(result).toEqual({});

      container.remove();
    });
  });
});
