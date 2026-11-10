import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import { RouteTabs } from './RouteTabs';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ tab: 'test1' }),
}));

describe('RouteTabs', () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;
  const routeTabsMock = [
    {
      id: 'test1',
      label: 'Test1',
      disabled: false,
      content: 'Content1',
    },
    {
      id: 'test2',
      label: 'Test2',
      disabled: false,
      content: 'Content2',
    },
    {
      id: 'test3',
      label: 'Test3',
      disabled: false,
      content: 'Content3',
    },
    {
      id: 'test4',
      label: 'Test4',
      disabled: true,
      content: 'Content4',
    },
  ];

  beforeAll(() => {
    globalThis.IntersectionObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });
  afterAll(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('renders tabs correctly', () => {
    render(
      <MemoryRouter>
        <RouteTabs tabsInfos={routeTabsMock} baseRoute="/tabs" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Test1')).toBeInTheDocument();
    expect(screen.getByText('Test2')).toBeInTheDocument();
    expect(screen.getByText('Test3')).toBeInTheDocument();
  });

  it('renders the default tab content', () => {
    render(
      <MemoryRouter initialEntries={['/tabs/test1']}>
        <RouteTabs tabsInfos={routeTabsMock} baseRoute="/tabs" />
      </MemoryRouter>,
    );

    expect(screen.getByText('Content1')).toBeInTheDocument();
  });

  it('navigates when a valid tab is clicked', () => {
    render(
      <MemoryRouter>
        <RouteTabs tabsInfos={routeTabsMock} baseRoute="/tabs" />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('Test2'));
    expect(mockNavigate).toHaveBeenCalledWith('/tabs/test2', { replace: true });
  });

  it('does not navigate when a disabled tab is clicked', () => {
    render(
      <MemoryRouter>
        <RouteTabs tabsInfos={routeTabsMock} baseRoute="/tabs" />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Test4')).not.toBeInTheDocument();
  });

  it('open a tab when valid tab is provided', async () => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useParams: () => ({ tab: 'test2' }),
    }));

    render(
      <MemoryRouter initialEntries={['/tabs/test2']}>
        <Routes>
          <Route
            path="/tabs/:tab"
            element={<RouteTabs tabsInfos={routeTabsMock} baseRoute="/tabs" />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Test2')).toBeInTheDocument();
  });

  describe('data-testid Rendering', () => {
    it('should render custom data-testid on root and children when dataTestId is provided', () => {
      render(
        <MemoryRouter>
          <RouteTabs
            tabsInfos={routeTabsMock}
            baseRoute="/tabs"
            dataTestId="route-tabs"
          />
        </MemoryRouter>,
      );

      expect(screen.getByTestId('route-tabs-tabs-root')).toBeInTheDocument();
      expect(screen.getByTestId('route-tabs-tabs-list')).toBeInTheDocument();
      expect(
        screen.getByTestId('route-tabs-tab-trigger-test1'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('route-tabs-tab-trigger-test2'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('route-tabs-tab-trigger-test3'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('route-tabs-tab-content-test1'),
      ).toBeInTheDocument();
    });

    it('should not render custom data-testid when dataTestId is not provided', () => {
      render(
        <MemoryRouter>
          <RouteTabs tabsInfos={routeTabsMock} baseRoute="/tabs" />
        </MemoryRouter>,
      );

      expect(
        screen.queryByTestId('route-tabs-tabs-root'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('route-tabs-tabs-list'),
      ).not.toBeInTheDocument();
    });
  });
});
