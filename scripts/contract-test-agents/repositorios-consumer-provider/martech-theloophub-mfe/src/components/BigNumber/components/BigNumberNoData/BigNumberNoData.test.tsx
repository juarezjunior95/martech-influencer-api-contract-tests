import { render, screen } from '@testing-library/react';

import { BigNumberNoData } from './BigNumberNoData';

jest.mock('assets/NoDataYet.svg', () => 'mocked-no-data-icon.svg');

jest.mock('./BigNumberNoData.styles', () => ({
  StyledNoDataContainer: ({ children, orientation, inline, style }: any) => (
    <div
      data-testid="no-data-container"
      data-orientation={orientation}
      data-inline={inline ? 'true' : undefined}
      style={style}
    >
      {children}
    </div>
  ),
  StyledNoDataText: ({ children, style }: any) => (
    <p data-testid="no-data-text" style={style}>
      {children}
    </p>
  ),
}));

describe('BigNumberNoData', () => {
  describe('Basic Rendering', () => {
    it('should render the no data container', () => {
      render(<BigNumberNoData emptyStateConfig={{}} />);

      expect(screen.getByTestId('no-data-container')).toBeInTheDocument();
    });

    it('should render the no data icon', () => {
      render(<BigNumberNoData emptyStateConfig={{}} />);

      const icon = screen.getByAltText('no data yet');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('src', 'mocked-no-data-icon.svg');
    });

    it('should render data-testid on icon when dataTestId is provided', () => {
      render(
        <BigNumberNoData emptyStateConfig={{}} dataTestId="test-no-data" />,
      );

      const icon = screen.getByTestId('test-no-data-icon-no-data-yet');
      expect(icon).toBeInTheDocument();
    });

    it('should not render data-testid on icon when dataTestId is not provided', () => {
      render(<BigNumberNoData emptyStateConfig={{}} />);

      const icon = screen.getByAltText('no data yet');
      expect(icon).not.toHaveAttribute('data-testid');
    });

    it('should render default text when not provided', () => {
      render(<BigNumberNoData emptyStateConfig={{}} />);

      expect(screen.getByText('Data not available')).toBeInTheDocument();
    });
  });

  describe('Text Prop', () => {
    it('should render custom text when provided', () => {
      render(<BigNumberNoData text="No information" emptyStateConfig={{}} />);

      expect(screen.getByText('No information')).toBeInTheDocument();
    });

    it('should render empty string as text', () => {
      render(<BigNumberNoData text="" emptyStateConfig={{}} />);

      const textElement = screen.getByTestId('no-data-text');
      expect(textElement).toHaveTextContent('');
    });

    it('should render long text', () => {
      const longText =
        'This is a very long message explaining why there is no data available at this moment';
      render(<BigNumberNoData text={longText} emptyStateConfig={{}} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });

  describe('Orientation Prop', () => {
    it('should pass vertical orientation to container', () => {
      render(<BigNumberNoData orientation="vertical" emptyStateConfig={{}} />);

      const container = screen.getByTestId('no-data-container');
      expect(container).toHaveAttribute('data-orientation', 'vertical');
    });

    it('should pass horizontal orientation to container', () => {
      render(
        <BigNumberNoData orientation="horizontal" emptyStateConfig={{}} />,
      );

      const container = screen.getByTestId('no-data-container');
      expect(container).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('should handle undefined orientation', () => {
      render(<BigNumberNoData emptyStateConfig={{}} />);

      const container = screen.getByTestId('no-data-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('EmptyStateConfig', () => {
    describe('color', () => {
      it('should apply color to text', () => {
        render(<BigNumberNoData emptyStateConfig={{ color: '#FF0000' }} />);

        const text = screen.getByTestId('no-data-text');
        expect(text).toHaveStyle({ color: '#FF0000' });
      });

      it('should handle undefined color', () => {
        render(<BigNumberNoData emptyStateConfig={{}} />);

        const text = screen.getByTestId('no-data-text');
        expect(text).toBeInTheDocument();
      });
    });

    describe('justifyContent', () => {
      it('should apply justifyContent start to container', () => {
        render(
          <BigNumberNoData emptyStateConfig={{ justifyContent: 'start' }} />,
        );

        const container = screen.getByTestId('no-data-container');
        expect(container).toHaveStyle({ justifyContent: 'start' });
      });

      it('should apply justifyContent center to container', () => {
        render(
          <BigNumberNoData emptyStateConfig={{ justifyContent: 'center' }} />,
        );

        const container = screen.getByTestId('no-data-container');
        expect(container).toHaveStyle({ justifyContent: 'center' });
      });
    });

    describe('imageSize', () => {
      it('should apply custom width to icon', () => {
        render(
          <BigNumberNoData
            emptyStateConfig={{ imageSize: { width: '100px' } }}
          />,
        );

        const icon = screen.getByAltText('no data yet');
        expect(icon).toHaveStyle({ width: '100px' });
      });

      it('should apply custom height to icon', () => {
        render(
          <BigNumberNoData
            emptyStateConfig={{ imageSize: { height: '80px' } }}
          />,
        );

        const icon = screen.getByAltText('no data yet');
        expect(icon).toHaveStyle({ height: '80px' });
      });

      it('should apply both width and height to icon', () => {
        render(
          <BigNumberNoData
            emptyStateConfig={{
              imageSize: { width: '120px', height: '120px' },
            }}
          />,
        );

        const icon = screen.getByAltText('no data yet');
        expect(icon).toHaveStyle({ width: '120px', height: '120px' });
      });

      it('should use default size when not specified', () => {
        render(<BigNumberNoData emptyStateConfig={{}} />);

        const icon = screen.getByAltText('no data yet');
        expect(icon).toHaveStyle({ width: '56px', height: '56px' });
      });
    });
  });

  describe('Combined Props', () => {
    it('should handle all props together', () => {
      render(
        <BigNumberNoData
          orientation="horizontal"
          text="Custom empty message"
          emptyStateConfig={{
            color: '#333333',
            justifyContent: 'center',
            imageSize: { width: '40px', height: '40px' },
          }}
        />,
      );

      const container = screen.getByTestId('no-data-container');
      expect(container).toHaveAttribute('data-orientation', 'horizontal');
      expect(container).toHaveStyle({ justifyContent: 'center' });

      const text = screen.getByTestId('no-data-text');
      expect(text).toHaveTextContent('Custom empty message');
      expect(text).toHaveStyle({ color: '#333333' });

      const icon = screen.getByAltText('no data yet');
      expect(icon).toHaveStyle({ width: '40px', height: '40px' });
    });
  });

  describe('inline', () => {
    it('should pass inline true to container when enabled', () => {
      render(<BigNumberNoData emptyStateConfig={{ inline: true }} />);

      const container = screen.getByTestId('no-data-container');
      expect(container).toHaveAttribute('data-inline', 'true');
    });

    it('should not pass inline to container when not set', () => {
      render(<BigNumberNoData emptyStateConfig={{}} />);

      const container = screen.getByTestId('no-data-container');
      expect(container).not.toHaveAttribute('data-inline');
    });

    it('should not pass inline to container when false', () => {
      render(<BigNumberNoData emptyStateConfig={{ inline: false }} />);

      const container = screen.getByTestId('no-data-container');
      expect(container).not.toHaveAttribute('data-inline');
    });
  });

  describe('Accessibility', () => {
    it('should have alt text on icon', () => {
      render(<BigNumberNoData emptyStateConfig={{}} />);

      const icon = screen.getByAltText('no data yet');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('emptyStateIcon Prop', () => {
    it('should render custom icon when provided', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Custom</span>;
      render(
        <BigNumberNoData
          emptyStateIcon={<CustomIcon />}
          emptyStateConfig={{}}
        />,
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.queryByAltText('no data yet')).not.toBeInTheDocument();
    });

    it('should render default icon when emptyStateIcon is not provided', () => {
      render(<BigNumberNoData emptyStateConfig={{}} />);

      expect(screen.getByAltText('no data yet')).toBeInTheDocument();
    });

    it('should render default icon when emptyStateIcon prop is undefined', () => {
      render(
        <BigNumberNoData emptyStateIcon={undefined} emptyStateConfig={{}} />,
      );

      expect(screen.getByAltText('no data yet')).toBeInTheDocument();
    });

    it('should render custom icon with text', () => {
      const CustomIcon = () => <span data-testid="custom-icon">Icon</span>;
      render(
        <BigNumberNoData
          emptyStateIcon={<CustomIcon />}
          text="Custom message"
          emptyStateConfig={{}}
        />,
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.getByText('Custom message')).toBeInTheDocument();
    });
  });
});
