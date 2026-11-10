import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { InsightsSlide } from './InsightsSlide';

jest.mock('components', () => ({
  DataStateHandler: ({ children, loading, error, empty }: any) => {
    if (loading) return <div data-testid="state-loading" />;
    if (error) return <div data-testid="state-error">{error.message}</div>;
    if (empty) return <div data-testid="state-empty" />;
    return <div data-testid="state-content">{children}</div>;
  },
}));

const baseProps = {
  title: 'Test Title',
  content: <div data-testid="content">Body</div>,
};

const renderSlide = (
  props: Partial<typeof baseProps> & Record<string, any> = {},
) => render(<InsightsSlide {...baseProps} {...props} />);

describe('InsightsSlide', () => {
  it('renders the title and content by default', () => {
    renderSlide();

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toHaveTextContent('Body');
  });

  it('forwards dataTestId to the outer wrapper', () => {
    renderSlide({ dataTestId: 'my-insight' });

    expect(screen.getByTestId('my-insight')).toBeInTheDocument();
  });

  describe('Index badge', () => {
    it.each([
      ['number', 1],
      ['string', 'A'],
      ['zero', 0],
    ])('renders the index badge when value is a %s', (_label, value) => {
      renderSlide({ indexBadge: value });

      expect(screen.getByText(String(value))).toBeInTheDocument();
    });

    it('does not render the index badge when undefined', () => {
      renderSlide();

      expect(screen.queryByText(/^\d$/)).not.toBeInTheDocument();
    });
  });

  describe('Data states', () => {
    it.each([
      ['loading', { loading: true }, 'state-loading'],
      ['error', { error: new Error('Boom') }, 'state-error'],
      ['empty', { empty: true }, 'state-empty'],
    ])(
      'shows %s state and skips the content',
      (_label, propsOverride, expectedTestId) => {
        renderSlide(propsOverride);

        expect(screen.getByTestId(expectedTestId)).toBeInTheDocument();
        expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      },
    );

    it('shows the error message in the error state', () => {
      renderSlide({ error: new Error('Boom') });

      expect(screen.getByTestId('state-error')).toHaveTextContent('Boom');
    });
  });

  it('renders complex content nodes inside the content wrapper', () => {
    renderSlide({
      content: (
        <>
          <h2>Heading</h2>
          <p>Text</p>
          <button>Click</button>
        </>
      ),
    });

    expect(screen.getByText('Heading')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Click')).toBeInTheDocument();
  });
});
