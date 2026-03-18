//src/models/QuizHistoryModel.js

import {
  addDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  orderBy,
  doc,
  where,
} from "firebase/firestore";

import { QuizHistoryError } from "./errors/quizHistory/quizHistoryError";
import { quizHistoryRef } from "@/firebase";
import { QUIZ_HISTORY_ERROR_CODE } from "./errors/quizHistory/quizHistoryErrorCode";
import { mapQuizHistoryError } from "./errors/quizHistory/mapQuizHistoryError";

import { format } from "date-fns";

export const createHistory = (id, data) => {
  // if (
  //   !data ||
  //   // typeof data.category !== "string" ||
  //   typeof data.difficulty !== "string" ||
  //   typeof data.score !== "number" ||
  //   typeof data.totalQuestions !== "number" ||
  //   typeof data.date?.toDate !== "function"
  // ) {
  //   throw new QuizHistoryError({
  //     code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
  //     message: "無効なデータです",
  //   });
  // }

  console.log("Checking data for ID:", id, data); // これで中身を全出しする

  if (!data || !data.date) {
    console.error("Data or Date is missing for ID:", id);
    throw new QuizHistoryError({
      code: QUIZ_HISTORY_ERROR_CODE.INVALID_DATA,
      message: "無効なデータです",
    });
  }

  // toDateが存在するか安全に確認
  const timestamp = data.date.toDate ? data.date.toDate() : new Date(data.date);
  const dateObj = format(timestamp, "yyyy/MM/dd HH:mm");

  // const dateObj = format(data.date.toDate(), "yyyy/MM/dd HH:mm");

  return {
    id,
    category: data.category,
    date: dateObj,
    difficulty: data.difficulty,
    type: data.type,
    score: data.score,
    totalQuestions: data.totalQuestions,
    accuracy:
      data.totalQuestions > 0
        ? Number((data.score / data.totalQuestions).toFixed(2))
        : 0,
  };
};

export const addHistory = async (userId, resultData) => {
  try {
    if (typeof resultData.score !== "number") {
      throw new QuizHistoryError({
        code: QUIZ_HISTORY_ERROR_CODE.VALIDATION,
        message: "スコア情報が不足しています",
      });
    }

    const postData = {
      ...resultData,
      userId,
      date: serverTimestamp(),
    };

    const docRef = await addDoc(quizHistoryRef, postData);
    const snapShot = await getDoc(docRef);

    if (!snapShot.exists()) {
      throw new QuizHistoryError({
        code: QUIZ_HISTORY_ERROR_CODE.UNKNOWN,
        message: "クイズ結果の追加に失敗しました",
      });
    }

    const data = snapShot.data();

    const model = createHistory(docRef.id, data);

    return model;
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const fetchHistories = async (userId) => {
  try {
    const q = query(
      quizHistoryRef,
      where("userId", "==", userId),
      orderBy("date", "desc"),
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.docs.length) {
      return [];
    }

    // fetchHistories 内
    return querySnapshot.docs.map((doc) => {
      return createHistory(doc.id, doc.data());
    });
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};

export const deleteHistory = async (id) => {
  try {
    const docRef = doc(quizHistoryRef, id);
    const snapShot = await getDoc(docRef);

    if (!snapShot.exists()) {
      throw new QuizHistoryError({
        code: QUIZ_HISTORY_ERROR_CODE.NOT_FOUND,
        message: "削除対象のデータが見つかりませんでした",
      });
    }

    const data = snapShot.data();
    const model = createHistory(docRef.id, data);

    await deleteDoc(docRef);

    return model;
  } catch (error) {
    throw mapQuizHistoryError(error);
  }
};
