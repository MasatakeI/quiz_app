//components/page/HomePage/HomePage.jsx

import React from "react";
import "./HomePage.css";

import Selection from "../../common/Selection/Selection";
import SimpleSnackbar from "../../common/SimpleSnackbar/SimpleSnackbar";
import Button from "../../common/Button/Button";

import { useHomePage } from "./useHomePage";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const HomePage = () => {
  const { items, handleStart, errorMessage, snackbarOpen, closeSnackbar } =
    useHomePage();

  return (
    <div className="home-page">
      <h1>クイズに挑戦</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} className="select-sections">
          {items.map((item, index) => {
            return (
              <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                <Selection
                  label={item.label}
                  value={item.value}
                  onChange={(e) => item.onChange(e.target.value)}
                  array={item.array}
                  disabled={item.disabled}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <div className="error-message">
        <SimpleSnackbar
          isOpen={snackbarOpen}
          onClose={closeSnackbar}
          message={errorMessage}
        />
      </div>

      <div className="quiz-start-button">
        <Button onClickHandler={handleStart}>クイズスタート</Button>
      </div>
    </div>
  );
};

export default HomePage;
