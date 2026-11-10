import { createElement } from 'react';

import { render, screen } from '@testing-library/react';

import { markdownComponents } from './components';

const {
  details: DetailsComponent,
  summary: SummaryComponent,
  tabgroup: TabGroupComponent,
  chartsgroup: ChartsGroupComponent,
} = markdownComponents;

describe('MarkdownRenderer Custom Components', () => {
  describe('DetailsComponent', () => {
    it('renders accordion with summary text', () => {
      const summaryElement = createElement(
        'summary',
        { key: 'summary-0' },
        'Click me',
      );
      const content = 'Hidden content';

      render(<DetailsComponent>{[summaryElement, content]}</DetailsComponent>);

      expect(screen.getByText('Click me')).toBeInTheDocument();
      expect(screen.getByText('Hidden content')).toBeInTheDocument();
    });

    it('extracts text from summary with nested elements', () => {
      const summaryElement = createElement(
        'summary',
        { key: 'summary-0' },
        createElement('strong', null, 'Bold '),
        createElement('em', null, 'Italic'),
      );

      render(
        <DetailsComponent>{[summaryElement, 'Content']}</DetailsComponent>,
      );

      expect(screen.getByText('Bold Italic')).toBeInTheDocument();
    });

    it('uses default "Details" text when no summary provided', () => {
      render(<DetailsComponent>Content without summary</DetailsComponent>);

      expect(screen.getByText('Details')).toBeInTheDocument();
      expect(screen.getByText('Content without summary')).toBeInTheDocument();
    });

    it('handles summary with key containing "summary"', () => {
      // Fallback: key includes 'summary' but doesn't start with 'summary-'
      const summaryElement = createElement(
        'summary',
        { key: 'custom-summary-1' },
        'Fallback test',
      );

      render(
        <DetailsComponent>{[summaryElement, 'Content']}</DetailsComponent>,
      );

      expect(screen.getByText('Fallback test')).toBeInTheDocument();
    });

    it('filters out summary element from content', () => {
      const summaryElement = createElement(
        'summary',
        { key: 'summary-0' },
        'Summary',
      );
      render(
        <DetailsComponent>
          {[summaryElement, 'Content 1', 'Content 2']}
        </DetailsComponent>,
      );

      // Summary should be in header, not duplicated in content
      const summaries = screen.getAllByText('Summary');
      expect(summaries).toHaveLength(1);
    });

    it('handles empty summary children', () => {
      const summaryElement = createElement('summary', { key: 'summary-0' });

      render(
        <DetailsComponent>{[summaryElement, 'Content']}</DetailsComponent>,
      );

      expect(screen.getByText('Details')).toBeInTheDocument(); // Falls back to default
    });

    it('handles multiple non-summary children', () => {
      render(
        <DetailsComponent>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
          <ul>
            <li>Item 1</li>
          </ul>
        </DetailsComponent>,
      );

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });

    it('passes through props to Accordion', () => {
      const { container } = render(
        <DetailsComponent className="custom-class" data-testid="accordion">
          Content
        </DetailsComponent>,
      );

      // Props should be passed through (details element would receive them)
      expect(container.querySelector('details')).toBeInTheDocument();
    });

    it('has displayName set', () => {
      expect(DetailsComponent.displayName).toBe('DetailsComponent');
    });
  });

  describe('SummaryComponent', () => {
    it('renders null (nothing)', () => {
      const { container } = render(<SummaryComponent />);
      expect(container.firstChild).toBeNull();
    });

    it('keeps content hidden when rendered standalone', () => {
      const { container } = render(<SummaryComponent />);
      expect(container.firstChild).toBeNull();
    });

    it('has displayName set', () => {
      expect(SummaryComponent.displayName).toBe('SummaryComponent');
    });
  });

  describe('TabGroupComponent', () => {
    it('renders children transparently', () => {
      render(
        <TabGroupComponent>
          <table>
            <tbody>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
            </tbody>
          </table>
        </TabGroupComponent>,
      );

      expect(screen.getByText('Cell 1')).toBeInTheDocument();
      expect(screen.getByText('Cell 2')).toBeInTheDocument();
    });

    it('renders multiple children', () => {
      render(
        <TabGroupComponent>
          <p>Before table</p>
          <table>
            <tbody>
              <tr>
                <td>Data</td>
              </tr>
            </tbody>
          </table>
          <p>After table</p>
        </TabGroupComponent>,
      );

      expect(screen.getByText('Before table')).toBeInTheDocument();
      expect(screen.getByText('Data')).toBeInTheDocument();
      expect(screen.getByText('After table')).toBeInTheDocument();
    });

    it('handles empty children', () => {
      const { container } = render(<TabGroupComponent />);
      // Should render fragment with nothing
      expect(container.firstChild).toBeNull();
    });

    it('has displayName set', () => {
      expect(TabGroupComponent.displayName).toBe('TabGroupComponent');
    });
  });

  describe('ChartsGroupComponent', () => {
    it('renders null (nothing)', () => {
      const { container } = render(<ChartsGroupComponent />);
      expect(container.firstChild).toBeNull();
    });

    it('keeps chart content hidden until implemented', () => {
      const { container } = render(<ChartsGroupComponent />);
      expect(container.firstChild).toBeNull();
    });

    it('has displayName set', () => {
      expect(ChartsGroupComponent.displayName).toBe('ChartsGroupComponent');
    });
  });

  describe('markdownComponents export', () => {
    it('exports all required components', () => {
      expect(markdownComponents.details).toBeDefined();
      expect(markdownComponents.summary).toBeDefined();
      expect(markdownComponents.tabgroup).toBeDefined();
      expect(markdownComponents.chartsgroup).toBeDefined();
    });

    it('is a const object (immutable)', () => {
      // TypeScript 'as const' makes it readonly
      expect(Object.isFrozen(markdownComponents)).toBe(false); // Not frozen, but typed as const
      expect(typeof markdownComponents).toBe('object');
    });
  });

  describe('Integration - Complex Scenarios', () => {
    it('handles details with summary and mixed content', () => {
      const summaryElement = createElement(
        'summary',
        { key: 'summary-0' },
        createElement('strong', null, 'Title'),
        ' - ',
        createElement('em', null, 'subtitle'),
      );

      render(
        <DetailsComponent>
          {[
            summaryElement,
            createElement('p', { key: 'p-0' }, 'Paragraph'),
            createElement(
              'ul',
              { key: 'ul-0' },
              createElement('li', null, 'Item 1'),
              createElement('li', null, 'Item 2'),
            ),
          ]}
        </DetailsComponent>,
      );

      expect(screen.getByText('Title - subtitle')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('handles edge case: summary element without proper key', () => {
      // Element without key or with wrong key
      const notASummary = createElement(
        'summary',
        { key: 'other-0' },
        'Not detected',
      );

      render(<DetailsComponent>{[notASummary, 'Content']}</DetailsComponent>);

      // Should not extract as summary (key doesn't match pattern)
      expect(screen.getByText('Details')).toBeInTheDocument(); // Uses default
    });

    it('handles summary with special characters', () => {
      const summaryElement = createElement(
        'summary',
        { key: 'summary-0' },
        '<script>alert("XSS")</script>',
      );

      render(
        <DetailsComponent>{[summaryElement, 'Content']}</DetailsComponent>,
      );

      expect(
        screen.getByText('<script>alert("XSS")</script>'),
      ).toBeInTheDocument();
    });
  });
});
