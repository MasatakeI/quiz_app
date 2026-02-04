import React from "react";
import "./App.css";

import Header from "./components/layout/Header/Header";
import HomePage from "./components/page/HomePage/HomePage";
import QuizPage from "./components/page/QuizPage/QuizPage";
import Footer from "@/components/layout/Footer/Footer";

import { BrowserRouter, Routes, Route } from "react-router";
import SimpleSnackbar from "./components/common/SimpleSnackbar/SimpleSnackbar";
import { useDispatch, useSelector } from "react-redux";

import {
  hideSnackbar,
  selectSnackbarMessage,
  selectSnackbarOpen,
} from "./redux/features/snackbar/snackbarSlice";

const App = () => {
  const dispatch = useDispatch();
  const snackbarOpen = useSelector(selectSnackbarOpen);
  const snackbarMessage = useSelector(selectSnackbarMessage);
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz/:category" element={<QuizPage />} />
          </Routes>
        </div>
        <Footer />

        <SimpleSnackbar
          isOpen={snackbarOpen}
          onClose={() => dispatch(hideSnackbar())}
          message={snackbarMessage}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
