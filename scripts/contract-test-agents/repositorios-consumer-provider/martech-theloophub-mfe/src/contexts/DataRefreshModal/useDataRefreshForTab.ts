import { useEffect } from 'react';

import { useDataRefreshContext } from './DataRefreshModal';

export const useDataRefreshForTab = (tabName: string) => {
  const { modalOpen, handleDataForTab, showAllRows } = useDataRefreshContext();

  useEffect(() => {
    if (modalOpen) {
      handleDataForTab(tabName);
    }
  }, [modalOpen, tabName, showAllRows]);
};
