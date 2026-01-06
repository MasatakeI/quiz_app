//quizSettingsSlice.test.js

import { describe, test, expect, vi, beforeEach } from "vitest";

import quizSettingsReducer, {
  settingsInitialState,
  setQuizSettings,
  resetQuizSettings,
  updateSettings,
} from "../../../../redux/features/quizSettings/quizSettingsSlice";

describe("quizSettingsSlice.jsのテスト", () => {
  test("初期stateの確認", () => {
    expect(settingsInitialState).toEqual({
      category: "",
      type: "",
      difficulty: "",
      amount: "",
    });
  });

  describe("reducers", () => {
    describe("setQuizSetttings", () => {
      test("クイズ条件を設定する", () => {
        const action = setQuizSettings({
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: 10,
        });

        const state = quizSettingsReducer(settingsInitialState, action);

        expect(state).toEqual({
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: 10,
        });
      });
    });

    describe("resetQuizSettings", () => {
      test("stateを初期状態に戻す", () => {
        const prev = {
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: 10,
        };

        const action = resetQuizSettings();
        const state = quizSettingsReducer(prev, action);
        expect(state).toEqual(settingsInitialState);
      });
    });

    describe("updateSettings", () => {
      test.each([
        ["category", "music"],
        ["type", "boolean"],
        ["difficulty", "medium"],
        ["amount", 20],
      ])("%sを%sに変更", (key, value) => {
        const prev = {
          category: "sports",
          type: "multiple",
          difficulty: "easy",
          amount: 10,
        };

        const action = updateSettings({ key, value });
        const state = quizSettingsReducer(prev, action);
        expect(state[key]).toEqual(value);
      });
    });
  });
});
