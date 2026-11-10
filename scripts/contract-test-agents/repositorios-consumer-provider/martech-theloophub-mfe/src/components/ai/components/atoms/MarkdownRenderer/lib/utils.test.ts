import { createElement } from 'react';

import { extractTextFromReactNode } from './utils';

describe('extractTextFromReactNode', () => {
  describe('Primitive types', () => {
    it('extracts text from string', () => {
      expect(extractTextFromReactNode('Hello World')).toBe('Hello World');
    });

    it('extracts text from number', () => {
      expect(extractTextFromReactNode(42)).toBe('42');
      expect(extractTextFromReactNode(0)).toBe('0');
      expect(extractTextFromReactNode(-123)).toBe('-123');
    });

    it('returns empty string for null', () => {
      expect(extractTextFromReactNode(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(extractTextFromReactNode(undefined)).toBe('');
    });

    it('returns empty string for boolean', () => {
      expect(extractTextFromReactNode(true)).toBe('');
      expect(extractTextFromReactNode(false)).toBe('');
    });
  });

  describe('Arrays', () => {
    it('extracts text from array of strings', () => {
      expect(extractTextFromReactNode(['Hello', ' ', 'World'])).toBe(
        'Hello World',
      );
    });

    it('extracts text from array with mixed types', () => {
      expect(extractTextFromReactNode(['Text', 123, null, 'More'])).toBe(
        'Text123More',
      );
    });

    it('handles nested arrays', () => {
      expect(extractTextFromReactNode(['A', ['B', 'C'], 'D'])).toBe('ABCD');
    });

    it('handles empty arrays', () => {
      expect(extractTextFromReactNode([])).toBe('');
    });
  });

  describe('React Elements', () => {
    it('extracts text from simple React element', () => {
      const element = createElement('div', null, 'Content');
      expect(extractTextFromReactNode(element)).toBe('Content');
    });

    it('extracts text from nested React elements', () => {
      const element = createElement(
        'div',
        null,
        createElement('span', null, 'Hello'),
      );
      expect(extractTextFromReactNode(element)).toBe('Hello');
    });

    it('extracts text from element with multiple children', () => {
      const element = createElement('div', null, 'A', 'B', 'C');
      expect(extractTextFromReactNode(element)).toBe('ABC');
    });

    it('extracts text from deeply nested elements', () => {
      const element = createElement(
        'div',
        null,
        createElement(
          'p',
          null,
          createElement('strong', null, createElement('em', null, 'Deep text')),
        ),
      );
      expect(extractTextFromReactNode(element)).toBe('Deep text');
    });

    it('extracts text from element with mixed children types', () => {
      const element = createElement(
        'div',
        null,
        'Text ',
        123,
        createElement('span', null, ' more'),
      );
      expect(extractTextFromReactNode(element)).toBe('Text 123 more');
    });
  });

  describe('React Fragments', () => {
    it('extracts text from Fragment with multiple children', () => {
      const fragment = createElement(
        'fragment' as any,
        null,
        'First',
        ' ',
        'Second',
      );
      expect(extractTextFromReactNode(fragment)).toBe('First Second');
    });

    it('handles nested fragments', () => {
      const fragment = createElement(
        'fragment' as any,
        null,
        createElement('fragment' as any, null, 'A', 'B'),
        'C',
      );
      expect(extractTextFromReactNode(fragment)).toBe('ABC');
    });
  });

  describe('Depth Limit (Security)', () => {
    it('stops at max depth to prevent stack overflow', () => {
      // Create deeply nested structure (100 levels)
      let element: any = 'Deep';
      for (let i = 0; i < 100; i++) {
        element = createElement('div', null, element);
      }

      // Should stop at depth 50 and return empty string
      const result = extractTextFromReactNode(element);
      expect(result).toBe('');
    });

    it('works within depth limit (49 levels)', () => {
      // Create 49 levels of nesting
      let element: any = 'Content';
      for (let i = 0; i < 49; i++) {
        element = createElement('div', null, element);
      }

      const result = extractTextFromReactNode(element);
      expect(result).toBe('Content');
    });

    it('respects custom max depth', () => {
      // Create 10 levels of nesting
      let element: any = 'Deep';
      for (let i = 0; i < 10; i++) {
        element = createElement('div', null, element);
      }

      // With maxDepth=5, should fail
      const result = extractTextFromReactNode(element, 0, 5);
      expect(result).toBe('');
    });

    it('warns in development mode when max depth reached', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Create deeply nested structure
      let element: any = 'Deep';
      for (let i = 0; i < 100; i++) {
        element = createElement('div', null, element);
      }

      extractTextFromReactNode(element);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Max depth reached'),
      );

      consoleWarnSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });

    it('does not warn in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Create deeply nested structure
      let element: any = 'Deep';
      for (let i = 0; i < 100; i++) {
        element = createElement('div', null, element);
      }

      extractTextFromReactNode(element);

      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Edge Cases', () => {
    it('handles elements with no children prop', () => {
      const element = createElement('br');
      expect(extractTextFromReactNode(element)).toBe('');
    });

    it('handles elements with empty children', () => {
      const element = createElement('div', null, '');
      expect(extractTextFromReactNode(element)).toBe('');
    });

    it('handles elements with only whitespace', () => {
      const element = createElement('div', null, '   ');
      expect(extractTextFromReactNode(element)).toBe('   ');
    });

    it('handles special characters', () => {
      const element = createElement('div', null, '<>&"\'');
      expect(extractTextFromReactNode(element)).toBe('<>&"\'');
    });

    it('handles unicode characters', () => {
      const element = createElement('div', null, '你好世界 🌍');
      expect(extractTextFromReactNode(element)).toBe('你好世界 🌍');
    });

    it('handles line breaks and tabs', () => {
      const element = createElement('div', null, 'Line1\nLine2\tTabbed');
      expect(extractTextFromReactNode(element)).toBe('Line1\nLine2\tTabbed');
    });
  });

  describe('Performance', () => {
    it('handles large arrays efficiently', () => {
      const largeArray = new Array(1000).fill('x');
      const start = Date.now();
      const result = extractTextFromReactNode(largeArray);
      const duration = Date.now() - start;

      expect(result).toBe('x'.repeat(1000));
      expect(duration).toBeLessThan(100); // Should be fast
    });

    it('handles wide trees efficiently', () => {
      // Element with 100 children
      const children = new Array(100).fill(null).map((_, i) => `Child ${i}`);
      const element = createElement('div', null, ...children);

      const start = Date.now();
      const result = extractTextFromReactNode(element);
      const duration = Date.now() - start;

      expect(result).toContain('Child 0');
      expect(result).toContain('Child 99');
      expect(duration).toBeLessThan(100);
    });
  });
});
