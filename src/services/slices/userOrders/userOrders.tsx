import { getOrdersApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getUserOrders = createAsyncThunk(
  'orders/userOrders',
  getOrdersApi
);

export const getUserOrderByNumber = createAsyncThunk(
  'orders/userOrderByNumber',
  getOrderByNumberApi
);

type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
};

export const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    userOrdersList: (state) => state.orders,
    userOrdersByNumber: (state) => state.orders
  },
  extraReducers(builder) {
    builder
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserOrderByNumber.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(getUserOrders.pending, getUserOrderByNumber.pending),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        isAnyOf(getUserOrders.rejected, getUserOrderByNumber.rejected),
        (state) => {
          state.isLoading = false;
        }
      );
  }
});

export const { userOrdersList, userOrdersByNumber } = userOrdersSlice.selectors;
