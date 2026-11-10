import React from 'react';
import { IntlProvider } from 'react-intl';

import { render, screen } from '@testing-library/react';

import { BeesDistribution } from './BeesDistribution';

const intlMessages = {
  'Pillars.pageName.tradeExecution': 'Trade Execution',
  'Sidebar.beesDistribution': 'Bees Distribution',
};

const renderWithIntl = (component: React.ReactElement) =>
  render(
    <IntlProvider locale="en" messages={intlMessages}>
      {component}
    </IntlProvider>,
  );

jest.mock('components', () => ({
  TabsWithFilters: ({
    filter,
    tabConfig,
    dataTestId,
    breadcrumbsList,
  }: {
    filter: {
      pageName: string;
      visibleFields: string[];
    };
    tabConfig: {
      tabs: {
        id: string;
        label: string;
        disabled?: boolean;
        content: React.ReactNode;
      }[];
      baseRoute: string;
    };
    dataTestId?: string;
    breadcrumbsList?: Array<{
      href: string;
      pageName: string;
    }>;
  }) => (
    <div
      data-testid={dataTestId ?? filter.pageName}
      data-preset-id={filter.pageName}
      data-base-route={tabConfig.baseRoute}
    >
      <div data-testid="preset-id">{filter.pageName}</div>
      <div data-testid="visible-fields">{filter.visibleFields?.join(',')}</div>
      <div data-testid="breadcrumbs-list">
        {breadcrumbsList?.map((breadcrumb, index) => (
          <div
            key={index}
            data-testid={`breadcrumb-${index}`}
            data-href={breadcrumb.href}
            data-page-name={breadcrumb.pageName}
          >
            {breadcrumb.pageName}
          </div>
        ))}
      </div>
      <div data-testid="tabs-container">
        {tabConfig.tabs.map((tab) => (
          <div
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            data-disabled={tab.disabled ?? false}
            data-label={tab.label}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('./tabs/Overview/Overview', () => ({
  Overview: ({ dataTestId }: { dataTestId?: string }) => (
    <div data-testid={dataTestId || 'overview-content'}>Overview Content</div>
  ),
}));

describe('BeesDistribution', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render bees-distribution with data-testid', () => {
      renderWithIntl(<BeesDistribution />);

      expect(screen.getByTestId('bees-distribution')).toBeInTheDocument();
    });
  });

  describe('Filter configuration', () => {
    it('should pass correct preset id to filter', () => {
      renderWithIntl(<BeesDistribution />);

      expect(screen.getByTestId('bees-distribution')).toHaveAttribute(
        'data-preset-id',
        'trade-execution_bees-distribution',
      );
    });

    it('should pass correct visible fields', () => {
      renderWithIntl(<BeesDistribution />);

      expect(screen.getByTestId('visible-fields')).toHaveTextContent(
        'zone,country,distribution_scopes,time_frame',
      );
    });
  });

  describe('Tabs configuration', () => {
    it('should pass correct base route', () => {
      renderWithIntl(<BeesDistribution />);

      expect(screen.getByTestId('bees-distribution')).toHaveAttribute(
        'data-base-route',
        '/trade-execution/bees-distribution',
      );
    });

    it('should render overview tab', () => {
      renderWithIntl(<BeesDistribution />);

      const tab = screen.getByTestId('tab-overview');
      expect(tab).toBeInTheDocument();
      expect(tab).toHaveAttribute('data-label', 'Overview');
      expect(tab).toHaveAttribute('data-disabled', 'false');
    });

    it('should render Overview component in overview tab', () => {
      renderWithIntl(<BeesDistribution />);

      expect(screen.getByTestId('tabpanel-overview')).toBeInTheDocument();
    });
  });

  describe('Breadcrumbs configuration', () => {
    it('should configure breadcrumbs correctly', () => {
      renderWithIntl(<BeesDistribution />);

      const breadcrumbsList = screen.getByTestId('breadcrumbs-list');
      const breadcrumbs = breadcrumbsList.querySelectorAll(
        '[data-testid^="breadcrumb-"]',
      );

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0]).toHaveAttribute('data-href', '/trade-execution');
      expect(breadcrumbs[0]).toHaveAttribute(
        'data-page-name',
        'Trade Execution',
      );
      expect(breadcrumbs[1]).toHaveAttribute(
        'data-href',
        '/trade-execution/bees-distribution',
      );
      expect(breadcrumbs[1]).toHaveAttribute(
        'data-page-name',
        'Bees Distribution',
      );
    });
  });
});
