import React, { useEffect } from "react";
import "./App.css";

import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import AppRoutes from "./AppRoutes";
import SimpleSnackbar from "./components/common/SimpleSnackbar/SimpleSnackbar";
import AuthForm from "./components/widgets/AuthForm/AuthForm";
import BasicModal from "./components/common/BasicModal/BasicModal";

import { useDispatch, useSelector } from "react-redux";
import { hideSnackbar } from "./redux/features/snackbar/snackbarSlice";
import {
  selectSnackbarMessage,
  selectSnackbarOpen,
} from "./redux/features/snackbar/snackbarSlice";
import {
  selectIsAuthModalOpen,
  selectUser,
} from "./redux/features/auth/authSelector";
import { closeAuthModal } from "./redux/features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const snackbarOpen = useSelector(selectSnackbarOpen);
  const snackbarMessage = useSelector(selectSnackbarMessage);

  const isAuthModalOpen = useSelector(selectIsAuthModalOpen);
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user) {
      dispatch(closeAuthModal());
    }
  }, [dispatch, user]);

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

      <BasicModal
        isOpen={isAuthModalOpen}
        onClose={() => dispatch(closeAuthModal())}
        component={<AuthForm />}
      />
    </div>
  );
};

export default App;
