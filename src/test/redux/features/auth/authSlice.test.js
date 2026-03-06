// src/test/redux/features/auth/authSlice.js

import { describe, expect, test, vi, beforeEach } from "vitest";

import authSlice, {
  clearUser,
  clearAuthError,
  setAuthChecked,
  setUser,
  authInitialState,
} from "@/redux/features/auth/authSlice";

import {
  signInAnonymouslyUserAsync,
  signInUserAsync,
  signOutUserAsync,
  signUpUserAsync,
} from "@/redux/features/auth/authThunks";

const mockUser = {
  uid: "1",
  email: "xxx@xxx.com",
  emailVerified: false,
};

const mockUserVerifiedEmail = {
  ...mockUser,
  emailVerified: true,
};

//ヘルパー
const applyPending = (slice, thunk, prev = authInitialState) =>
  slice(prev, thunk.pending());

const applyFulfilled = (slice, thunk, paylod, prev) =>
  slice(prev, thunk.fulfilled(paylod));

const applyRejected = (slice, thunk, paylod, prev) =>
  slice(prev, thunk.rejected({}, "requestId", undefined, paylod));

describe("authSlice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("初期stateのテスト", () => {
    expect(authInitialState).toEqual({
      user: null,
      isLoading: false,
      error: null,
      isAuthChecked: false,
    });
  });

  describe("reducers", () => {
    test("clearUser:ユーザー情報をnullにする", () => {
      const stateWithUser = {
        ...authInitialState,
        user: mockUser,
      };

      const action = clearUser();

      const state = authSlice(stateWithUser, action);
      expect(state).toEqual({
        ...stateWithUser,
        user: null,
      });
    });

    test("clearAuthError:errorをnullにする", () => {
      const stateWithError = {
        ...authInitialState,
        error: "エラー",
      };

      const action = clearAuthError();

      const state = authSlice(stateWithError, action);
      expect(state).toEqual({
        ...stateWithError,
        error: null,
      });
    });
    test("setAuthChecked:isAuthCheckedをtrueにする", () => {
      const prev = {
        ...authInitialState,
        isAuthChecked: false,
      };

      const action = setAuthChecked();

      const state = authSlice(prev, action);
      expect(state).toEqual({
        ...prev,
        isAuthChecked: true,
      });
    });

    test("setUser:ユーザー情報を設定する", () => {
      const action = setUser(mockUser);
      expect(authSlice(authInitialState, action)).toEqual({
        ...authInitialState,
        user: mockUser,
      });
    });
  });

  describe("extraReducers", () => {
    describe("fulfilled共通処理:pendingからfulfilledに遷移し user情報を更新する", () => {
      test.each([
        {
          title: "signUpUserAsync",
          thunk: signUpUserAsync,
          paylod: mockUser,
        },
        {
          title: "signInAnonymouslyUserAsync",
          thunk: signInAnonymouslyUserAsync,
          paylod: mockUser,
        },
        {
          title: "signInUserAsync",
          thunk: signInUserAsync,
          paylod: mockUserVerifiedEmail,
        },
      ])("$title", async ({ thunk, paylod }) => {
        const pending = applyPending(authSlice, thunk);
        expect(pending).toEqual({
          ...authInitialState,
          isLoading: true,
        });

        const fulfilled = applyFulfilled(authSlice, thunk, paylod, pending);

        expect(fulfilled).toEqual({
          ...pending,
          isLoading: false,
          user: paylod,
        });
      });
    });

    test("signOutUserAsync:pendingからfulfilledに遷移し user=nullになる", () => {
      const pending = applyPending(authSlice, signOutUserAsync);
      expect(pending).toEqual({
        ...authInitialState,
        isLoading: true,
      });

      const fulfilled = applyFulfilled(
        authSlice,
        signOutUserAsync,
        {},
        pending,
      );
      expect(fulfilled).toEqual({
        ...pending,
        user: null,
      });
    });

    describe("rejected共通処理", () => {
      test.each([
        {
          title: "signUpUserAsync",
          thunk: signUpUserAsync,
        },
        {
          title: "signInAnonymouslyUserAsync",
          thunk: signInAnonymouslyUserAsync,
        },
        {
          title: "signInUserAsync",
          thunk: signInUserAsync,
        },
        {
          title: "signOutUserAsync",
          thunk: signOutUserAsync,
        },
      ])("$title", ({ thunk }) => {
        const pending = applyPending(authSlice, thunk);
        const error = "error";

        const rejected = applyRejected(authSlice, thunk, error, pending);

        expect(rejected).toEqual({
          ...pending,
          isLoading: false,
          error,
        });
      });
    });
  });
});
