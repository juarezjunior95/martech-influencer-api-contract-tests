import type { ReactNode } from 'react';
import { MemoryRouter, useNavigate } from 'react-router-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';

import {
  CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  CLARA_CATEGORY_PROJECT_KEY,
} from '../../constants/projectKeys';
import { getDefaultClaraDomainValue, useClaraDomain } from './useClaraDomain';

const OPTIONS = [
  {
    label: 'Clara: Category',
    value: CLARA_CATEGORY_PROJECT_KEY,
    description: 'Category domain',
  },
  {
    label: 'Clara: Brand Guidance',
    value: CLARA_BRAND_GUIDANCE_PROJECT_KEY,
    description: 'Brand domain',
  },
];

function createWrapper(initialEntry: string) {
  function ClaraDomainTestWrapper({ children }: { children?: ReactNode }) {
    return (
      <MemoryRouter
        initialEntries={[initialEntry]}
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        {children}
      </MemoryRouter>
    );
  }

  return ClaraDomainTestWrapper;
}

const ClaraDomainHarness = () => {
  const navigate = useNavigate();
  const { selectedClaraDomain, setSelectedClaraDomain } = useClaraDomain({
    options: OPTIONS,
    isEnabled: true,
  });

  return (
    <>
      <span data-testid="selected-domain">{selectedClaraDomain.label}</span>
      <button type="button" onClick={() => setSelectedClaraDomain(OPTIONS[0])}>
        select-category
      </button>
      <button type="button" onClick={() => setSelectedClaraDomain(OPTIONS[1])}>
        select-brand
      </button>
      <button type="button" onClick={() => navigate('/category')}>
        route-category
      </button>
      <button type="button" onClick={() => navigate('/portfolio-brand')}>
        route-portfolio
      </button>
    </>
  );
};

describe('useClaraDomain', () => {
  it('should resolve category default for category routes', () => {
    expect(getDefaultClaraDomainValue('/category/pos/grow')).toBe(
      CLARA_CATEGORY_PROJECT_KEY,
    );
  });

  it('should resolve legacy default for unknown routes', () => {
    expect(getDefaultClaraDomainValue('/development/components')).toBe(
      CLARA_BRAND_GUIDANCE_PROJECT_KEY,
    );
  });

  it('should keep legacy default when feature toggle is disabled', () => {
    const { result } = renderHook(
      () => useClaraDomain({ options: OPTIONS, isEnabled: false }),
      { wrapper: createWrapper('/category') },
    );

    expect(result.current.selectedClaraDomain.value).toBe(
      CLARA_BRAND_GUIDANCE_PROJECT_KEY,
    );

    act(() => {
      result.current.setSelectedClaraDomain(OPTIONS[0]);
    });

    expect(result.current.selectedClaraDomain.value).toBe(
      CLARA_BRAND_GUIDANCE_PROJECT_KEY,
    );
  });

  it('should select the route default when feature toggle is enabled', () => {
    const { result } = renderHook(
      () => useClaraDomain({ options: OPTIONS, isEnabled: true }),
      { wrapper: createWrapper('/category/category-health/overview') },
    );

    expect(result.current.selectedClaraDomain.value).toBe(
      CLARA_CATEGORY_PROJECT_KEY,
    );
    expect(result.current.projectKey).toBe(CLARA_CATEGORY_PROJECT_KEY);
  });

  it('should keep an active domain state per pillar route', () => {
    render(
      <MemoryRouter
        initialEntries={['/category']}
        future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
      >
        <ClaraDomainHarness />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('selected-domain')).toHaveTextContent(
      'Clara: Category',
    );

    fireEvent.click(screen.getByText('select-brand'));
    expect(screen.getByTestId('selected-domain')).toHaveTextContent(
      'Clara: Brand Guidance',
    );

    fireEvent.click(screen.getByText('route-portfolio'));
    expect(screen.getByTestId('selected-domain')).toHaveTextContent(
      'Clara: Brand Guidance',
    );

    fireEvent.click(screen.getByText('select-category'));
    expect(screen.getByTestId('selected-domain')).toHaveTextContent(
      'Clara: Category',
    );

    fireEvent.click(screen.getByText('route-category'));
    expect(screen.getByTestId('selected-domain')).toHaveTextContent(
      'Clara: Brand Guidance',
    );

    fireEvent.click(screen.getByText('route-portfolio'));
    expect(screen.getByTestId('selected-domain')).toHaveTextContent(
      'Clara: Category',
    );
  });
});
