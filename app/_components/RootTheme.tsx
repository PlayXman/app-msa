"use client";

import React, { ReactNode } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { CssBaseline, ThemeOptions } from "@mui/material";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#9dc358",
    },
    secondary: {
      main: "#42baff",
    },
    background: {
      default: "#0e0e0e",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
};

const theme = createTheme(themeOptions);

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
