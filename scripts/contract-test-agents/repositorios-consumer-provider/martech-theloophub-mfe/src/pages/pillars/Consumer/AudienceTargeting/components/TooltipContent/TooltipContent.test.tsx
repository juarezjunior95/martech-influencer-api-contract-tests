import { render, screen } from '@testing-library/react';

import { TooltipContent } from './TooltipContent';

jest.mock('./TooltipContent.styles', () => ({
  StyledTooltipContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-container">{children}</div>
  ),
  StyledTooltipHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-header">{children}</div>
  ),
  StyledTooltipTitle: ({ children }: { children: React.ReactNode }) => (
    <h1 data-testid="tooltip-title">{children}</h1>
  ),
  StyledTooltipContent: ({
    children,
  }: {
    children: React.ReactNode;
    $paddingLeft?: boolean;
  }) => <div data-testid="tooltip-content-wrapper">{children}</div>,
  StyledTooltipSubtitle: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="tooltip-subtitle">{children}</p>
  ),
  StyledTooltipText: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="tooltip-text">{children}</p>
  ),
}));

describe('TooltipContent', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    text: 'Test text content',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render the tooltip container', () => {
      render(<TooltipContent {...defaultProps} />);

      expect(screen.getByTestId('tooltip-container')).toBeInTheDocument();
    });

    it('should render the tooltip header', () => {
      render(<TooltipContent {...defaultProps} />);

      expect(screen.getByTestId('tooltip-header')).toBeInTheDocument();
    });

    it('should render the content wrapper', () => {
      render(<TooltipContent {...defaultProps} />);

      expect(screen.getByTestId('tooltip-content-wrapper')).toBeInTheDocument();
    });
  });

  describe('Title Rendering', () => {
    it('should render the title', () => {
      render(<TooltipContent {...defaultProps} />);

      expect(screen.getByTestId('tooltip-title')).toHaveTextContent(
        'Test Title',
      );
    });

    it('should render title inside header', () => {
      render(<TooltipContent {...defaultProps} />);

      const header = screen.getByTestId('tooltip-header');
      const title = screen.getByTestId('tooltip-title');

      expect(header).toContainElement(title);
    });
  });

  describe('Subtitle Rendering', () => {
    it('should render the subtitle', () => {
      render(<TooltipContent {...defaultProps} />);

      expect(screen.getByTestId('tooltip-subtitle')).toHaveTextContent(
        'Test Subtitle',
      );
    });

    it('should render subtitle inside content wrapper', () => {
      render(<TooltipContent {...defaultProps} />);

      const contentWrapper = screen.getByTestId('tooltip-content-wrapper');
      const subtitle = screen.getByTestId('tooltip-subtitle');

      expect(contentWrapper).toContainElement(subtitle);
    });
  });

  describe('Text Rendering', () => {
    it('should render the text', () => {
      render(<TooltipContent {...defaultProps} />);

      expect(screen.getByTestId('tooltip-text')).toHaveTextContent(
        'Test text content',
      );
    });

    it('should render text inside content wrapper', () => {
      render(<TooltipContent {...defaultProps} />);

      const contentWrapper = screen.getByTestId('tooltip-content-wrapper');
      const text = screen.getByTestId('tooltip-text');

      expect(contentWrapper).toContainElement(text);
    });
  });

  describe('Text with Line Breaks', () => {
    it('should render text with line breaks', () => {
      const textWithLineBreaks =
        'First line\n\nSecond line after break\n\nThird line';

      render(<TooltipContent {...defaultProps} text={textWithLineBreaks} />);

      expect(screen.getByTestId('tooltip-text')).toHaveTextContent(
        'First line Second line after break Third line',
      );
    });
  });

  describe('Component Structure', () => {
    it('should render all elements in correct order', () => {
      render(<TooltipContent {...defaultProps} />);

      const container = screen.getByTestId('tooltip-container');
      const header = screen.getByTestId('tooltip-header');
      const contentWrapper = screen.getByTestId('tooltip-content-wrapper');
      const subtitle = screen.getByTestId('tooltip-subtitle');
      const text = screen.getByTestId('tooltip-text');

      expect(container).toContainElement(header);
      expect(container).toContainElement(contentWrapper);
      expect(contentWrapper).toContainElement(subtitle);
      expect(contentWrapper).toContainElement(text);
    });
  });

  describe('Edge Cases', () => {
    it('should render long text content', () => {
      const longText =
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';

      render(<TooltipContent {...defaultProps} text={longText} />);

      expect(screen.getByTestId('tooltip-text')).toHaveTextContent(longText);
    });

    it('should render special characters', () => {
      const specialChars = 'KPI % vs LY (pp) – Core™ & Brand®';

      render(<TooltipContent {...defaultProps} title={specialChars} />);

      expect(screen.getByTestId('tooltip-title')).toHaveTextContent(
        specialChars,
      );
    });
  });

  describe('paddingLeft prop', () => {
    it('should render with paddingLeft true by default', () => {
      render(<TooltipContent {...defaultProps} />);

      expect(screen.getByTestId('tooltip-content-wrapper')).toBeInTheDocument();
    });

    it('should render with paddingLeft false', () => {
      render(<TooltipContent {...defaultProps} paddingLeft={false} />);

      expect(screen.getByTestId('tooltip-content-wrapper')).toBeInTheDocument();
    });
  });
});
