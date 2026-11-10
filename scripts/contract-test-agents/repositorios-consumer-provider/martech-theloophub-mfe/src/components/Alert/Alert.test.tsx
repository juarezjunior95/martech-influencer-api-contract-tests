import { fireEvent, render, screen } from '@testing-library/react';

import { Alert } from './Alert';

jest.mock('@hexa-ui/components', () => ({
  TextButton: ({ children, onClick, ...props }: any) => (
    <button data-testid="text-button" onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@hexa-ui/components2', () => ({
  Icon: ({ icon, style }: any) => (
    <span data-testid="icon" data-icon={icon} style={style}>
      Icon
    </span>
  ),
}));

jest.mock('@hexa-ui/icons2', () => ({
  AlertTriangle: 'alert-triangle',
  AlertOctagon: 'alert-octagon',
  Checkmark2: 'checkmark-2',
  Info: 'info',
}));

jest.mock('@hexa-ui/icons', () => ({
  Plus: (props: any) => <span data-testid="plus-icon" {...props} />,
  ChevronDown: (props: any) => (
    <span data-testid="chevron-down-icon" {...props} />
  ),
  ChevronUp: (props: any) => <span data-testid="chevron-up-icon" {...props} />,
}));

jest.mock('../ai/components/atoms/Icon/Sparkles', () => ({
  Sparkles: 'sparkles',
}));

jest.mock('./components/ActionButton/ActionButton', () => ({
  ActionButton: ({ children, onClick }: any) => (
    <button data-testid="action-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('./Alert.styles', () => ({
  StyledAlert: ({ children, type, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'alert'} data-type={type}>
      {children}
    </div>
  ),
  StyledAlertBody: ({ children }: any) => (
    <div data-testid="alert-body">{children}</div>
  ),
  StyledAlertActionButtons: ({ children }: any) => (
    <div data-testid="alert-action-buttons">{children}</div>
  ),
  StyledAlertCloseButton: ({ children, onClick }: any) => (
    <button data-testid="text-button" type="button" onClick={onClick}>
      {children}
    </button>
  ),
  StyledAlertTitle: ({ children, 'data-testid': dataTestId }: any) => (
    <p data-testid={dataTestId || 'alert-title'}>{children}</p>
  ),
  StyledAlertMessage: ({ children, 'data-testid': dataTestId }: any) => (
    <div data-testid={dataTestId || 'alert-message'}>{children}</div>
  ),
  StyledAlertExpandedMessage: ({
    children,
    'data-testid': dataTestId,
  }: any) => (
    <div data-testid={dataTestId || 'alert-expanded-message'}>{children}</div>
  ),
  StyledAlertExpandedMessageContainer: ({ children }: any) => (
    <div data-testid="alert-expanded-message-container">{children}</div>
  ),
  SyledMessageContent: ({ children, iaAlertType }: any) => (
    <span data-testid="alert-message-content" data-ia-alert-type={iaAlertType}>
      {children}
    </span>
  ),
  StyledContentWrapper: ({ children }: any) => (
    <div data-testid="alert-content-wrapper">{children}</div>
  ),
  StyledAlertAttribution: ({ children, iaAlertType }: any) => (
    <span data-testid="alert-attribution" data-ia-alert-type={iaAlertType}>
      {children}
    </span>
  ),
}));

describe('Alert Component', () => {
  describe('Basic Rendering', () => {
    it('should render with required props (message only)', () => {
      render(<Alert message="Test message" dataTestId="alert" />);

      expect(screen.getByTestId('alert')).toBeInTheDocument();
      expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument();
      expect(screen.getByTestId('alert-message')).toBeInTheDocument();
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('should render icon', () => {
      render(<Alert message="Test message" />);

      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should render message as string', () => {
      render(<Alert message="String message" dataTestId="alert" />);

      expect(screen.getByTestId('alert-message')).toHaveTextContent(
        'String message',
      );
    });

    it('should render message as React node', () => {
      const messageNode = (
        <div data-testid="custom-message">Custom React Node</div>
      );

      render(<Alert message={messageNode} />);

      expect(screen.getByTestId('custom-message')).toBeInTheDocument();
      expect(screen.getByText('Custom React Node')).toBeInTheDocument();
    });
  });

  describe('Type Prop', () => {
    it('should render with default type "warning"', () => {
      render(<Alert message="Test message" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-type', 'warning');
    });

    it('should render with type "warning" explicitly', () => {
      render(<Alert type="warning" message="Test message" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-type', 'warning');
    });

    it('should render with type "info"', () => {
      render(<Alert type="info" message="Test message" />);

      const alert = screen.getByTestId('alert');
      expect(alert).toHaveAttribute('data-type', 'info');
    });

    it('should render AlertTriangle icon when type is "warning"', () => {
      render(<Alert type="warning" message="Test message" />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon', 'alert-triangle');
    });

    it('should render Info icon when type is "info"', () => {
      render(<Alert type="info" message="Test message" />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon', 'info');
    });

    it('should render AlertTriangle icon by default', () => {
      render(<Alert message="Test message" />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveAttribute('data-icon', 'alert-triangle');
    });
  });

  describe('Title Prop', () => {
    it('should render title when provided', () => {
      render(
        <Alert message="Test message" title="Test Title" dataTestId="alert" />,
      );

      expect(screen.getByTestId('alert-title')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should not render title when not provided', () => {
      render(<Alert message="Test message" />);

      expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument();
    });

    it('should render both title and message', () => {
      render(
        <Alert message="Message content" title="Alert Title" type="info" />,
      );

      expect(screen.getByText('Alert Title')).toBeInTheDocument();
      expect(screen.getByText('Message content')).toBeInTheDocument();
    });
  });

  describe('Icon Styles', () => {
    it('should apply correct style to icon', () => {
      render(<Alert message="Test message" />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveStyle({ fontSize: '24px', alignItems: 'center' });
    });

    it('should align icon to start when position is toast', () => {
      render(<Alert position="toast" message="Test message" />);

      const icon = screen.getByTestId('icon');
      expect(icon).toHaveStyle({ alignItems: 'start' });
    });
  });

  describe('Complex Scenarios', () => {
    it('should render warning alert with title and message', () => {
      render(
        <Alert
          type="warning"
          title="Warning"
          message="This is a warning message"
        />,
      );

      expect(screen.getByTestId('alert')).toHaveAttribute(
        'data-type',
        'warning',
      );
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('This is a warning message')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toHaveAttribute(
        'data-icon',
        'alert-triangle',
      );
    });

    it('should render info alert with title and message', () => {
      render(
        <Alert
          type="info"
          title="Information"
          message="This is an info message"
        />,
      );

      expect(screen.getByTestId('alert')).toHaveAttribute('data-type', 'info');
      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(screen.getByText('This is an info message')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toHaveAttribute('data-icon', 'info');
    });

    it('should render with complex React node as message', () => {
      const complexMessage = (
        <div>
          <span data-testid="span-1">Part 1</span>
          <strong data-testid="strong">Important</strong>
          <span data-testid="span-2">Part 2</span>
        </div>
      );

      render(<Alert message={complexMessage} title="Complex Message" />);

      expect(screen.getByTestId('span-1')).toBeInTheDocument();
      expect(screen.getByTestId('strong')).toBeInTheDocument();
      expect(screen.getByTestId('span-2')).toBeInTheDocument();
      expect(screen.getByText('Complex Message')).toBeInTheDocument();
    });

    it('should render warning alert without title', () => {
      render(<Alert type="warning" message="No title here" />);

      expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument();
      expect(screen.getByText('No title here')).toBeInTheDocument();
    });

    it('should render info alert without title', () => {
      render(<Alert type="info" message="Information without title" />);

      expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument();
      expect(screen.getByText('Information without title')).toBeInTheDocument();
    });
  });

  describe('Content Structure', () => {
    it('should render title before message when both are provided', () => {
      render(
        <Alert
          title="Title First"
          message="Message Second"
          dataTestId="alert"
        />,
      );

      const title = screen.getByTestId('alert-title');
      const message = screen.getByTestId('alert-message');

      expect(title).toBeInTheDocument();
      expect(message).toBeInTheDocument();
    });

    it('should wrap title and message in a div', () => {
      const { container } = render(<Alert title="Title" message="Message" />);

      const alert = container.querySelector('[data-testid="alert"]');
      const innerDiv = alert?.querySelector('div');

      expect(innerDiv).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should call action handlers when buttons are clicked', () => {
      const onActionOne = jest.fn();
      const onActionTwo = jest.fn();

      render(
        <Alert
          message="Test message"
          firstAction={{
            onActionClick: onActionOne,
            actionMessage: 'First action',
          }}
          secondAction={{
            onActionClick: onActionTwo,
            actionMessage: 'Second action',
          }}
        />,
      );

      fireEvent.click(screen.getByText('First action'));
      fireEvent.click(screen.getByText('Second action'));
      expect(onActionOne).toHaveBeenCalledTimes(1);
      expect(onActionTwo).toHaveBeenCalledTimes(1);
    });

    it('should not render action buttons when no handlers are provided', () => {
      render(<Alert message="Test message" />);

      expect(
        screen.queryByTestId('alert-action-buttons'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('should call onClose when close button is clicked', () => {
      const onClose = jest.fn();

      render(
        <Alert message="Test message" position="toast" onClose={onClose} />,
      );

      fireEvent.click(screen.getByTestId('text-button'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not render close button when position is inline', () => {
      const onClose = jest.fn();

      render(
        <Alert message="Test message" position="inline" onClose={onClose} />,
      );

      expect(screen.queryByTestId('text-button')).not.toBeInTheDocument();
    });

    it('should not render close button when type is neutral', () => {
      const onClose = jest.fn();

      render(
        <Alert
          type="neutral"
          message="Test message"
          position="toast"
          onClose={onClose}
        />,
      );

      expect(screen.queryByTestId('text-button')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should render with empty string as message', () => {
      render(<Alert message="" dataTestId="alert" />);

      expect(screen.getByTestId('alert-message')).toBeInTheDocument();
    });

    it('should render with empty string as title', () => {
      render(<Alert message="Message" title="" />);

      expect(screen.queryByTestId('alert-title')).not.toBeInTheDocument();
    });

    it('should render with very long message', () => {
      const longMessage = 'A'.repeat(1000);

      render(<Alert message={longMessage} />);

      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('should render with special characters in message', () => {
      render(<Alert message="Special: !@#$%^&*()_+-=[]{}|;':,.<>?/" />);

      expect(
        screen.getByText("Special: !@#$%^&*()_+-=[]{}|;':,.<>?/"),
      ).toBeInTheDocument();
    });

    it('should render with numbers in message', () => {
      render(<Alert message="Numbers: 123456789" />);

      expect(screen.getByText('Numbers: 123456789')).toBeInTheDocument();
    });
  });

  describe('Multiple Alerts', () => {
    it('should render multiple alerts with different types', () => {
      const { container } = render(
        <>
          <Alert type="warning" message="Warning message" dataTestId="alert" />
          <Alert type="info" message="Info message" dataTestId="alert" />
        </>,
      );

      const alerts = container.querySelectorAll('[data-testid="alert"]');
      expect(alerts).toHaveLength(2);
      expect(screen.getByText('Warning message')).toBeInTheDocument();
      expect(screen.getByText('Info message')).toBeInTheDocument();
    });
  });

  describe('Expanded Action', () => {
    const expandedAction = {
      actionMessage: 'Expand',
      retracMessage: 'Retrac',
      expandedMessage: 'This is the expanded content',
    };

    it('should render the expand action button when expandedAction is provided', () => {
      render(
        <Alert
          message="Test message"
          expandedAction={expandedAction}
          dataTestId="alert"
        />,
      );

      expect(screen.getByText('Expand')).toBeInTheDocument();
      expect(
        screen.queryByTestId('alert-expanded-message'),
      ).not.toBeInTheDocument();
    });

    it('should show the expanded message when the action button is clicked', () => {
      render(
        <Alert
          message="Test message"
          expandedAction={expandedAction}
          dataTestId="alert"
        />,
      );

      fireEvent.click(screen.getByText('Expand'));

      expect(screen.getByTestId('alert-expanded-message')).toBeInTheDocument();
      expect(
        screen.getByText('This is the expanded content'),
      ).toBeInTheDocument();
    });

    it('should hide the expanded message when the action button is clicked again', () => {
      render(
        <Alert
          message="Test message"
          expandedAction={expandedAction}
          dataTestId="alert"
        />,
      );

      fireEvent.click(screen.getByText('Expand'));
      expect(screen.getByTestId('alert-expanded-message')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Retrac'));
      expect(
        screen.queryByTestId('alert-expanded-message'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Expand')).toBeInTheDocument();
    });

    it('should render expanded message as React node', () => {
      const expandedActionWithNode = {
        actionMessage: 'Expand',
        retracMessage: 'Collapse',
        expandedMessage: (
          <div data-testid="custom-expanded-content">Custom content</div>
        ),
      };

      render(
        <Alert
          message="Test message"
          expandedAction={expandedActionWithNode}
          dataTestId="alert"
        />,
      );

      fireEvent.click(screen.getByText('Expand'));

      expect(screen.getByTestId('custom-expanded-content')).toBeInTheDocument();
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });

    it('should render the action buttons section when expandedAction is provided', () => {
      render(<Alert message="Test message" expandedAction={expandedAction} />);

      expect(screen.getByTestId('alert-action-buttons')).toBeInTheDocument();
    });

    it('should render expandedAction together with firstAction and secondAction', () => {
      const onActionOne = jest.fn();
      const onActionTwo = jest.fn();

      render(
        <Alert
          message="Test message"
          expandedAction={expandedAction}
          firstAction={{
            onActionClick: onActionOne,
            actionMessage: 'First action',
          }}
          secondAction={{
            onActionClick: onActionTwo,
            actionMessage: 'Second action',
          }}
        />,
      );

      expect(screen.getByText('Expand')).toBeInTheDocument();
      expect(screen.getByText('First action')).toBeInTheDocument();
      expect(screen.getByText('Second action')).toBeInTheDocument();

      fireEvent.click(screen.getByText('First action'));
      expect(onActionOne).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByText('Second action'));
      expect(onActionTwo).toHaveBeenCalledTimes(1);
    });
  });

  describe('Alert - dataTestId', () => {
    it('should render with custom dataTestId', () => {
      render(
        <Alert dataTestId="custom-alert" title="Title" message="Message" />,
      );

      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
      expect(screen.getByTestId('custom-alert-title')).toBeInTheDocument();
      expect(screen.getByTestId('custom-alert-message')).toBeInTheDocument();
    });
  });

  describe('AI Type', () => {
    it('should render with type "AI"', () => {
      render(<Alert type="AI" message="AI message" dataTestId="alert" />);

      expect(screen.getByTestId('alert')).toHaveAttribute('data-type', 'AI');
    });

    it('should render Sparkles icon when type is "AI"', () => {
      render(<Alert type="AI" message="AI message" />);

      expect(screen.getByTestId('icon')).toHaveAttribute(
        'data-icon',
        'sparkles',
      );
    });

    it('should render the IA attribution text when type is "AI"', () => {
      render(<Alert type="AI" message="AI message" />);

      const attribution = screen.getByTestId('alert-attribution');
      expect(attribution).toBeInTheDocument();
      expect(attribution).toHaveTextContent('Clara · IA Generated');
      expect(attribution).toHaveAttribute('data-ia-alert-type', 'true');
    });

    it('should mark message content as IA when type is "AI"', () => {
      render(<Alert type="AI" message="AI message" />);

      const content = screen.getByTestId('alert-message-content');
      expect(content).toHaveAttribute('data-ia-alert-type', 'true');
    });

    it('should not mark message content as IA when type is not "AI"', () => {
      render(<Alert type="info" message="Info message" />);

      const content = screen.getByTestId('alert-message-content');
      expect(content).toHaveAttribute('data-ia-alert-type', 'false');
    });
  });

  describe('Expanded Action Icons', () => {
    const expandedAction = {
      actionMessage: 'Expand',
      retracMessage: 'Retrac',
      expandedMessage: 'This is the expanded content',
    };

    it('should render the chevron-down icon when collapsed', () => {
      render(<Alert message="Test message" expandedAction={expandedAction} />);

      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('chevron-up-icon')).not.toBeInTheDocument();
    });

    it('should render the chevron-up icon when expanded', () => {
      render(<Alert message="Test message" expandedAction={expandedAction} />);

      fireEvent.click(screen.getByText('Expand'));

      expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument();
    });
  });
});
