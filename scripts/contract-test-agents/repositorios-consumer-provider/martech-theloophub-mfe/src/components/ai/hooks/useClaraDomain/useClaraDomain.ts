import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import type { ClaraDomainOption } from 'components/ai/components/molecules/ClaraDomainDropdown';
import {
  CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  CLARA_CATEGORY_PROJECT_KEY,
} from 'components/ai/constants/projectKeys';

export type ClaraDomainPillar =
  | 'valueCreation'
  | 'portfolioBrand'
  | 'category'
  | 'consumer'
  | 'connectionsCreativity'
  | 'innovation'
  | 'tradeExecution';

type ClaraDomainStateKey = ClaraDomainPillar | 'legacy';

type ClaraDomainRouteDefault = {
  key: ClaraDomainPillar;
  path: string;
  defaultValue: string;
};

interface UseClaraDomainOptions {
  options: ClaraDomainOption[];
  isEnabled: boolean;
}

const LEGACY_STATE_KEY = 'legacy';

export const LEGACY_CLARA_DOMAIN_VALUE = CLARA_BRAND_GUIDANCE_PROJECT_KEY;

export const CLARA_DOMAIN_ROUTE_DEFAULTS: ClaraDomainRouteDefault[] = [
  {
    key: 'valueCreation',
    path: '/value-creation',
    defaultValue: CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  },
  {
    key: 'portfolioBrand',
    path: '/portfolio-brand',
    defaultValue: CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  },
  {
    key: 'category',
    path: '/category',
    defaultValue: CLARA_CATEGORY_PROJECT_KEY,
  },
  {
    key: 'consumer',
    path: '/consumer',
    defaultValue: CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  },
  {
    key: 'connectionsCreativity',
    path: '/connections-creativity',
    defaultValue: CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  },
  {
    key: 'innovation',
    path: '/innovation',
    defaultValue: CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  },
  {
    key: 'tradeExecution',
    path: '/trade-execution',
    defaultValue: CLARA_BRAND_GUIDANCE_PROJECT_KEY,
  },
];

const LEGACY_CLARA_DOMAIN_OPTION: ClaraDomainOption = {
  label: 'Clara: Brand Guidance',
  value: LEGACY_CLARA_DOMAIN_VALUE,
  description: '',
};

const buildInitialDomainByRoute = (): Record<ClaraDomainStateKey, string> => {
  return CLARA_DOMAIN_ROUTE_DEFAULTS.reduce(
    (defaults, route) => ({
      ...defaults,
      [route.key]: route.defaultValue,
    }),
    {
      [LEGACY_STATE_KEY]: LEGACY_CLARA_DOMAIN_VALUE,
    } as Record<ClaraDomainStateKey, string>,
  );
};

const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === '/') return '/';

  const pathnameOnly = pathname.split('?')[0].split('#')[0];

  if (pathnameOnly.length > 1 && pathnameOnly.endsWith('/')) {
    return pathnameOnly.slice(0, -1);
  }

  return pathnameOnly;
};

const matchesRoutePath = (pathname: string, routePath: string) => {
  return pathname === routePath || pathname.startsWith(`${routePath}/`);
};

export const getClaraDomainRouteDefault = (pathname: string) => {
  const normalizedPathname = normalizePathname(pathname);

  return CLARA_DOMAIN_ROUTE_DEFAULTS.find((route) =>
    matchesRoutePath(normalizedPathname, route.path),
  );
};

export const getDefaultClaraDomainValue = (pathname: string) => {
  return (
    getClaraDomainRouteDefault(pathname)?.defaultValue ??
    LEGACY_CLARA_DOMAIN_VALUE
  );
};

export function useClaraDomain({ options, isEnabled }: UseClaraDomainOptions) {
  const { pathname } = useLocation();
  const routeDefault = useMemo(
    () => getClaraDomainRouteDefault(pathname),
    [pathname],
  );
  const stateKey = routeDefault?.key ?? LEGACY_STATE_KEY;
  const routeDefaultValue =
    routeDefault?.defaultValue ?? LEGACY_CLARA_DOMAIN_VALUE;

  const [domainByRoute, setDomainByRoute] = useState(buildInitialDomainByRoute);

  const selectedValue = isEnabled
    ? (domainByRoute[stateKey] ?? routeDefaultValue)
    : LEGACY_CLARA_DOMAIN_VALUE;

  const selectedClaraDomain = useMemo(
    () =>
      options.find((option) => option.value === selectedValue) ??
      options.find((option) => option.value === LEGACY_CLARA_DOMAIN_VALUE) ??
      options[0] ??
      LEGACY_CLARA_DOMAIN_OPTION,
    [options, selectedValue],
  );

  const setSelectedClaraDomain = useCallback(
    (option: ClaraDomainOption) => {
      if (!isEnabled) return;

      setDomainByRoute((current) => {
        if (current[stateKey] === option.value) return current;

        return {
          ...current,
          [stateKey]: option.value,
        };
      });
    },
    [isEnabled, stateKey],
  );

  return {
    selectedClaraDomain,
    setSelectedClaraDomain,
    projectKey: selectedClaraDomain.value,
  };
}
