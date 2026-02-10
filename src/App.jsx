import React from "react";
import "./App.css";

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import AppRoutes from "./AppRoutes";

import SimpleSnackbar from "./components/common/SimpleSnackbar/SimpleSnackbar";
import { useDispatch, useSelector } from "react-redux";

import { hideSnackbar } from "./redux/features/snackbar/snackbarSlice";
import {
  selectSnackbarMessage,
  selectSnackbarOpen,
} from "./redux/features/snackbar/snackbarSlice";

const App = () => {
  const dispatch = useDispatch();
  const snackbarOpen = useSelector(selectSnackbarOpen);
  const snackbarMessage = useSelector(selectSnackbarMessage);
  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <AppRoutes />
      </div>
      <Footer />

      <SimpleSnackbar
        isOpen={snackbarOpen}
        onClose={() => dispatch(hideSnackbar())}
        message={snackbarMessage}
      />
    </div>
  );
};

export default App;
