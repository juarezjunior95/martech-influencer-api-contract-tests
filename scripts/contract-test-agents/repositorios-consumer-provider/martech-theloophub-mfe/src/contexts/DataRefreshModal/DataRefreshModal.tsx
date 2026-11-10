import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { TableDataType } from 'components/Table/types';
import {
  DATA_REFRESH_CONFIG,
  DataRefreshConfig,
} from 'constants/dataRefresh/dataRefreshConfig';

import { prepareModalData } from './utils/prepareModalData';

export interface UseDataRefreshResponse {
  data: DataRefreshConfig;
  modalOpen: boolean;
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setShowAllRows: Dispatch<SetStateAction<boolean>>;
  modalData: TableDataType | undefined;
  isDisabledBtn: boolean;
  handleDataForTab: (tab: string) => void;
  showAllRows: boolean;
  toggleShowAllRows: () => void;
  openModalWithTab: (tabName: string) => void;
  selectedTab: string | null;
}

const DataRefreshContex = createContext<UseDataRefreshResponse | undefined>(
  null,
);

export const DataRefreshModalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const data = DATA_REFRESH_CONFIG;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<TableDataType>();
  const [isDisabledBtn, setIsDisabledBtn] = useState(false);
  const [showAllRows, setShowAllRows] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  const handleDataForTab = useCallback(
    (tab: string) => {
      const { modalData, isDisabledBtn } = prepareModalData(
        tab,
        data,
        showAllRows,
      );
      setIsDisabledBtn(isDisabledBtn);
      if (modalData) setModalData(modalData);
    },
    [data, showAllRows],
  );

  const toggleShowAllRows = useCallback(() => {
    setShowAllRows((prev) => !prev);
  }, []);

  const openModalWithTab = useCallback((tabName: string) => {
    setSelectedTab(tabName);
    setModalOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      data,
      modalOpen,
      setModalOpen,
      setShowAllRows,
      modalData,
      isDisabledBtn,
      handleDataForTab,
      showAllRows,
      toggleShowAllRows,
      openModalWithTab,
      selectedTab,
    }),
    [
      data,
      modalOpen,
      setModalOpen,
      setShowAllRows,
      modalData,
      isDisabledBtn,
      handleDataForTab,
      showAllRows,
      toggleShowAllRows,
      openModalWithTab,
      selectedTab,
    ],
  );
  return (
    <DataRefreshContex.Provider value={value}>
      {children}
    </DataRefreshContex.Provider>
  );
};

export const useDataRefreshContext = (): UseDataRefreshResponse => {
  const context = useContext(DataRefreshContex);

  if (!context) {
    throw new Error(
      'useDataRefreshContext must be used within a DataRefreshProvider',
    );
  }

  return context;
};
