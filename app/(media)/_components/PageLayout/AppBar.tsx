import React, { ReactNode } from "react";
import { useScrollTrigger, AppBar as MuiAppBar } from "@mui/material";

export default function AppBar({ children }: { children: ReactNode }) {
  const windowObj = typeof window !== "undefined" ? window : undefined;
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: windowObj,
  });

  return (
    <MuiAppBar
      elevation={scrollTrigger ? 1 : 0}
      sx={() => {
        return {
          backgroundColor: scrollTrigger ? "background.paper" : "transparent",
        };
      }}
    >
      {children}
    </MuiAppBar>
  );
}
