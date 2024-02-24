import { createTheme, ThemeProvider } from "@mui/material";
import React, { ReactNode, useEffect, useMemo } from "react";
import { themeOptions } from "@/app/_components/RootTheme";
import { SX_WIDTH } from "@/app/(media)/_components/Alphabet/Alphabet";
import { colorToHexAlpha } from "@/models/utils/formatters";

export default function PageTheme({
  secondaryColor,
  children,
}: {
  secondaryColor: string;
  children: ReactNode;
}) {
  const theme = useMemo(() => {
    return createTheme({
      ...themeOptions,
      palette: {
        ...themeOptions.palette,
        secondary: {
          main: secondaryColor,
        },
      },
    });
  }, [secondaryColor]);

  useEffect(() => {
    document.body.style.backgroundImage = `radial-gradient(ellipse at calc(100% - ${theme.spacing(SX_WIDTH)} - 28px) calc(100% - ${theme.spacing(2)} - 28px), ${colorToHexAlpha(theme.palette.secondary.main, 0.2)} 0%, ${colorToHexAlpha(theme.palette.secondary.main, 0)} 100%)`;
  }, [theme]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
