import React from 'react';

import { render } from '@testing-library/react';
import { featureToggles } from 'config/featureToggle';

import Router from './Router';

const mockFeatureToggles = {
  [featureToggles.pillar.portfolioBrand.submenus.portfolioPerformance.id]: true,
};

jest.mock('hooks/useMakeRoutes/useMakeRoutes', () => ({
  __esModule: true,
  default: () => [
    {
      path: '/test',
      element: <div>Test Route</div>,
    },
  ],
}));

jest.mock('hooks/useMultipleFeatureToggles', () => ({
  useMultiplesFeatureToggles: () => ({
    featuresListByToggleName: mockFeatureToggles,
    togglesReady: true,
  }),
}));

jest.mock('hooks', () => ({
  useFeatureToggle: () => [true, false],
}));

jest.mock('components/ai/components/InsightsCopilot', () => ({
  InsightsCopilot: () => <div data-testid="insights-copilot" />,
}));

describe('Router', () => {
  it('should render the routes', () => {
    const { container } = render(<Router />);
    expect(container).toBeInTheDocument();
  });
});
