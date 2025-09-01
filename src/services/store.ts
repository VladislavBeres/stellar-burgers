import { configureStore, combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlise } from './slices/ingredients';
import { feedsSlice } from './slices/feed';
import { constructorSlice } from './slices/constructor';
import { userSlice } from './slices/user';
import { userOrdersSlice } from './slices/userOrders';
import { createOrderSlice } from './slices/newOrder';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineSlices(
  ingredientsSlise,
  feedsSlice,
  constructorSlice,
  userSlice,
  userOrdersSlice,
  createOrderSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
