import {
  getUserApi,
  updateUserApi,
  registerUserApi,
  loginUserApi,
  logoutApi
} from '@api';
import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
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
  isAuchChecked: boolean;
  user: TUser;
  error: string | undefined;
};

const initialState: TUserState = {
  isAuchChecked: false,
  user: {
    email: '',
    name: ''
  },
  error: ''
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  selectors: {
    isAuchCheckedSelector: (state) => state.isAuchChecked,
    getUser: (state) => state.user,
    getUserName: (state) => state.user.name,
    getError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuchChecked = false;
        state.user = { email: '', name: '' };
        state.error = '';
      })
      .addMatcher(
        isAnyOf(
          getUserData.fulfilled,
          updateUser.fulfilled,
          registerUser.fulfilled,
          loginUser.fulfilled
        ),
        (state, action) => {
          state.isAuchChecked = true;
          state.user = action.payload.user;
          state.error = '';
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
          state.isAuchChecked = false;
          state.error = action.error.message;
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
          state.isAuchChecked = false;
          state.error = '';
        }
      );
  }
});

export const { isAuchCheckedSelector, getUser, getUserName, getError } =
  userSlice.selectors;
