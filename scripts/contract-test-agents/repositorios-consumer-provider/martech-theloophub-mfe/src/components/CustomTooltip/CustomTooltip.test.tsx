import React from 'react';

import { render, screen } from '@testing-library/react';

const mockTrackGA = jest.fn();

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => mockTrackGA,
}));

jest.mock('./CustomTooltip.styles', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const MockTrigger = React.forwardRef(
    (
      {
        children,
        className,
        'data-testid': dataTestId,
        $fillTrigger,
        ...props
      }: any,
      ref: any,
    ) => (
      <div
        ref={ref}
        className={className}
        data-testid={dataTestId}
        {...props}
        data-fill-trigger={$fillTrigger ? 'true' : 'false'}
      >
        {children}
      </div>
    ),
  );
  MockTrigger.displayName = 'StyledCustomTooltipTrigger';
  return {
    StyledCustomTooltipRoot: ({
      children,
      onOpenChange,
      $fillTrigger,
    }: any) => (
      <button
        data-testid="styled-root"
        data-fill-trigger={$fillTrigger ? 'true' : 'false'}
        onClick={() => onOpenChange?.(true)}
        onMouseLeave={() => onOpenChange?.(false)}
      >
        {children}
      </button>
    ),
    StyledCustomTooltipTrigger: MockTrigger,
    StyledCustomTooltipIconWrap: ({ children }: any) => (
      <span data-testid="tooltip-icon-wrap">{children}</span>
    ),
    StyledCustomTooltipContent: ({
      children,
      colorType,
      size,
      side,
      sideOffset,
      backgroundStyle,
      'data-testid': dataTestId,
    }: any) => (
      <div
        data-testid={dataTestId || 'styled-content'}
        data-color-type={colorType}
        data-size={size}
        data-side={side}
        data-offset={sideOffset}
        data-background-style={backgroundStyle}
      >
        {children}
      </div>
    ),
  };
});

import { CustomTooltip } from './CustomTooltip';

