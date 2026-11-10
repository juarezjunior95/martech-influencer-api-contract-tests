import React from 'react';

import { act, render, screen } from '@testing-library/react';

import { MediaQueryContext, MediaQueryProvider } from './MediaQueryProvider';

describe('MediaQueryProvider', () => {
  let matchMediaMock: jest.SpyInstance;
  let addEventListenerMock: jest.Mock;
  let removeEventListenerMock: jest.Mock;

  const createMatchMediaMock = (initialMatches: boolean) => {
    addEventListenerMock = jest.fn();
    removeEventListenerMock = jest.fn();
    return jest.fn((query: string) => ({
      matches: initialMatches,
      media: query,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: jest.fn(),
    }));
  };

  beforeEach(() => {
    if (globalThis.window !== undefined) {
      matchMediaMock = jest.spyOn(globalThis.window, 'matchMedia');
    }
  });

  afterEach(() => {
    if (matchMediaMock) {
      matchMediaMock.mockRestore();
    }
  });

  it('should render children', () => {
    render(
      <MediaQueryProvider>
        <span data-testid="child">Content</span>
      </MediaQueryProvider>,
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Content');
  });

  it('should provide context with matches, registerQuery and unregisterQuery', () => {
    let contextValue: React.ContextType<typeof MediaQueryContext> = null;

    const Consumer = () => {
      contextValue = React.useContext(MediaQueryContext);
      return (
        <span data-testid="consumer">
          {contextValue
            ? `matches:${Object.keys(contextValue.matches).length},hasRegister:${typeof contextValue.registerQuery === 'function'},hasUnregister:${typeof contextValue.unregisterQuery === 'function'}`
            : 'no-context'}
        </span>
      );
    };

    render(
      <MediaQueryProvider>
        <Consumer />
      </MediaQueryProvider>,
    );

    expect(contextValue).not.toBeNull();
    expect(contextValue?.matches).toEqual({});
    expect(typeof contextValue?.registerQuery).toBe('function');
    expect(typeof contextValue?.unregisterQuery).toBe('function');
    expect(screen.getByTestId('consumer').textContent).toContain(
      'hasRegister:true',
    );
    expect(screen.getByTestId('consumer').textContent).toContain(
      'hasUnregister:true',
    );
  });

  it('should call matchMedia and update matches when registerQuery is called', () => {
    matchMediaMock.mockImplementation(createMatchMediaMock(true));

    const query = '(min-width: 1440px)';
    const Consumer = () => {
      const context = React.useContext(MediaQueryContext);
      const contextRef = React.useRef(context);
      contextRef.current = context;

      React.useEffect(() => {
        contextRef.current?.registerQuery(query);
        return () => contextRef.current?.unregisterQuery(query);
      }, []);

      return (
        <span data-testid="matches">
          {context ? JSON.stringify(context.matches) : 'none'}
        </span>
      );
    };

    render(
      <MediaQueryProvider>
        <Consumer />
      </MediaQueryProvider>,
    );

    expect(matchMediaMock).toHaveBeenCalledWith(query);
    expect(screen.getByTestId('matches').textContent).toContain('true');
  });

  it('should update matches when media query change event fires', () => {
    let changeHandler: (event: MediaQueryListEvent) => void = jest.fn();
    addEventListenerMock = jest.fn(
      (event: string, handler: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') {
          changeHandler = handler;
        }
      },
    );
    removeEventListenerMock = jest.fn();

    matchMediaMock.mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: jest.fn(),
    }));

    const query = '(min-width: 1440px)';
    const Consumer = () => {
      const context = React.useContext(MediaQueryContext);
      const contextRef = React.useRef(context);
      contextRef.current = context;

      React.useEffect(() => {
        contextRef.current?.registerQuery(query);
        return () => contextRef.current?.unregisterQuery(query);
      }, []);

      return (
        <span data-testid="matches">
          {context ? String(context.matches[query]) : 'none'}
        </span>
      );
    };

    render(
      <MediaQueryProvider>
        <Consumer />
      </MediaQueryProvider>,
    );

    expect(screen.getByTestId('matches').textContent).toBe('false');

    act(() => {
      changeHandler({
        matches: true,
        media: query,
      } as MediaQueryListEvent);
    });

    expect(screen.getByTestId('matches').textContent).toBe('true');
  });

  it('should use single listener when same query is registered multiple times', () => {
    matchMediaMock.mockImplementation(createMatchMediaMock(true));

    const query = '(min-width: 1440px)';
    const useRegister = () => {
      const context = React.useContext(MediaQueryContext);
      const contextRef = React.useRef(context);
      contextRef.current = context;
      React.useEffect(() => {
        contextRef.current?.registerQuery(query);
        return () => contextRef.current?.unregisterQuery(query);
      }, []);
    };

    const Consumer1 = () => {
      useRegister();
      return <span data-testid="c1">1</span>;
    };
    const Consumer2 = () => {
      useRegister();
      return <span data-testid="c2">2</span>;
    };

    render(
      <MediaQueryProvider>
        <Consumer1 />
        <Consumer2 />
      </MediaQueryProvider>,
    );

    expect(matchMediaMock).toHaveBeenCalledWith(query);
    expect(
      matchMediaMock.mock.calls.every((call: [string]) => call[0] === query),
    ).toBe(true);
  });

  it('should remove listener and clear match when unregisterQuery is called and refCount reaches zero', () => {
    matchMediaMock.mockImplementation(createMatchMediaMock(true));

    const query = '(min-width: 1440px)';
    const Consumer = () => {
      const context = React.useContext(MediaQueryContext);
      const contextRef = React.useRef(context);
      contextRef.current = context;

      React.useEffect(() => {
        contextRef.current?.registerQuery(query);
        return () => contextRef.current?.unregisterQuery(query);
      }, []);

      return (
        <div>
          <span data-testid="matches">
            {context ? String(context.matches[query]) : 'none'}
          </span>
        </div>
      );
    };

    const Wrapper = () => {
      const [show, setShow] = React.useState(true);
      return (
        <MediaQueryProvider>
          {show ? <Consumer /> : null}
          <button
            data-testid="hide"
            type="button"
            onClick={() => setShow(false)}
          >
            Hide
          </button>
        </MediaQueryProvider>
      );
    };

    render(<Wrapper />);

    expect(screen.getByTestId('matches').textContent).toBe('true');

    act(() => {
      screen.getByTestId('hide').click();
    });

    expect(removeEventListenerMock).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('should not call matchMedia when window is undefined', () => {
    const originalWindow = globalThis.window;
    (globalThis as { window?: typeof globalThis.window }).window = undefined;

    const Consumer = () => {
      const context = React.useContext(MediaQueryContext);
      const contextRef = React.useRef(context);
      contextRef.current = context;
      React.useEffect(() => {
        contextRef.current?.registerQuery('(min-width: 1440px)');
        return () => contextRef.current?.unregisterQuery('(min-width: 1440px)');
      }, []);
      return <span data-testid="consumer">ok</span>;
    };

    render(
      <MediaQueryProvider>
        <Consumer />
      </MediaQueryProvider>,
    );

    expect(screen.getByTestId('consumer')).toHaveTextContent('ok');

    (globalThis as { window?: typeof globalThis.window }).window =
      originalWindow;
  });
});
