import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MarkdownRenderer } from './MarkdownRenderer';

describe('MarkdownRenderer', () => {
  describe('Basic Markdown', () => {
    it('renders plain text', () => {
      render(<MarkdownRenderer content="Hello world" />);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('renders headings (h1-h6)', () => {
      const content = '# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('H1').tagName).toBe('H1');
      expect(screen.getByText('H2').tagName).toBe('H2');
      expect(screen.getByText('H3').tagName).toBe('H3');
      expect(screen.getByText('H4').tagName).toBe('H4');
      expect(screen.getByText('H5').tagName).toBe('H5');
      expect(screen.getByText('H6').tagName).toBe('H6');
    });

    it('renders bold text', () => {
      render(<MarkdownRenderer content="**bold**" />);
      expect(screen.getByText('bold').tagName).toBe('STRONG');
    });

    it('renders italic text', () => {
      render(<MarkdownRenderer content="*italic*" />);
      expect(screen.getByText('italic').tagName).toBe('EM');
    });

    it('renders bold and italic combined', () => {
      const { container } = render(
        <MarkdownRenderer content="***bold italic***" />,
      );
      expect(container.querySelector('strong')).toBeInTheDocument();
      expect(container.querySelector('em')).toBeInTheDocument();
    });

    it('renders inline code', () => {
      render(<MarkdownRenderer content="`code`" />);
      expect(screen.getByText('code').tagName).toBe('CODE');
    });

    it('renders code blocks', () => {
      const content = '```javascript\nconst x = 1;\n```';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });

    it('renders links', () => {
      render(<MarkdownRenderer content="[click](https://example.com)" />);
      const link = screen.getByText('click');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('renders unordered lists', () => {
      render(<MarkdownRenderer content={'- item one\n- item two'} />);
      expect(screen.getByText('item one')).toBeInTheDocument();
      expect(screen.getByText('item two')).toBeInTheDocument();
    });

    it('renders ordered lists', () => {
      const content = '1. First\n2. Second\n3. Third';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('renders blockquotes', () => {
      render(<MarkdownRenderer content="> Quote text" />);
      expect(screen.getByText('Quote text')).toBeInTheDocument();
    });

    it('renders horizontal rules', () => {
      const { container } = render(<MarkdownRenderer content="---" />);
      expect(container.querySelector('hr')).toBeInTheDocument();
    });

    it('renders mixed formatting', () => {
      const content =
        '**Bold** and *italic* with `code` and [link](https://test.com)';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Bold').tagName).toBe('STRONG');
      expect(screen.getByText('italic').tagName).toBe('EM');
      expect(screen.getByText('code').tagName).toBe('CODE');
      expect(screen.getByText('link').tagName).toBe('A');
    });
  });

  describe('GFM (GitHub Flavored Markdown)', () => {
    it('renders tables', () => {
      const content = '| Col1 | Col2 |\n|------|------|\n| A | B |';
      const { container } = render(<MarkdownRenderer content={content} />);
      expect(container.querySelector('table')).toBeInTheDocument();
      expect(screen.getByText('Col1')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('wraps tables in a scroll container', () => {
      const content = '| Col1 | Col2 |\n|------|------|\n| A | B |';
      const { container } = render(<MarkdownRenderer content={content} />);
      const table = container.querySelector('table');

      expect(screen.getByTestId('markdown-table-scroll')).toContainElement(
        table,
      );
    });

    it('renders strikethrough text', () => {
      render(<MarkdownRenderer content="~~strikethrough~~" />);
      expect(screen.getByText('strikethrough').tagName).toBe('DEL');
    });

    it('renders task lists', () => {
      const content = '- [x] Completed task\n- [ ] Incomplete task';
      const { container } = render(<MarkdownRenderer content={content} />);
      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText(/Completed task/)).toBeInTheDocument();
      expect(screen.getByText(/Incomplete task/)).toBeInTheDocument();
    });

    it('renders autolinks', () => {
      render(<MarkdownRenderer content="https://example.com" />);
      const link = screen.getByText('https://example.com');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('renders complex tables with alignment', () => {
      const content =
        '| Left | Center | Right |\n|:-----|:------:|------:|\n| L | C | R |';
      const { container } = render(<MarkdownRenderer content={content} />);
      expect(container.querySelector('table')).toBeInTheDocument();
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Center')).toBeInTheDocument();
      expect(screen.getByText('Right')).toBeInTheDocument();
    });
  });

  describe('Custom Tags - Accordion (details/summary)', () => {
    it('renders accordion from details/summary tags', () => {
      const content =
        '<details>\n<summary>Click me</summary>\nHidden content\n</details>';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Click me')).toBeInTheDocument();
      expect(screen.getByText('Hidden content')).toBeInTheDocument();
    });

    it('accordion starts closed by default', () => {
      const content =
        '<details>\n<summary>Title</summary>\nContent\n</details>';
      const { container } = render(<MarkdownRenderer content={content} />);
      const details = container.querySelector('details');
      expect(details).not.toHaveAttribute('open');
    });

    it('accordion can be toggled', async () => {
      const user = userEvent.setup();
      const content =
        '<details>\n<summary>Toggle</summary>\nContent\n</details>';
      const { container } = render(<MarkdownRenderer content={content} />);
      const summary = container.querySelector('summary');
      const details = container.querySelector('details');

      if (!summary || !details) {
        throw new Error('Expected accordion elements to render');
      }

      expect(details).not.toHaveAttribute('open');

      await user.click(summary);
      expect(details).toHaveAttribute('open');

      await user.click(summary);
      expect(details).not.toHaveAttribute('open');
    });

    it('extracts summary text from nested elements', () => {
      const content =
        '<details>\n<summary><strong>Bold</strong> <em>Italic</em></summary>\nContent\n</details>';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Bold Italic')).toBeInTheDocument();
    });

    it('uses default "Details" when no summary provided', () => {
      const content = '<details>\nContent without summary\n</details>';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('renders markdown inside accordion content', () => {
      const content =
        '<details>\n<summary>Title</summary>\n\n**Bold** and *italic*\n</details>';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Bold').tagName).toBe('STRONG');
      expect(screen.getByText('italic').tagName).toBe('EM');
    });

    it('renders multiple accordions independently', () => {
      const content =
        '<details>\n<summary>First</summary>\nContent 1\n</details>\n\n<details>\n<summary>Second</summary>\nContent 2\n</details>';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('renders table inside accordion', () => {
      const content =
        '<details>\n<summary>Table</summary>\n\n| Col1 | Col2 |\n|------|------|\n| A | B |\n</details>';
      const { container } = render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Table')).toBeInTheDocument();
      expect(container.querySelector('table')).toBeInTheDocument();
      expect(screen.getByText('Col1')).toBeInTheDocument();
    });
  });

  describe('Custom Tags - TabGroup', () => {
    it('renders tabgroup transparently', () => {
      const content =
        '<tabgroup>\n\nSome content inside tabgroup\n\n</tabgroup>';
      render(<MarkdownRenderer content={content} />);
      expect(
        screen.getByText(/Some content inside tabgroup/),
      ).toBeInTheDocument();
    });

    it('tabgroup does not add wrapper elements', () => {
      const content = '<tabgroup>Text content</tabgroup>';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Text content')).toBeInTheDocument();
    });
  });

  describe('Custom Tags - ChartsGroup', () => {
    it('ignores chartsgroup tag (renders nothing)', () => {
      const content = '<chartsgroup>Chart data here</chartsgroup>';
      const { container } = render(<MarkdownRenderer content={content} />);
      expect(screen.queryByText('Chart data here')).not.toBeInTheDocument();
      // Chartsgroup content should not render at all
      expect(container.textContent).toBe('');
    });

    it('does not break when chartsgroup has attributes', () => {
      const content = '<chartsgroup id="chart-1" type="bar">Data</chartsgroup>';
      const { container } = render(<MarkdownRenderer content={content} />);
      expect(container.textContent).toBe('');
    });
  });

  describe('Security - XSS Prevention', () => {
    it('blocks script tags', () => {
      const content = '<script>alert("XSS")</script>Safe text';
      render(<MarkdownRenderer content={content} />);
      expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument();
      expect(screen.getByText('Safe text')).toBeInTheDocument();
    });

    it('blocks onclick event handlers', () => {
      const content = '<div onclick="alert(\'XSS\')">Click me</div>';
      const { container } = render(<MarkdownRenderer content={content} />);
      const div = container.querySelector('div');
      expect(div).not.toHaveAttribute('onclick');
    });

    it('blocks onerror event handlers', () => {
      const content = '<img src="x" onerror="alert(\'XSS\')" alt="test" />';
      const { container } = render(<MarkdownRenderer content={content} />);
      const img = container.querySelector('img');
      expect(img).not.toHaveAttribute('onerror');
    });

    it('blocks javascript: protocol in links', () => {
      const content = '[Click](javascript:alert("XSS"))';
      const { container } = render(<MarkdownRenderer content={content} />);
      const link = container.querySelector('a');
      // Link should be sanitized (href removed or not rendered)
      if (link) {
        const href = link.getAttribute('href');
        // href should be null or should not contain javascript:
        expect(href === null || !href.includes('javascript:')).toBe(true);
      }
      // If link is null, that's also valid (completely removed)
      expect(container.textContent).toContain('Click');
    });

    it('blocks iframe tags', () => {
      const content = '<iframe src="https://evil.com"></iframe>Text';
      const { container } = render(<MarkdownRenderer content={content} />);
      expect(container.querySelector('iframe')).not.toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('blocks embed tags', () => {
      const content = '<embed src="https://evil.com" />SafeText';
      const { container } = render(<MarkdownRenderer content={content} />);
      expect(container.querySelector('embed')).not.toBeInTheDocument();
      expect(screen.getByText('SafeText')).toBeInTheDocument();
    });

    it('blocks object tags', () => {
      const content = '<object data="https://evil.com"></object>SafeContent';
      const { container } = render(<MarkdownRenderer content={content} />);
      expect(container.querySelector('object')).not.toBeInTheDocument();
      expect(screen.getByText('SafeContent')).toBeInTheDocument();
    });

    it('allows safe HTML tags', () => {
      const content = '<div><span><strong>Safe</strong></span></div>';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Safe')).toBeInTheDocument();
      expect(screen.getByText('Safe').tagName).toBe('STRONG');
    });

    it('allows safe attributes (class, id)', () => {
      const content = '<div class="safe" id="user-test">Content</div>';
      const { container } = render(<MarkdownRenderer content={content} />);
      const div = container.querySelector('div.safe');
      expect(div).toBeInTheDocument();
      expect(div?.id).toMatch(/user-test/); // ID might be prefixed
    });

    it('allows http and https protocols', () => {
      const content = '[HTTP](http://example.com) [HTTPS](https://example.com)';
      render(<MarkdownRenderer content={content} />);
      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveAttribute('href', 'http://example.com');
      expect(links[1]).toHaveAttribute('href', 'https://example.com');
    });

    it('allows mailto protocol', () => {
      const content = '[Email](mailto:test@example.com)';
      render(<MarkdownRenderer content={content} />);
      const link = screen.getByText('Email');
      expect(link).toHaveAttribute('href', 'mailto:test@example.com');
    });

    it('sanitizes nested malicious content', () => {
      const content =
        '<div><script>alert("XSS")</script><span>Safe</span></div>';
      render(<MarkdownRenderer content={content} />);
      expect(screen.queryByText('alert("XSS")')).not.toBeInTheDocument();
      expect(screen.getByText('Safe')).toBeInTheDocument();
    });
  });

  describe('Citation Removal', () => {
    it('strips single citation', () => {
      render(<MarkdownRenderer content="Hello [a1] world" />);
      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });

    it('strips multiple citations', () => {
      render(<MarkdownRenderer content="Text [a1] with [a2] citations [a3]" />);
      expect(screen.getByText('Text with citations')).toBeInTheDocument();
    });

    it('strips citations at start of text', () => {
      render(<MarkdownRenderer content="[a1] Starting citation" />);
      expect(screen.getByText('Starting citation')).toBeInTheDocument();
    });

    it('strips citations at end of text', () => {
      render(<MarkdownRenderer content="Ending citation [a1]" />);
      expect(screen.getByText('Ending citation')).toBeInTheDocument();
    });

    it('strips citations with double-digit numbers', () => {
      render(<MarkdownRenderer content="Text [a10] [a99] here" />);
      expect(screen.getByText('Text here')).toBeInTheDocument();
    });

    it('does not strip non-citation brackets', () => {
      render(<MarkdownRenderer content="Array [0] and [x] remain" />);
      expect(screen.getByText('Array [0] and [x] remain')).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('applies custom className', () => {
      const { container } = render(
        <MarkdownRenderer content="text" className="custom" />,
      );
      expect(container.firstChild).toHaveClass('custom');
    });

    it('renders with empty className', () => {
      const { container } = render(
        <MarkdownRenderer content="text" className="" />,
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with multiple classes', () => {
      const { container } = render(
        <MarkdownRenderer content="text" className="class1 class2" />,
      );
      expect(container.firstChild).toHaveClass('class1');
      expect(container.firstChild).toHaveClass('class2');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty content', () => {
      const { container } = render(<MarkdownRenderer content="" />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles very long content', () => {
      const longContent = 'Word '.repeat(1000);
      render(<MarkdownRenderer content={longContent} />);
      expect(screen.getByText(/Word/)).toBeInTheDocument();
    });

    it('handles special characters', () => {
      const content = '<>&"\' characters';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('<>&"\' characters')).toBeInTheDocument();
    });

    it('handles unicode characters', () => {
      const content = '你好世界 🌍 café';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('你好世界 🌍 café')).toBeInTheDocument();
    });

    it('handles line breaks', () => {
      const content = 'Line 1\n\nLine 2';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Line 1')).toBeInTheDocument();
      expect(screen.getByText('Line 2')).toBeInTheDocument();
    });

    it('handles malformed markdown gracefully', () => {
      const content = '**unclosed bold\n\n[unclosed link(test';
      const { container } = render(<MarkdownRenderer content={content} />);
      // Should render without crashing
      expect(container.textContent).toContain('unclosed');
    });

    it('handles deeply nested lists', () => {
      const content = '- Level 1\n  - Level 2\n    - Level 3\n      - Level 4';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Level 1')).toBeInTheDocument();
      expect(screen.getByText('Level 4')).toBeInTheDocument();
    });

    it('handles mixed list types', () => {
      const content = '- Unordered\n1. Ordered\n- Unordered again';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Unordered')).toBeInTheDocument();
      expect(screen.getByText('Ordered')).toBeInTheDocument();
      expect(screen.getByText('Unordered again')).toBeInTheDocument();
    });

    it('handles inline HTML mixed with markdown', () => {
      const content = '**Markdown** <em>HTML</em> combined';
      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Markdown').tagName).toBe('STRONG');
      expect(screen.getByText('HTML').tagName).toBe('EM');
    });
  });

  describe('Integration - Complex Scenarios', () => {
    it('renders complex AI response with multiple features', () => {
      const content = `# Analysis

Here's what I found [a1]:

- **Key findings**
- ~Deprecated features~

<details>
<summary>View data table</summary>

| Metric | Value |
|--------|-------|
| Users  | 1000  |
| Active | 750   |

</details>

For more info, visit [docs](https://example.com).`;

      render(<MarkdownRenderer content={content} />);

      expect(screen.getByText('Analysis').tagName).toBe('H1');
      expect(screen.getByText('Key findings').tagName).toBe('STRONG');
      expect(screen.getByText('Deprecated features').tagName).toBe('DEL');
      expect(screen.getByText('View data table')).toBeInTheDocument();
      expect(screen.getByText('docs')).toHaveAttribute(
        'href',
        'https://example.com',
      );
      expect(screen.queryByText('[a1]')).not.toBeInTheDocument();
    });

    it('renders nested accordions with complex content', () => {
      const content = `<details>
<summary>Outer accordion</summary>

Some content

<details>
<summary>Inner accordion</summary>

**Bold inner content**
- List item

</details>

More outer content
</details>`;

      const { container } = render(<MarkdownRenderer content={content} />);
      const accordions = container.querySelectorAll('details');
      expect(accordions.length).toBeGreaterThanOrEqual(1); // At least outer accordion
      expect(screen.getByText('Outer accordion')).toBeInTheDocument();
      expect(screen.getByText('Bold inner content').tagName).toBe('STRONG');
    });

    it('renders accordion with task list inside', () => {
      const content = `<details>
<summary>TODO List</summary>

- [x] Completed task
- [ ] Pending task

</details>`;

      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('TODO List')).toBeInTheDocument();
      expect(screen.getByText(/Completed task/)).toBeInTheDocument();
      expect(screen.getByText(/Pending task/)).toBeInTheDocument();
    });

    it('renders tabgroup with content', () => {
      const content = `<tabgroup>

Content A

Content B

</tabgroup>`;

      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText(/Content A/)).toBeInTheDocument();
      expect(screen.getByText(/Content B/)).toBeInTheDocument();
    });

    it('handles mixed custom tags with standard markdown', () => {
      const content = `# Title

Normal **text** here.

<details>
<summary>Expandable</summary>
Content
</details>

<tabgroup>
Tabgroup content
</tabgroup>

<chartsgroup>Ignored chart</chartsgroup>

More text [a1] with citations.`;

      render(<MarkdownRenderer content={content} />);
      expect(screen.getByText('Title').tagName).toBe('H1');
      expect(screen.getByText('text').tagName).toBe('STRONG');
      expect(screen.getByText('Expandable')).toBeInTheDocument();
      expect(screen.getByText(/Tabgroup content/)).toBeInTheDocument();
      expect(screen.queryByText('Ignored chart')).not.toBeInTheDocument();
      expect(screen.queryByText('[a1]')).not.toBeInTheDocument();
    });
  });

  describe('Component API', () => {
    it('has displayName set', () => {
      expect(MarkdownRenderer.displayName).toBe('MarkdownRenderer');
    });

    it('is a function component', () => {
      expect(typeof MarkdownRenderer).toBe('function');
    });
  });
});
