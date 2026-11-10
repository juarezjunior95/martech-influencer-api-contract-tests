import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export type NavigationType = 'route' | 'external' | 'scroll' | 'action';

export interface NavigationTarget {
  type: NavigationType;
  destination?: string;
  handler?: () => void;
}

export type NavigationConfig = Record<number, NavigationTarget>;

interface UseChartNavigationProps {
  config: NavigationConfig;
  onNavigate?: (index: number, target: NavigationTarget) => void;
}

export const useChartNavigation = ({
  config,
  onNavigate,
}: UseChartNavigationProps) => {
  const navigate = useNavigate();

  const handleNavigation = useCallback(
    (index: number | null) => {
      if (index === null) return;

      const target = config[index];
      if (!target) return;

      onNavigate?.(index, target);

      const handlers: Record<NavigationType, () => void> = {
        route: () => {
          if (!target.destination) return;
          navigate(target.destination);
        },
        external: () => {
          if (!target.destination) return;
          window.open(target.destination, '_blank', 'noopener,noreferrer');
        },
        scroll: () => {
          if (!target.destination) return;
          if (target.destination === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          if (target.destination === 'bottom') {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            });
            return;
          }
          try {
            document
              .querySelector(target.destination)
              ?.scrollIntoView({ behavior: 'smooth' });
          } catch {}
        },
        action: () => target.handler?.(),
      };

      handlers[target.type]();
    },
    [config, navigate, onNavigate],
  );

  return { handleNavigation };
};
