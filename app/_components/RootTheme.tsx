"use client";

import React, { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const theme = createTheme({
  palette: {
    primary: {
      main: "#9dc358",
      contrastText: "#f9fbe7",
    },
    secondary: {
      main: "#42baff",
      contrastText: "#e0f7fa",
    },
    background: {
      default: "#f1f1f1",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

/**
 * MUI theme.
 * @param children
 * @constructor
 */
export default function RootTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
