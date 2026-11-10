import { fireEvent, render, screen } from '@testing-library/react';

import { TemplateCard } from './TemplateCard';

describe('TemplateCard', () => {
  describe('Basic Rendering', () => {
    it('should render with description', () => {
      render(<TemplateCard description="Test description" />);
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render with title and description', () => {
      render(
        <TemplateCard title="Test Title" description="Test description" />,
      );
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
    });

    it('should render arrow icon', () => {
      const { container } = render(<TemplateCard description="Test" />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('should forward ref correctly', () => {
      const ref = { current: null };
      render(<TemplateCard ref={ref} description="Test" />);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Accessibility', () => {
    it('should have role="button"', () => {
      render(<TemplateCard description="Test" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have tabIndex=0', () => {
      render(<TemplateCard description="Test" />);
      expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
    });
  });

  describe('Click Events', () => {
    it('should call onClick when clicked', () => {
      const handleClick = jest.fn();
      render(<TemplateCard description="Test" onClick={handleClick} />);

      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Enter is pressed', () => {
      const handleClick = jest.fn();
      render(<TemplateCard description="Test" onClick={handleClick} />);

      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick when Space is pressed', () => {
      const handleClick = jest.fn();
      render(<TemplateCard description="Test" onClick={handleClick} />);

      fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick for other keys', () => {
      const handleClick = jest.fn();
      render(<TemplateCard description="Test" onClick={handleClick} />);

      fireEvent.keyDown(screen.getByRole('button'), { key: 'a' });
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Title Styling', () => {
    it('should render title with correct element', () => {
      render(<TemplateCard title="Title" description="Desc" />);
      expect(screen.getByText('Title').tagName).toBe('H4');
    });

    it('should render description with correct element', () => {
      render(<TemplateCard description="Desc" />);
      expect(screen.getByText('Desc').tagName).toBe('P');
    });

    it('should have descSmall class when title is present', () => {
      const { container } = render(
        <TemplateCard title="Title" description="Desc" />,
      );
      expect(container.querySelector('p')).toHaveAttribute(
        'data-desc-size',
        'small',
      );
    });

    it('should have descLarge class when title is not present', () => {
      const { container } = render(<TemplateCard description="Desc" />);
      expect(container.querySelector('p')).toHaveAttribute(
        'data-desc-size',
        'large',
      );
    });
  });

  describe('Custom className', () => {
    it('should accept custom className', () => {
      const { container } = render(
        <TemplateCard description="Test" className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Additional Props', () => {
    it('should pass through additional props', () => {
      render(<TemplateCard description="Test" data-testid="template-card" />);
      expect(screen.getByTestId('template-card')).toBeInTheDocument();
    });
  });
});
