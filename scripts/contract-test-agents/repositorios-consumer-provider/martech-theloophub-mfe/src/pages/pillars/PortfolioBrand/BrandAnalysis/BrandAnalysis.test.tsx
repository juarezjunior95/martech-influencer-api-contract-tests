import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';
import { useFeatureToggle } from 'hooks';

import { BrandAnalysis } from './BrandAnalysis';

const renderWithIntl = (component: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      {component}
    </IntlProvider>,
  );

jest.mock('hooks', () => ({
  useFeatureToggle: jest.fn(),
}));

jest.mock('components', () => ({
  StickyScrollWithFilters: () => <div />,
}));

jest.mock('@hexa-ui/components', () => ({
  Grid: {
    Item: ({ children }: any) => <div>{children}</div>,
  },
}));

jest.mock('shared/Styles/layout.styles', () => ({
  StyledGridContainer: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('./tabs', () => ({
  BrandPower: ({ dataTestId }: any) => (
    <div data-testid={dataTestId}>BrandPower</div>
  ),
}));

describe('BrandAnalysis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useFeatureToggle as jest.Mock).mockReturnValue([true, false]);
  });

  describe('Rendering', () => {
    it('should render BrandPower component', () => {
      renderWithIntl(<BrandAnalysis />);

      expect(screen.getByTestId('tabpanel-brand-power')).toBeInTheDocument();
    });
  });
});
