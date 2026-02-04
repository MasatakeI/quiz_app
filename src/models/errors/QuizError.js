// src/models/errors/QuizError.js

import { MODEL_ERROR_CODE } from "./quizErrorCode";

export class QuizError extends Error {
  constructor({ code, message, field, cause }) {
    const resolvedCode = Object.values(MODEL_ERROR_CODE).includes(code)
      ? code
      : MODEL_ERROR_CODE.UNKNOWN;

    super(message ?? resolvedCode);
    this.name = "QuizError";
    this.code = resolvedCode;
    this.field = field;

    if (cause instanceof Error) {
      this.cause = cause;
    }
  }
}
