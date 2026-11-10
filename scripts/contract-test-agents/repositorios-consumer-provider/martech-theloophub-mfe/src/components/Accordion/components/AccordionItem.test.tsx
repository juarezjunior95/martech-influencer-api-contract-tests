import { fireEvent, render, screen } from '@testing-library/react';

import { AccordionItem } from './AccordionItem';

jest.mock('@hexa-ui/icons', () => ({
  ChevronDown: ({ size }: any) => (
    <svg data-testid="chevron-icon" data-size={size} />
  ),
}));

jest.mock('./Accordion.styles', () => ({
  AccordionItemWrapper: ({
    children,
    className,
    'data-testid': dataTestId,
  }: any) => (
    <div
      className={className}
      data-testid={dataTestId ?? 'accordion-item-wrapper'}
    >
      {children}
    </div>
  ),
  AccordionTrigger: ({
    children,
    onClick,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'data-testid': dataTestId,
    type,
  }: any) => (
    <button
      type={type}
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      data-testid={dataTestId ?? 'accordion-trigger'}
    >
      {children}
    </button>
  ),
  AccordionIcon: ({ children, isOpen }: any) => (
    <span data-testid="accordion-icon" data-open={String(isOpen)}>
      {children}
    </span>
  ),
  AccordionContent: ({ children, isOpen }: any) => (
    <div data-testid="accordion-content-wrapper" data-open={String(isOpen)}>
      {children}
    </div>
  ),
  AccordionContentInner: ({ children, id, 'data-testid': dataTestId }: any) => (
    <div id={id} data-testid={dataTestId ?? 'accordion-content-inner'}>
      {children}
    </div>
  ),
}));

describe('AccordionItem', () => {
  const defaultProps = {
    id: 'item-1',
    title: 'Item Title',
    children: <span>Content</span>,
  };

  describe('Rendering', () => {
    it('should render accordion item wrapper', () => {
      render(<AccordionItem {...defaultProps} />);

      expect(screen.getByTestId('accordion-item-wrapper')).toBeInTheDocument();
    });

    it('should render trigger button with title', () => {
      render(<AccordionItem {...defaultProps} />);

      expect(screen.getByTestId('accordion-trigger')).toBeInTheDocument();
      expect(screen.getByText('Item Title')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(<AccordionItem {...defaultProps} />);

      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('should render with dataTestId when provided', () => {
      render(<AccordionItem {...defaultProps} dataTestId="test" />);

      expect(screen.getByTestId('accordion-test')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-trigger-test')).toBeInTheDocument();
      expect(screen.getByTestId('accordion-content-test')).toBeInTheDocument();
    });
  });

  describe('data-testid Rendering', () => {
    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(<AccordionItem {...defaultProps} />);

      expect(
        screen.queryByTestId('accordion-undefined'),
      ).not.toBeInTheDocument();
    });

    it('should set aria-controls to accordion-content-{id}', () => {
      render(<AccordionItem {...defaultProps} />);

      expect(screen.getByTestId('accordion-trigger')).toHaveAttribute(
        'aria-controls',
        'accordion-content-item-1',
      );
    });
  });

  describe('Functionality', () => {
    it('should call onToggle when trigger is clicked', () => {
      const mockOnToggle = jest.fn();
      render(<AccordionItem {...defaultProps} onToggle={mockOnToggle} />);

      fireEvent.click(screen.getByTestId('accordion-trigger'));

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should set aria-expanded to false by default', () => {
      render(<AccordionItem {...defaultProps} />);

      expect(screen.getByTestId('accordion-trigger')).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });

    it('should set aria-expanded to true when isOpen is true', () => {
      render(<AccordionItem {...defaultProps} isOpen />);

      expect(screen.getByTestId('accordion-trigger')).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });
  });

  describe('States', () => {
    it('should render chevron icon with open state', () => {
      render(<AccordionItem {...defaultProps} isOpen />);

      expect(screen.getByTestId('accordion-icon')).toHaveAttribute(
        'data-open',
        'true',
      );
    });

    it('should apply className to wrapper', () => {
      render(<AccordionItem {...defaultProps} className="custom-class" />);

      expect(screen.getByTestId('accordion-item-wrapper')).toHaveClass(
        'custom-class',
      );
    });
  });
});
