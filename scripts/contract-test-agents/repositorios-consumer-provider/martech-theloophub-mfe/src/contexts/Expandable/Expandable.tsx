import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { useGoogleAnalytics } from 'hooks';

type ExpandableContextType = {
  expandedId: string | null;
  toggleExpansion: (id: string, isExpanded: boolean, label: string) => void;
};

const ExpandableContext = createContext<ExpandableContextType | null>(null);

export const ExpandableProvider = ({ children }: { children: ReactNode }) => {
  const trackGA = useGoogleAnalytics();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpansion = useCallback(
    (id: string, isExpanded: boolean, label: string) => {
      setExpandedId((current) => (current === id ? null : id));
      if (!isExpanded) return;

      try {
        trackGA({
          event_category: 'Expand',
          event_action: 'Click',
          event_label: label,
        });
      } catch (error) {
        console.error('Failed to track Google Analytics event:', error);
      }
    },
    [],
  );

  const providerProps = useMemo(() => {
    return { expandedId, toggleExpansion };
  }, [expandedId, toggleExpansion]);

  return (
    <ExpandableContext.Provider value={providerProps}>
      {children}
    </ExpandableContext.Provider>
  );
};

export const useExpandable = () => useContext(ExpandableContext);
