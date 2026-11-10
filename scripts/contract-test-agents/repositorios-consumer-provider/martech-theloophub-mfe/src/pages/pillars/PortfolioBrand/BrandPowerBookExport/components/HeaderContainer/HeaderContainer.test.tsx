import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { HeaderContainer } from './HeaderContainer';

describe('HeaderContainer', () => {
  it('renders the title and the children content', () => {
    render(
      <HeaderContainer title="Section Title">
        <div data-testid="body">Body content</div>
      </HeaderContainer>,
    );

    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByTestId('body')).toHaveTextContent('Body content');
  });

  it('forwards dataTestId to the outer container', () => {
    render(
      <HeaderContainer title="T" dataTestId="my-header">
        <div />
      </HeaderContainer>,
    );

    expect(screen.getByTestId('my-header')).toBeInTheDocument();
  });

  describe('legends slot', () => {
    it('renders the legends node when provided', () => {
      render(
        <HeaderContainer
          title="T"
          legends={<span data-testid="legend">L</span>}
        >
          <div />
        </HeaderContainer>,
      );

      expect(screen.getByTestId('legend')).toHaveTextContent('L');
    });

    it.each([
      ['undefined', undefined],
      ['null', null],
      ['false', false],
    ])('does not render the legend when legends is %s', (_label, legends) => {
      render(
        <HeaderContainer title="T" legends={legends as any}>
          <div data-testid="body" />
        </HeaderContainer>,
      );

      expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
      expect(screen.getByTestId('body')).toBeInTheDocument();
    });
  });
});
