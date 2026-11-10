import { FC } from 'react';

import { render, screen } from '@testing-library/react';

import {
  LoadingRegistryProvider,
  useIsAnyLoading,
  useRegisterLoading,
} from './LoadingRegistry';

const LoadingRegistrar: FC<{ id: string; isLoading: boolean }> = ({
  id,
  isLoading,
}) => {
  useRegisterLoading(id, isLoading);
  return null;
};

const LoadingWatcher: FC = () => {
  const isAnyLoading = useIsAnyLoading();
  return (
    <div data-testid="loading-state">{isAnyLoading ? 'loading' : 'idle'}</div>
  );
};

describe('LoadingRegistryProvider', () => {
  it('renders its children', () => {
    render(
      <LoadingRegistryProvider>
        <div data-testid="child" />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <LoadingRegistryProvider>
        <div data-testid="child-1" />
        <div data-testid="child-2" />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});

describe('useIsAnyLoading', () => {
  it('returns false when no loading states are registered', () => {
    render(
      <LoadingRegistryProvider>
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('idle');
  });

  it('returns true when a component registers isLoading as true', () => {
    render(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={true} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');
  });

  it('returns false when all registered states are false', () => {
    render(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={false} />
        <LoadingRegistrar id="comp-b" isLoading={false} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('idle');
  });

  it('returns true when at least one of multiple components is loading', () => {
    render(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={false} />
        <LoadingRegistrar id="comp-b" isLoading={true} />
        <LoadingRegistrar id="comp-c" isLoading={false} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');
  });

  it('returns false outside a provider (default context value)', () => {
    render(<LoadingWatcher />);

    expect(screen.getByTestId('loading-state')).toHaveTextContent('idle');
  });
});

describe('useRegisterLoading', () => {
  it('updates to idle when isLoading transitions from true to false', () => {
    const { rerender } = render(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={true} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');

    rerender(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={false} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('idle');
  });

  it('updates to loading when isLoading transitions from false to true', () => {
    const { rerender } = render(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={false} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('idle');

    rerender(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={true} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');
  });

  it('unregisters the id when the component unmounts', () => {
    const { rerender } = render(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={true} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');

    rerender(
      <LoadingRegistryProvider>
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('idle');
  });

  it('keeps loading true while at least one component remains loading after another unmounts', () => {
    const { rerender } = render(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={true} />
        <LoadingRegistrar id="comp-b" isLoading={true} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');

    rerender(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-b" isLoading={true} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');
  });

  it('does not throw when used outside a provider (uses default no-op register)', () => {
    expect(() => {
      render(<LoadingRegistrar id="test" isLoading={true} />);
    }).not.toThrow();
  });

  it('handles multiple independent loading registrations', () => {
    render(
      <LoadingRegistryProvider>
        <LoadingRegistrar id="comp-a" isLoading={true} />
        <LoadingRegistrar id="comp-b" isLoading={true} />
        <LoadingRegistrar id="comp-c" isLoading={false} />
        <LoadingWatcher />
      </LoadingRegistryProvider>,
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('loading');
  });
});
