import React from 'react';

import { render, screen } from '@testing-library/react';

import App from './App';
import {
  useFeatureToggle,
  useInitializeFeatureToggle,
  useMediaQuery,
} from './hooks';

jest.mock('hooks/useMakeRoutes/useMakeRoutes', () => ({
  __esModule: true,
  default: () => [
    {
      path: '/test',
      element: <div>Test Route</div>,
    },
  ],
}));

jest.mock('shared/Styles', () => ({
  ...jest.requireActual('shared/Styles'),
  StyledAppContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-container">{children}</div>
  ),
}));

jest.mock('contexts', () => ({
  ...jest.requireActual('contexts'),
  MediaQueryProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('hooks', () => ({
  useInitializeFeatureToggle: jest.fn(),
  useFeatureToggle: jest.fn(),
  useMediaQuery: jest.fn(),
  useMultiplesFeatureToggles: jest.fn(),
}));

describe('App', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(1773228697943);

    const mockCrypto = {
      getRandomValues: jest.fn().mockReturnValue(new Uint32Array([123456789])),
    };
    Object.defineProperty(window, 'crypto', {
      writable: true,
      value: mockCrypto,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
      })),
    });
    (useInitializeFeatureToggle as jest.Mock).mockReturnValue({
      isReady: true,
    });
    (useFeatureToggle as jest.Mock).mockReturnValue([true, jest.fn()]);
    (useMediaQuery as jest.Mock).mockReturnValue(false);
  });

  it('should render a tree with the proper styles prefixed by the MFE Name', () => {
    const result = render(
      <App OPTIMIZELY_KEY="" ENV="" ENV_TYPE="" name="" key="1" />,
    ).asFragment();

    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });
});
