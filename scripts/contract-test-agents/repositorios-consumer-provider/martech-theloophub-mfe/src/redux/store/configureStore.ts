import { configureStore } from '@reduxjs/toolkit';

import { insightsCopilotApi } from '../api/insightsCopilot';
import { urlSyncMiddleware } from '../middleware/urlSyncMiddleware';
import { rootReducer } from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(insightsCopilotApi.middleware)
      .concat(urlSyncMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