describe('CustomTooltip', () => {
  const defaultProps = {
    content: 'Tooltip Content',
    children: <button>Hover me</button>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the tooltip trigger', () => {
      render(<CustomTooltip {...defaultProps} />);

      const trigger = screen.getByTestId('custom-tooltip');
      expect(trigger).toBeInTheDocument();
      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('should render tooltip content', () => {
      render(<CustomTooltip {...defaultProps} />);

      expect(screen.getByText('Tooltip Content')).toBeInTheDocument();
    });

    it('should render complex content', () => {
      render(
        <CustomTooltip
          content={
            <div>
              <strong>Title</strong>
              <p>Description</p>
            </div>
          }
        >
          <button>Trigger</button>
        </CustomTooltip>,
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('should render trigger with tooltip-trigger class', () => {
      render(<CustomTooltip {...defaultProps} />);

      const trigger = screen.getByTestId('custom-tooltip');
      expect(trigger).toHaveClass('tooltip-trigger');
    });
  });

  describe('dataTestId Prop', () => {
    it('should render with custom data-testid when dataTestId is provided', () => {
      render(<CustomTooltip {...defaultProps} dataTestId="tooltip-info" />);

      expect(screen.getByTestId('tooltip-info')).toBeInTheDocument();
    });

    it('should render default data-testid when dataTestId is not provided', () => {
      render(<CustomTooltip {...defaultProps} />);

      expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
    });

    it('should render data-testid on content element when dataTestId is provided', () => {
      render(<CustomTooltip {...defaultProps} dataTestId="tooltip-info" />);

      expect(screen.getByTestId('tooltip-info-content')).toBeInTheDocument();
    });

    it('should not render data-testid on content when dataTestId is not provided', () => {
      render(<CustomTooltip {...defaultProps} />);

      expect(
        screen.queryByTestId('custom-tooltip-content'),
      ).not.toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('should use default side value of bottom', () => {
      render(<CustomTooltip {...defaultProps} />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-side', 'bottom');
    });

    it('should pass side prop to content', () => {
      render(<CustomTooltip {...defaultProps} side="top" />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-side', 'top');
    });

    it('should pass side left to content', () => {
      render(<CustomTooltip {...defaultProps} side="left" />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-side', 'left');
    });

    it('should pass side right to content', () => {
      render(<CustomTooltip {...defaultProps} side="right" />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-side', 'right');
    });

    it('should use default size value of auto', () => {
      render(<CustomTooltip {...defaultProps} />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-size', 'auto');
    });

    it('should pass size prop to content', () => {
      render(<CustomTooltip {...defaultProps} size="small" />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-size', 'small');
    });

    it('should pass medium size to content', () => {
      render(<CustomTooltip {...defaultProps} size="medium" />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-size', 'medium');
    });

    it('should pass large size to content', () => {
      render(<CustomTooltip {...defaultProps} size="large" />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-size', 'large');
    });

    it('should use default backgroundStyle of default', () => {
      render(<CustomTooltip {...defaultProps} />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-background-style', 'default');
    });

    it('should pass backgroundStyle prop to content', () => {
      render(<CustomTooltip {...defaultProps} backgroundStyle="transparent" />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-background-style', 'transparent');
    });

    it('should pass colorType prop to content', () => {
      render(<CustomTooltip {...defaultProps} colorType="informative" />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-color-type', 'informative');
    });

    it('should pass sideOffset of 5 to content', () => {
      render(<CustomTooltip {...defaultProps} />);

      const content = screen.getByTestId('styled-content');
      expect(content).toHaveAttribute('data-offset', '5');
    });

    it('should propagate fillTrigger=true to root and trigger', () => {
      render(<CustomTooltip {...defaultProps} fillTrigger />);

      expect(screen.getByTestId('styled-root')).toHaveAttribute(
        'data-fill-trigger',
        'true',
      );
      expect(screen.getByTestId('custom-tooltip')).toHaveAttribute(
        'data-fill-trigger',
        'true',
      );
    });
  });

  describe('Google Analytics tracking', () => {
    it('should call trackGA when tooltip is opened', () => {
      render(<CustomTooltip {...defaultProps} label="Test Tooltip" />);

      const root = screen.getByTestId('styled-root');
      root.click();

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Tooltip',
        event_action: 'Opened',
        event_label: 'Test Tooltip',
      });
    });

    it('should not call trackGA when tooltip is closed', () => {
      render(<CustomTooltip {...defaultProps} label="Test Tooltip" />);

      const root = screen.getByTestId('styled-root');
      root.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));

      expect(mockTrackGA).not.toHaveBeenCalled();
    });

    it('should call trackGA with empty label when label is not provided', () => {
      render(<CustomTooltip {...defaultProps} />);

      const root = screen.getByTestId('styled-root');
      root.click();

      expect(mockTrackGA).toHaveBeenCalledWith({
        event_category: 'Tooltip',
        event_action: 'Opened',
        event_label: '',
      });
    });

    it('should handle trackGA error gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockTrackGA.mockImplementation(() => {
        throw new Error('GA Error');
      });

      render(<CustomTooltip {...defaultProps} label="Test" />);

      const root = screen.getByTestId('styled-root');
      root.click();

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to track Google Analytics event:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('children', () => {
    it('should render button as child', () => {
      render(
        <CustomTooltip content="Content">
          <button>Click me</button>
        </CustomTooltip>,
      );

      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render span as child', () => {
      render(
        <CustomTooltip content="Content">
          <span>Hover text</span>
        </CustomTooltip>,
      );

      expect(screen.getByText('Hover text')).toBeInTheDocument();
    });

    it('should render complex element as child', () => {
      render(
        <CustomTooltip content="Content">
          <div>
            <span>Icon</span>
            <span>Label</span>
          </div>
        </CustomTooltip>,
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Label')).toBeInTheDocument();
    });
  });
});
