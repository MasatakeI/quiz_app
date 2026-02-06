// useQuizContent.test.jsx
import { describe, vi, expect, test, beforeEach } from "vitest";
import { act } from "@testing-library/react";

import quizProgressReducer, {
  progressInitialState,
} from "../../../../redux/features/quizProgress/quizProgressSlice";
import quizContentReducer, {
  contentInitialState,
} from "../../../../redux/features/quizContent/quizContentSlice";
import quizSettingsReducer, {
  settingsInitialState,
} from "@/redux/features/quizSettings/quizSettingsSlice";

import { useQuizContent } from "../../../../components/widgets/QuizContent/useQuizContent";
import { renderHookWithStore } from "@/test/utils/renderHookWithStore";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");

  return {
    ...actual,

    useParams: () => ({ category: "sports" }),
  };
});

describe("useQuizContent.js", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const commonOptions = {
    reducers: {
      quizContent: quizContentReducer,
      quizProgress: quizProgressReducer,
      quizSettings: quizSettingsReducer,
    },
    preloadedState: {
      quizContent: { ...contentInitialState },
      quizProgress: { ...progressInitialState },
      quizSettings: { ...settingsInitialState },
    },
  };

  describe("selectAnswer", () => {
    test("selectAnswerを呼ぶとcanPostがfalse,quizResultに値がセットされsubmitAnswerがdispatchされる", () => {
      const { result, dispatchSpy } = renderHookWithStore({
        hook: () => useQuizContent(),
        ...commonOptions,
        preloadedState: {
          ...commonOptions.preloadedState,
          quizContent: {
            quizzes: [
              { correctAnswer: "a", incorrectAnswers: ["b", "c", "d"] },
            ],
          },
        },
      });

      act(() => {
        result.current.selectAnswer("a");
      });

      expect(result.current.quizResult).toEqual({
        isCorrect: true,
        selected: "a",
        correct: "a",
        message: "正解!",
      });
      expect(result.current.canPost).toBe(false);
      expect(dispatchSpy).toHaveBeenCalled();
    });

    test.each([
      {
        answer: "a",
        targetField: "numberOfCorrects",
      },
      {
        answer: "b",
        targetField: "numberOfIncorrects",
      },
    ])(
      "回答が$answerの時$targetFieldが加算される",
      ({ answer, targetField }) => {
        const { result, store } = renderHookWithStore({
          hook: () => useQuizContent(),
          ...commonOptions,
          preloadedState: {
            ...commonOptions.preloadedState,
            quizContent: {
              quizzes: [
                { correctAnswer: "a", incorrectAnswers: ["b", "c", "d"] },
              ],
            },
          },
        });

        act(() => {
          result.current.selectAnswer(answer);
        });

        const state = store.getState().quizProgress;
        expect(state[targetField]).toBe(1);
      },
    );
  });

  test("handleNext:currentIndexが1進む,canPostがtrueに戻る,quizResultがnullになる", () => {
    const { result, store } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        quizContent: {
          quizzes: [{ correctAnswer: "a", incorrectAnswers: ["b", "c", "d"] }],
        },
      },
    });

    act(() => {
      result.current.selectAnswer("a");
    });

    expect(result.current.canPost).toBe(false);

    act(() => {
      result.current.handleNext();
    });

    const state = store.getState().quizProgress;
    expect(state.currentIndex).toBe(1);
    expect(result.current.canPost).toBe(true);
    expect(result.current.quizResult).toBe(null);
  });

  test("type=booleanの時選択肢はTrue/Falseに固定される", () => {
    const { result } = renderHookWithStore({
      hook: () => useQuizContent(),
      ...commonOptions,
      preloadedState: {
        ...commonOptions.preloadedState,
        quizContent: {
          quizzes: [{ question: "a" }],
        },
      },
      initialPath: "/quiz/sports?type=boolean",
    });
    expect(result.current.answers).toEqual(["True", "False"]);
  });
});
