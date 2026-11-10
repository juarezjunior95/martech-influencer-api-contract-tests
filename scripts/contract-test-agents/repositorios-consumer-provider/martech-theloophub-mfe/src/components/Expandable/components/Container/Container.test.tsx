import React from 'react';

import { render, screen } from '@testing-library/react';

import { useExpandable } from '../../../../contexts/Expandable/Expandable';
import { Container } from './Container';

jest.mock('hooks', () => ({
  useGoogleAnalytics: () => jest.fn(),
}));

const MockChild = () => {
  const context = useExpandable();
  return (
    <div data-testid="context-exists">
      {context ? 'Context exists' : 'No context'}
    </div>
  );
};

describe('Expandable.Container', () => {
  it('should render children and provide context', () => {
    render(
      <Container>
        <div data-testid="test-child">Test</div>
        <MockChild />
      </Container>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();

    expect(screen.getByTestId('context-exists')).toHaveTextContent(
      'Context exists',
    );
  });

  it('should render with custom data-testid', () => {
    render(
      <Container dataTestId="my-custom-container">
        <div>Content</div>
      </Container>,
    );

    expect(screen.getByTestId('my-custom-container')).toBeInTheDocument();
  });
});
