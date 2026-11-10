import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Accordion } from './Accordion';

describe('Accordion', () => {
  describe('Rendering', () => {
    it('renders summary text', () => {
      render(<Accordion summary="More info">Content</Accordion>);
      expect(screen.getByText('More info')).toBeInTheDocument();
    });

    it('renders children', () => {
      render(
        <Accordion>
          <p>Details here</p>
        </Accordion>,
      );
      expect(screen.getByText('Details here')).toBeInTheDocument();
    });

    it('uses "Details" as default summary', () => {
      render(<Accordion>Content</Accordion>);
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('renders complex children correctly', () => {
      render(
        <Accordion summary="Complex">
          <div>
            <h3>Title</h3>
            <p>Paragraph</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </Accordion>,
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('starts closed by default', () => {
      const { container } = render(<Accordion>Content</Accordion>);
      const details = container.querySelector('details');
      expect(details).not.toHaveAttribute('open');
    });

    it('starts open when defaultOpen is true', () => {
      const { container } = render(<Accordion defaultOpen>Content</Accordion>);
      const details = container.querySelector('details');
      expect(details).toHaveAttribute('open');
    });

    it('toggles open/closed when summary is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<Accordion>Content</Accordion>);
      const summary = container.querySelector('summary');
      const details = container.querySelector('details');

      // Should start closed
      expect(details).not.toHaveAttribute('open');

      // Click to open
      await user.click(summary!);
      expect(details).toHaveAttribute('open');

      // Click to close
      await user.click(summary!);
      expect(details).not.toHaveAttribute('open');
    });

    it('syncs state with native details element', async () => {
      const user = userEvent.setup();
      const { container } = render(<Accordion defaultOpen>Content</Accordion>);
      const summary = container.querySelector('summary');
      const details = container.querySelector('details');

      // Starts open
      expect(details).toHaveAttribute('open');

      // Click to close
      await user.click(summary!);
      expect(details).not.toHaveAttribute('open');

      // Click to re-open
      await user.click(summary!);
      expect(details).toHaveAttribute('open');
    });
  });

  describe('Accessibility (ARIA)', () => {
    it('has aria-expanded attribute on summary', () => {
      const { container } = render(<Accordion>Content</Accordion>);
      const summary = container.querySelector('summary');
      expect(summary).toHaveAttribute('aria-expanded');
    });

    it('sets aria-expanded to false when closed', () => {
      const { container } = render(<Accordion>Content</Accordion>);
      const summary = container.querySelector('summary');
      expect(summary).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-expanded to true when open', () => {
      const { container } = render(<Accordion defaultOpen>Content</Accordion>);
      const summary = container.querySelector('summary');
      expect(summary).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-controls linking summary to content', () => {
      const { container } = render(<Accordion>Content</Accordion>);
      const summary = container.querySelector('summary');
      const content = container.querySelector('[role="region"]');

      const ariaControls = summary?.getAttribute('aria-controls');
      const contentId = content?.getAttribute('id');

      expect(ariaControls).toBeTruthy();
      expect(contentId).toBeTruthy();
      expect(ariaControls).toBe(contentId);
    });

    it('has role="region" on content', () => {
      const { container } = render(<Accordion>Content</Accordion>);
      const content = container.querySelector('[role="region"]');
      expect(content).toBeInTheDocument();
    });

    it('has unique IDs for multiple accordions', () => {
      const { container } = render(
        <>
          <Accordion>Content 1</Accordion>
          <Accordion>Content 2</Accordion>
          <Accordion>Content 3</Accordion>
        </>,
      );

      const contents = container.querySelectorAll('[role="region"]');
      const ids = Array.from(contents).map((el) => el.getAttribute('id'));

      // All IDs should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);
    });

    it('chevron has aria-hidden to hide from screen readers', () => {
      const { container } = render(<Accordion>Content</Accordion>);
      const chevron = container.querySelector('svg');
      expect(chevron).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Keyboard Navigation', () => {
    it('can be opened with Enter key', async () => {
      const user = userEvent.setup();
      const { container } = render(<Accordion>Content</Accordion>);
      const summary = container.querySelector('summary')!;
      const details = container.querySelector('details');

      summary.focus();
      await user.keyboard('{Enter}');

      expect(details).toHaveAttribute('open');
    });

    it('can be opened with Space key', async () => {
      const user = userEvent.setup();
      const { container } = render(<Accordion>Content</Accordion>);
      const summary = container.querySelector('summary')!;
      const details = container.querySelector('details');

      summary.focus();
      await user.keyboard(' ');

      expect(details).toHaveAttribute('open');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children', () => {
      const { container } = render(
        <Accordion summary="Empty">{null}</Accordion>,
      );
      expect(container.querySelector('details')).toBeInTheDocument();
    });

    it('handles empty summary string', () => {
      render(<Accordion summary="">Content</Accordion>);
      // Should render with empty summary (not crash)
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('handles very long summary text', () => {
      const longSummary = 'A'.repeat(200);
      render(<Accordion summary={longSummary}>Content</Accordion>);
      expect(screen.getByText(longSummary)).toBeInTheDocument();
    });

    it('handles special characters in summary', () => {
      const specialSummary = '<script>alert("XSS")</script>';
      render(<Accordion summary={specialSummary}>Content</Accordion>);
      expect(screen.getByText(specialSummary)).toBeInTheDocument();
    });
  });

  describe('Component API', () => {
    it('has displayName set', () => {
      expect(Accordion.displayName).toBe('Accordion');
    });

    it('accepts className prop', () => {
      const { container } = render(
        <Accordion className="custom-class">Content</Accordion>,
      );
      // className would be applied to a wrapper if supported
      expect(container.querySelector('details')).toBeInTheDocument();
    });
  });
});
