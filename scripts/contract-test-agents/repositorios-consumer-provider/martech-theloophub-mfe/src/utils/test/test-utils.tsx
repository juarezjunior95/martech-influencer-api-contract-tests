import { Provider } from 'react-redux';

import { configureStore } from '@reduxjs/toolkit';
import { render as renderTest } from '@testing-library/react';

import { rootReducer } from '../../redux/store';

export { createDataTestId } from './createDataTestId';

export function render(ui: React.ReactElement, preloadedState = {}) {
  const store = configureStore({ reducer: rootReducer, preloadedState });

  return {
    ...renderTest(<Provider store={store}>{ui}</Provider>),
    store,
  };
}
