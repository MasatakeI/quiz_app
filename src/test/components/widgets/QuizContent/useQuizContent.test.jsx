// useQuizContent.test.jsx
import { describe, vi, expect, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router";
import quizProgressReducer from "../../../../redux/features/quizProgress/quizProgressSlice";
import quizContentReducer from "../../../../redux/features/quizContent/quizContentSlice";

import { useQuizContent } from "../../../../components/widgets/QuizContent/useQuizContent";

const setup = (preloadedState) => {
  const store = configureStore({
    reducer: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
    },
    preloadedState,
  });

  const wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={["/quiz/sports?type=multiple&amount=10"]}>
        {children}
      </MemoryRouter>
    </Provider>
  );

  return { store, wrapper };
};

const baseState = {
  quizContent: {
    quizzes: [
      {
        question: "test q",
        correctAnswer: "a",
        incorrectAnswers: ["b", "c", "d"],
      },
    ],
    isLoading: false,
    fetchError: null,
  },

  quizProgress: {
    currentIndex: 0,
    numberOfCorrects: 0,
    numberOfIncorrects: 0,
    userAnswers: [],
  },
};

describe("useQuizContent.js", () => {
  test("selectAnswerを呼ぶとcanPostがfalseになる", () => {
    const { wrapper } = setup(baseState);
    const { result } = renderHook(() => useQuizContent(), { wrapper });

    act(() => {
      result.current.selectAnswer("a");
    });

    expect(result.current.canPost).toBe(false);
  });
  // hook が正しい action を dispatch しているかの確認

  test("正解を選ぶと正解数が1増える", () => {
    const { store, wrapper } = setup(baseState);
    const { result } = renderHook(() => useQuizContent(), { wrapper });

    act(() => {
      result.current.selectAnswer("a");
    });

    const state = store.getState().quizProgress;
    expect(state.numberOfCorrects).toBe(1);
  });
  // hook が正しい action を dispatch しているかの確認

  test("誤答数を選ぶと誤答数が1増える", () => {
    const { store, wrapper } = setup(baseState);
    const { result } = renderHook(() => useQuizContent(), { wrapper });

    act(() => {
      result.current.selectAnswer("b");
    });

    const state = store.getState().quizProgress;
    expect(state.numberOfIncorrects).toBe(1);
  });

  test("handleNext:currentIndexが1進む,canPostがtrueに戻る,answerMessageがクリアになる", () => {
    const { store, wrapper } = setup(baseState);
    const { result } = renderHook(() => useQuizContent(), { wrapper });

    act(() => {
      result.current.handleNext();
    });

    const state = store.getState().quizProgress;
    expect(state.currentIndex).toBe(1);
    expect(result.current.canPost).toBe(true);
    expect(result.current.answerMessage).toBe(null);
  });

  //slice の責務に近いためコメントアウト
  // test("正解時にanswerMessageが正解文言になる", () => {
  //   const { store, wrapper } = setup(baseState);
  //   const { result } = renderHook(() => useQuizContent(), { wrapper });

  //   act(() => {
  //     result.current.selectAnswer("a");
  //   });

  //   const state = store.getState().quizProgress;

  //   expect(state.userAnswers).toEqual([
  //     {
  //       question: "test q",
  //       correctAnswer: "a",
  //       selectedAnswer: "a",
  //       allAnswers: ["a", "b", "c", "d"],
  //       isCorrect: true,
  //     },
  //   ]);

  //   expect(result.current.answerMessage).toMatch("正解!");
  // });
  // test("不正解時にanswerMessageが不正文言になる", () => {
  //   const { store, wrapper } = setup(baseState);
  //   const { result } = renderHook(() => useQuizContent(), { wrapper });

  //   act(() => {
  //     result.current.selectAnswer("b");
  //   });

  //   const state = store.getState().quizProgress;

  //   expect(state.userAnswers).toEqual([
  //     {
  //       question: "test q",
  //       correctAnswer: "a",
  //       selectedAnswer: "b",
  //       allAnswers: ["a", "b", "c", "d"],
  //       isCorrect: false,
  //     },
  //   ]);

  //   expect(result.current.answerMessage).toMatch("不正解...");
  // });

  test("hadleReloadでクイズを再取得する", () => {
    const { store, wrapper } = setup(baseState);
    const { result } = renderHook(() => useQuizContent(), { wrapper });

    act(() => {
      result.current.handleReload();
    });

    const state = store.getState();

    expect(state.quizContent.isLoading).toBe(true);
    expect(state.quizProgress.currentIndex).toBe(0);
  });
});
