import { configureStore, createSlice } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { productsApi } from './productsApi';
import { interactionsApi } from './interactionsApi';

const appSlice = createSlice({
  name: 'app',
  initialState: { initialized: true },
  reducers: {},
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    auth: authReducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [interactionsApi.reducerPath]: interactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productsApi.middleware,
      interactionsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 