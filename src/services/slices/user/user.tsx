import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

export const getUserData = createAsyncThunk('user/getUser', getUserApi);
export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);
export const registerUser = createAsyncThunk(
  'user/registerUser',
  registerUserApi
);
export const loginUser = createAsyncThunk('user/loginUser', loginUserApi);
export const logoutUser = createAsyncThunk('user/logoutUser', logoutApi);

type TUserState = {
  isAuthChecked: boolean;
  user: TUser;
  error: string | undefined;
  isLoading: boolean;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  user: { email: '', name: '' },
  error: '',
  isLoading: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    isAuthCheckedSelector: (state: TUserState) => state.isAuthChecked,
    getUser: (state: TUserState) => state.user,
    getUserName: (state: TUserState) => state.user.name,
    getError: (state: TUserState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthChecked = false;
        state.user = { email: '', name: '' };
        state.error = '';
        state.isLoading = false;
      })
      .addMatcher(
        isAnyOf(
          getUserData.fulfilled,
          updateUser.fulfilled,
          registerUser.fulfilled,
          loginUser.fulfilled
        ),
        (state, action) => {
          state.isAuthChecked = true;
          state.user = action.payload.user;
          state.error = '';
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          getUserData.rejected,
          updateUser.rejected,
          registerUser.rejected,
          loginUser.rejected,
          logoutUser.rejected
        ),
        (state, action) => {
          state.error = action.error?.message || '';
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          getUserData.pending,
          updateUser.pending,
          registerUser.pending,
          loginUser.pending,
          logoutUser.pending
        ),
        (state) => {
          state.isLoading = true;
          state.error = '';
        }
      );
  }
});

export const { isAuthCheckedSelector, getUser, getUserName, getError } =
  userSlice.selectors;
