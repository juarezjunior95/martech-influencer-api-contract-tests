/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { DATA_REFRESH_CONFIG } from 'constants/dataRefresh/dataRefreshConfig';

import {
  DataRefreshModalProvider,
  useDataRefreshContext,
} from './DataRefreshModal';

jest.mock('./utils/prepareModalData', () => ({
  prepareModalData: jest.fn(),
}));

import { prepareModalData } from './utils/prepareModalData';

const TestConsumer = () => {
  const {
    modalOpen,
    setModalOpen,
    showAllRows,
    toggleShowAllRows,
    openModalWithTab,
    selectedTab,
    isDisabledBtn,
    handleDataForTab,
  } = useDataRefreshContext();

  return (
    <div>
      <div data-testid="modal-open">{String(modalOpen)}</div>
      <div data-testid="show-all-rows">{String(showAllRows)}</div>
      <div data-testid="selected-tab">{String(selectedTab)}</div>
      <div data-testid="is-disabled-btn">{String(isDisabledBtn)}</div>
      <button data-testid="open-modal" onClick={() => setModalOpen(true)}>
        Open
      </button>
      <button data-testid="toggle-rows" onClick={toggleShowAllRows}>
        Toggle
      </button>
      <button
        data-testid="open-with-tab"
        onClick={() => openModalWithTab('overview')}
      >
        OpenWithTab
      </button>
      <button
        data-testid="handle-tab"
        onClick={() => handleDataForTab('overview')}
      >
        HandleTab
      </button>
    </div>
  );
};

describe('DataRefreshModalProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prepareModalData as jest.Mock).mockReturnValue({
      modalData: { rows: [] },
      isDisabledBtn: false,
    });
  });

  describe('Rendering', () => {
    it('should render children', () => {
      render(
        <DataRefreshModalProvider>
          <div data-testid="child">Child</div>
        </DataRefreshModalProvider>,
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should start with modal closed', () => {
      render(
        <DataRefreshModalProvider>
          <TestConsumer />
        </DataRefreshModalProvider>,
      );

      expect(screen.getByTestId('modal-open')).toHaveTextContent('false');
    });
  });

  describe('Functionality', () => {
    it('should open modal', () => {
      render(
        <DataRefreshModalProvider>
          <TestConsumer />
        </DataRefreshModalProvider>,
      );

      fireEvent.click(screen.getByTestId('open-modal'));

      expect(screen.getByTestId('modal-open')).toHaveTextContent('true');
    });

    it('should toggle showAllRows', () => {
      render(
        <DataRefreshModalProvider>
          <TestConsumer />
        </DataRefreshModalProvider>,
      );

      expect(screen.getByTestId('show-all-rows')).toHaveTextContent('false');

      fireEvent.click(screen.getByTestId('toggle-rows'));

      expect(screen.getByTestId('show-all-rows')).toHaveTextContent('true');
    });

    it('should openModalWithTab and set selectedTab', () => {
      render(
        <DataRefreshModalProvider>
          <TestConsumer />
        </DataRefreshModalProvider>,
      );

      fireEvent.click(screen.getByTestId('open-with-tab'));

      expect(screen.getByTestId('modal-open')).toHaveTextContent('true');
      expect(screen.getByTestId('selected-tab')).toHaveTextContent('overview');
    });

    it('should call prepareModalData when handleDataForTab is called', () => {
      render(
        <DataRefreshModalProvider>
          <TestConsumer />
        </DataRefreshModalProvider>,
      );

      fireEvent.click(screen.getByTestId('handle-tab'));

      expect(prepareModalData).toHaveBeenCalledWith(
        'overview',
        DATA_REFRESH_CONFIG,
        false,
      );
    });

    it('should not set modalData when prepareModalData returns null modalData', () => {
      (prepareModalData as jest.Mock).mockReturnValue({
        modalData: null,
        isDisabledBtn: true,
      });

      render(
        <DataRefreshModalProvider>
          <TestConsumer />
        </DataRefreshModalProvider>,
      );

      fireEvent.click(screen.getByTestId('handle-tab'));

      expect(screen.getByTestId('is-disabled-btn')).toHaveTextContent('true');
    });
  });

  describe('States', () => {
    it('should throw error when useDataRefreshContext is used outside provider', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() => {
        try {
          return useDataRefreshContext();
        } catch (e) {
          return e as Error;
        }
      });

      expect((result.current as Error).message).toBe(
        'useDataRefreshContext must be used within a DataRefreshProvider',
      );

      consoleSpy.mockRestore();
    });
  });
});
