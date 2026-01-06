import React from "react";
import "./App.css";

import Header from "../src/components/layout/Header/Header";
import HomePage from "../src/components/page/HomePage/HomePage";
import QuizPage from "../src/components/page/QuizPage/QuizPage";

import { Routes, Route } from "react-router";
import Footer from "./components/layout/Footer/Footer";

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz/:category" element={<QuizPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
