// src/redux/features/auth/authSlice.js

import { createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import {
  signUpUserAsync,
  signInAnonymouslyUserAsync,
  signInUserAsync,
  signOutUserAsync,
} from "./authThunks";

export const authInitialState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: authInitialState,

  reducers: {
    clearUser: (state) => {
      state.user = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },

  extraReducers: (builder) => {
    builder
      //signUp
      .addCase(signUpUserAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signUpUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      //signIn
      .addCase(signInUserAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signInUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      //signInAnonymous
      .addCase(signInAnonymouslyUserAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signInAnonymouslyUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = null;
      })

      //signOut
      .addCase(signOutUserAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(signOutUserAsync.fulfilled, (state, action) => {
        state.user = null;
      })

      //rejected共通処理
      .addMatcher(
        isRejectedWithValue(
          signUpUserAsync,
          signInAnonymouslyUserAsync,
          signInUserAsync,
          signOutUserAsync,
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { clearAuthError, clearUser, setAuthChecked, setUser } =
  authSlice.actions;

export default authSlice.reducer;
