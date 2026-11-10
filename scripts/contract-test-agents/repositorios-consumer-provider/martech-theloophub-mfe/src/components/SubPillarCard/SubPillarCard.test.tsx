import { render, screen } from '@testing-library/react';

import { SubPillarCard } from './SubPillarCard';

jest.mock('./SubPillarCard.styles', () => ({
  StyledSubPillarCard: ({ children, ...props }: any) => (
    <div data-testid="sub-pillar-card" {...props}>
      {children}
    </div>
  ),
  StyledSubPillarCardHeader: ({ children, ...props }: any) => (
    <div data-testid="sub-pillar-card-header" {...props}>
      {children}
    </div>
  ),
  StyledSubPillarCardTitle: ({ children, ...props }: any) => (
    <h2 data-testid="sub-pillar-card-title" {...props}>
      {children}
    </h2>
  ),
  StyledSubPillarCardDescription: ({ children, ...props }: any) => (
    <p data-testid="sub-pillar-card-description" {...props}>
      {children}
    </p>
  ),
  StyledSubPillarCardContent: ({ children, ...props }: any) => (
    <div data-testid="sub-pillar-card-content" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('components/CustomTooltip', () => ({
  CustomTooltip: ({ children, content, label, ...props }: any) => (
    <div
      data-testid="custom-tooltip"
      data-content={content}
      data-label={label}
      {...props}
    >
      {children}
    </div>
  ),
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, ...props }: any) => (
    <span
      data-testid="icon"
      data-icon={icon?.displayName || 'Info'}
      {...props}
    />
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  Info: { displayName: 'Info' },
}));

describe('SubPillarCard Component', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    children: <div data-testid="test-children">Test Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render with required props', () => {
      render(<SubPillarCard {...defaultProps} />);

      expect(screen.getByTestId('sub-pillar-card')).toBeInTheDocument();
      expect(screen.getByTestId('sub-pillar-card-title')).toBeInTheDocument();
      expect(
        screen.getByTestId('sub-pillar-card-description'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('sub-pillar-card-content')).toBeInTheDocument();
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('should render the component structure', () => {
      render(<SubPillarCard {...defaultProps} />);

      const card = screen.getByTestId('sub-pillar-card');
      const header = screen.getByTestId('sub-pillar-card-header');
      const title = screen.getByTestId('sub-pillar-card-title');
      const description = screen.getByTestId('sub-pillar-card-description');
      const content = screen.getByTestId('sub-pillar-card-content');

      expect(card).toContainElement(header);
      expect(card).toContainElement(title);
      expect(card).toContainElement(description);
      expect(card).toContainElement(content);
    });
  });

  describe('Title Prop', () => {
    it('should render title correctly', () => {
      render(<SubPillarCard {...defaultProps} title="Custom Title" />);

      expect(screen.getByTestId('sub-pillar-card-title')).toHaveTextContent(
        'Custom Title',
      );
    });

    it('should render with empty title', () => {
      render(<SubPillarCard {...defaultProps} title="" />);

      expect(screen.getByTestId('sub-pillar-card-title')).toHaveTextContent('');
    });

    it('should render with long title', () => {
      const longTitle = 'A'.repeat(100);
      render(<SubPillarCard {...defaultProps} title={longTitle} />);

      expect(screen.getByTestId('sub-pillar-card-title')).toHaveTextContent(
        longTitle,
      );
    });

    it('should render with special characters in title', () => {
      const specialTitle = 'Title with !@#$%^&*()';
      render(<SubPillarCard {...defaultProps} title={specialTitle} />);

      expect(screen.getByTestId('sub-pillar-card-title')).toHaveTextContent(
        specialTitle,
      );
    });
  });

  describe('Description Prop', () => {
    it('should render description correctly', () => {
      render(
        <SubPillarCard {...defaultProps} description="Custom Description" />,
      );

      expect(
        screen.getByTestId('sub-pillar-card-description'),
      ).toHaveTextContent('Custom Description');
    });

    it('should render with empty description', () => {
      render(<SubPillarCard {...defaultProps} description="" />);

      expect(
        screen.getByTestId('sub-pillar-card-description'),
      ).toHaveTextContent('');
    });

    it('should render with long description', () => {
      const longDescription = 'B'.repeat(500);
      render(<SubPillarCard {...defaultProps} description={longDescription} />);

      expect(
        screen.getByTestId('sub-pillar-card-description'),
      ).toHaveTextContent(longDescription);
    });

    it('should render with multiline description', () => {
      const multilineDescription = 'Line 1\nLine 2\nLine 3';
      render(
        <SubPillarCard {...defaultProps} description={multilineDescription} />,
      );

      const description = screen.getByTestId('sub-pillar-card-description');
      expect(description).toBeInTheDocument();
      expect(description.textContent).toContain('Line 1');
      expect(description.textContent).toContain('Line 2');
      expect(description.textContent).toContain('Line 3');
    });
  });

  describe('Children Prop', () => {
    it('should render children content', () => {
      render(<SubPillarCard {...defaultProps} />);

      const content = screen.getByTestId('sub-pillar-card-content');
      expect(content).toContainElement(screen.getByTestId('test-children'));
    });

    it('should render with simple text as children', () => {
      render(
        <SubPillarCard {...defaultProps}>
          <span>Simple Text</span>
        </SubPillarCard>,
      );

      expect(screen.getByText('Simple Text')).toBeInTheDocument();
    });

    it('should render with complex children', () => {
      render(
        <SubPillarCard {...defaultProps}>
          <div data-testid="complex-child">
            <h4>Heading</h4>
            <p>Paragraph</p>
            <button>Button</button>
          </div>
        </SubPillarCard>,
      );

      expect(screen.getByTestId('complex-child')).toBeInTheDocument();
      expect(screen.getByText('Heading')).toBeInTheDocument();
      expect(screen.getByText('Paragraph')).toBeInTheDocument();
      expect(screen.getByText('Button')).toBeInTheDocument();
    });

    it('should render with multiple children', () => {
      render(
        <SubPillarCard {...defaultProps}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </SubPillarCard>,
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    it('should render with ReactNode children (components)', () => {
      const CustomComponent = () => (
        <div data-testid="custom-component">Custom Component</div>
      );

      render(
        <SubPillarCard {...defaultProps}>
          <CustomComponent />
        </SubPillarCard>,
      );

      expect(screen.getByTestId('custom-component')).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('should render with all props fully populated', () => {
      render(
        <SubPillarCard
          title="Complete Title"
          description="Complete Description"
        >
          <div data-testid="complete-content">Complete Content</div>
        </SubPillarCard>,
      );

      expect(screen.getByText('Complete Title')).toBeInTheDocument();
      expect(screen.getByText('Complete Description')).toBeInTheDocument();
      expect(screen.getByTestId('complete-content')).toBeInTheDocument();
    });

    it('should render with HTML entities in title and description', () => {
      render(
        <SubPillarCard
          title="Title & Description"
          description='Description < > & "quote"'
        >
          <div>Content</div>
        </SubPillarCard>,
      );

      expect(screen.getByText('Title & Description')).toBeInTheDocument();
      expect(screen.getByText('Description < > & "quote"')).toBeInTheDocument();
    });

    it('should render with unicode characters', () => {
      render(
        <SubPillarCard
          title="Title with émojis 🎉"
          description="Description with 中文字符"
        >
          <div>Content</div>
        </SubPillarCard>,
      );

      expect(screen.getByText('Title with émojis 🎉')).toBeInTheDocument();
      expect(screen.getByText('Description with 中文字符')).toBeInTheDocument();
    });
  });

  describe('Content Order', () => {
    it('should render title before description', () => {
      const { container } = render(<SubPillarCard {...defaultProps} />);

      const card = container.querySelector('[data-testid="sub-pillar-card"]');
      const children = card?.children;

      expect(children?.[0]).toHaveAttribute(
        'data-testid',
        'sub-pillar-card-header',
      );
      expect(children?.[1]).toHaveAttribute(
        'data-testid',
        'sub-pillar-card-description',
      );
    });

    it('should render content area after description', () => {
      const { container } = render(<SubPillarCard {...defaultProps} />);

      const card = container.querySelector('[data-testid="sub-pillar-card"]');
      const children = card?.children;

      expect(children?.[2]).toHaveAttribute(
        'data-testid',
        'sub-pillar-card-content',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle null children gracefully', () => {
      render(<SubPillarCard {...defaultProps}>{null}</SubPillarCard>);

      expect(screen.getByTestId('sub-pillar-card-content')).toBeInTheDocument();
    });

    it('should handle undefined children gracefully', () => {
      render(<SubPillarCard {...defaultProps}>{undefined}</SubPillarCard>);

      expect(screen.getByTestId('sub-pillar-card-content')).toBeInTheDocument();
    });

    it('should handle boolean children gracefully', () => {
      render(
        <SubPillarCard {...defaultProps}>
          {true}
          {false}
        </SubPillarCard>,
      );

      expect(screen.getByTestId('sub-pillar-card-content')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<SubPillarCard {...defaultProps} />);

      const title = screen.getByTestId('sub-pillar-card-title');
      expect(title.tagName).toBe('H2');
    });

    it('should have proper paragraph element for description', () => {
      render(<SubPillarCard {...defaultProps} />);

      const description = screen.getByTestId('sub-pillar-card-description');
      expect(description.tagName).toBe('P');
    });
  });

  describe('Reusability', () => {
    it('should render multiple instances independently', () => {
      const { container } = render(
        <>
          <SubPillarCard title="Card 1" description="Description 1">
            <div>Content 1</div>
          </SubPillarCard>
          <SubPillarCard title="Card 2" description="Description 2">
            <div>Content 2</div>
          </SubPillarCard>
        </>,
      );

      const cards = container.querySelectorAll(
        '[data-testid="sub-pillar-card"]',
      );
      expect(cards).toHaveLength(2);
      expect(screen.getByText('Card 1')).toBeInTheDocument();
      expect(screen.getByText('Card 2')).toBeInTheDocument();
    });
  });

  describe('Tooltip', () => {
    it('should not render tooltip by default when no tooltip is provided', () => {
      render(<SubPillarCard {...defaultProps} />);

      expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
    });

    it('should render tooltip when tooltip prop is provided', () => {
      render(<SubPillarCard {...defaultProps} tooltip="Tooltip text" />);

      expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
    });

    it('should render tooltip with correct content and label', () => {
      render(
        <SubPillarCard
          {...defaultProps}
          tooltip="Helpful information"
          title="Test Title"
        />,
      );

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('data-content', 'Helpful information');
      expect(tooltip).toHaveAttribute('data-label', 'Test Title');
    });

    it('should render icon inside tooltip', () => {
      render(<SubPillarCard {...defaultProps} tooltip="Tooltip text" />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toHaveAttribute('data-icon', 'Info');
    });

    it('should not render tooltip when tooltip is empty string', () => {
      render(<SubPillarCard {...defaultProps} tooltip="" />);

      expect(screen.queryByTestId('custom-tooltip')).not.toBeInTheDocument();
    });

    it('should render tooltip with long tooltip text', () => {
      const longTooltip = 'A'.repeat(200);
      render(<SubPillarCard {...defaultProps} tooltip={longTooltip} />);

      const tooltip = screen.getByTestId('custom-tooltip');
      expect(tooltip).toHaveAttribute('data-content', longTooltip);
    });
  });
});
