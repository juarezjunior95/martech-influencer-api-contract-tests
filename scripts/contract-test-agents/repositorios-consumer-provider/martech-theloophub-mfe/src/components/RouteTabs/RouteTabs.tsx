import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Tabs } from '@hexa-ui/components';
import { useGoogleAnalytics } from 'hooks';

import { StyledTabContent, StyledTabsList } from './RouteTabs.styles';

export type TabInfo = {
  id: string;
  label: string;
  disabled?: boolean;
  content?: React.ReactNode;
  filterConfig?: {
    pageName: string;
    filtersList?: string[];
    params?: Record<string, any>;
    hidden?: boolean;
  };
};

export type RouteTabsProps = {
  tabsInfos: TabInfo[];
  baseRoute: string;
  onTabChange?: (tabId: string) => void;
  maxWidth?: string;
  disableTabs?: boolean;
  dataTestId?: string;
};

export const RouteTabs: React.FC<RouteTabsProps> = ({
  dataTestId,
  tabsInfos,
  baseRoute,
  onTabChange,
  maxWidth = '1364px',
  disableTabs = false,
}: RouteTabsProps) => {
  const trackGA = useGoogleAnalytics();
  const { Root, Trigger } = Tabs;
  const navigate = useNavigate();
  const { tab } = useParams();

  const setTab = useCallback(
    ({ currentTab }: { currentTab: string }) => {
      const targetTab = tabsInfos.find((t) => t.id === currentTab);
      const filterHidden = targetTab?.filterConfig?.hidden ?? false;
      if (filterHidden) {
        navigate(`${baseRoute}/${currentTab}`, {
          replace: true,
        });
      } else {
        const queryParams = location.search;
        navigate(`${baseRoute}/${currentTab}${queryParams}`, {
          replace: true,
        });
      }

      if (onTabChange) onTabChange(currentTab);
    },
    [navigate, baseRoute, onTabChange, location.search, tabsInfos],
  );

  const tabIds = useMemo(() => {
    return tabsInfos.filter((tab) => !tab.disabled).map((tab) => tab.id);
  }, [tabsInfos]);

  const defaultTab = useMemo<string>(() => {
    if (tab && tabIds.includes(tab)) return tab;

    return tabIds[0];
  }, [tab, tabIds]);

  const handleSetTab = (tab: TabInfo) => {
    trackGA({
      event_category: 'Content',
      event_action: 'Content',
      event_label: tab.label,
    });

    setTab({ currentTab: tab.id });
  };

  useEffect(() => {
    if (tab && tabIds.includes(tab)) return;

    setTab({ currentTab: tabIds[0] });
  }, [tab, tabIds, setTab]);

  return (
    <div style={{ maxWidth }}>
      <Root
        defaultValue={defaultTab}
        value={defaultTab}
        data-testid={dataTestId ? `${dataTestId}-tabs-root` : undefined}
      >
        <div style={{ width: 'fit-content', maxWidth }}>
          <StyledTabsList
            data-testid={dataTestId ? `${dataTestId}-tabs-list` : undefined}
          >
            {tabsInfos
              .filter((tab) => !tab.disabled)
              .map((tab) => (
                <Trigger
                  data-testid={
                    dataTestId
                      ? `${dataTestId}-tab-trigger-${tab.id}`
                      : undefined
                  }
                  style={{
                    cursor: tab.disabled || disableTabs ? 'default' : 'pointer',
                  }}
                  key={tab.id}
                  value={tab.id}
                  disabled={tab.disabled || disableTabs}
                  onClick={() => !disableTabs && handleSetTab(tab)}
                >
                  {tab.label}
                </Trigger>
              ))}
          </StyledTabsList>
        </div>
        {tabsInfos
          .filter((tab) => !tab.disabled)
          .map((tab) => (
            <StyledTabContent
              data-testid={
                dataTestId ? `${dataTestId}-tab-content-${tab.id}` : undefined
              }
              key={tab.id}
              className="styled-tab-content"
              value={tab.id}
            >
              {tab.content}
            </StyledTabContent>
          ))}
      </Root>
    </div>
  );
};
