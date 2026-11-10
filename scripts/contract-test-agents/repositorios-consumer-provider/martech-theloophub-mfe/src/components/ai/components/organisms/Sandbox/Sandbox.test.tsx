import { render, screen } from '@testing-library/react';

import { Sandbox } from './Sandbox';

describe('Sandbox', () => {
  describe('Basic Rendering', () => {
    it('should render children', () => {
      render(
        <Sandbox>
          <p>Test Content</p>
        </Sandbox>,
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<Sandbox ref={ref}>Content</Sandbox>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Header', () => {
    it('should render title when provided', () => {
      render(<Sandbox title="Test Title">Content</Sandbox>);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(<Sandbox description="Test description">Content</Sandbox>);
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render both title and description', () => {
      render(
        <Sandbox title="Title" description="Description">
          Content
        </Sandbox>,
      );
      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should not render header when no title or description', () => {
      const { container } = render(<Sandbox>Content</Sandbox>);
      expect(container.querySelector('h4')).not.toBeInTheDocument();
    });

    it('should render three control dots', () => {
      const { container } = render(<Sandbox title="Test">Content</Sandbox>);
      const controls = container
        .querySelector('h4')
        ?.closest('div')
        ?.parentElement?.querySelector('div:last-child');
      const dots = controls?.children;
      expect(dots).toHaveLength(3);
    });
  });

  describe('Dimensions', () => {
    it('should apply height as number', () => {
      const { container } = render(<Sandbox height={500}>Content</Sandbox>);
      const viewport = container.querySelector('[data-sandbox-viewport]');
      expect(viewport).toHaveStyle({ height: '500px' });
    });

    it('should apply height as string', () => {
      const { container } = render(<Sandbox height="100%">Content</Sandbox>);
      const viewport = container.querySelector('[data-sandbox-viewport]');
      expect(viewport).toHaveStyle({ height: '100%' });
    });

    it('should apply width when provided', () => {
      const { container } = render(<Sandbox width={600}>Content</Sandbox>);
      const viewport = container.querySelector('[data-sandbox-viewport]');
      expect(viewport).toHaveStyle({ width: '600px' });
    });

    it('should use default height of 400', () => {
      const { container } = render(<Sandbox>Content</Sandbox>);
      const viewport = container.querySelector('[data-sandbox-viewport]');
      expect(viewport).toHaveStyle({ height: '400px' });
    });
  });

  describe('Padding', () => {
    it('should apply padding as number', () => {
      const { container } = render(<Sandbox padding={32}>Content</Sandbox>);
      const viewport = container.querySelector('[data-sandbox-viewport]');
      const content = viewport?.firstElementChild;
      expect(content).toHaveStyle({ padding: '32px' });
    });

    it('should apply padding as string', () => {
      const { container } = render(
        <Sandbox padding="16px 24px">Content</Sandbox>,
      );
      const viewport = container.querySelector('[data-sandbox-viewport]');
      const content = viewport?.firstElementChild;
      expect(content).toHaveStyle({ padding: '16px 24px' });
    });

    it('should use default padding of 24', () => {
      const { container } = render(<Sandbox>Content</Sandbox>);
      const viewport = container.querySelector('[data-sandbox-viewport]');
      const content = viewport?.firstElementChild;
      expect(content).toHaveStyle({ padding: '24px' });
    });
  });

  describe('Frame', () => {
    it('should not show frame by default', () => {
      const { container } = render(<Sandbox>Content</Sandbox>);
      const viewport = container.querySelector('[data-sandbox-viewport]');
      // Without frame, content is direct child of viewport
      expect(viewport?.children).toHaveLength(1);
    });

    it('should show frame when showFrame is true', () => {
      const { container } = render(<Sandbox showFrame>Content</Sandbox>);
      const viewport = container.querySelector('[data-sandbox-viewport]');
      // With frame, there's a wrapper div between viewport and content
      const frame = viewport?.firstElementChild;
      expect(frame?.firstElementChild).toBeTruthy();
    });
  });

  describe('Custom className and style', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <Sandbox className="custom-class">Content</Sandbox>,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should accept custom style', () => {
      const { container } = render(
        <Sandbox style={{ border: '2px solid red' }}>Content</Sandbox>,
      );
      expect(container.firstChild).toHaveStyle({ border: '2px solid red' });
    });
  });

  describe('Data Attributes', () => {
    it('should have data-sandbox-viewport attribute', () => {
      const { container } = render(<Sandbox>Content</Sandbox>);
      expect(
        container.querySelector('[data-sandbox-viewport]'),
      ).toBeInTheDocument();
    });
  });
});
