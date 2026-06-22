import React, { ReactNode } from "react";
import { AppBar, SxProps, Theme, Toolbar, AppBarProps } from "@mui/material";
import { CONTAINER_MAX_WIDTH } from "@/app/(media)/_components/MediaGrid/MediaGrid";

const appBarSx: SxProps<Theme> = {
  borderRadius: `999px`,
  width: "auto",
  maxWidth: CONTAINER_MAX_WIDTH - 16,
  left: "2%",
  right: "2%",
  margin: "0 auto",
  background: `rgba(32, 32, 32, 0.9)`,
  outline: (theme) => `1px solid ${theme.palette.grey["800"]}`,
  outlineOffset: -1,
  top: (theme) => ({
    xs: "auto",
    sm: theme.spacing(1),
  }),
  bottom: (theme) => ({
    xs: theme.spacing(1),
    sm: "auto",
  }),
};
const toolbarSx: SxProps = {
  px: {
    xs: 1,
    sm: 2,
  },
};

interface Props extends Partial<AppBarProps> {
  children: ReactNode;
}

export default function FloatingBar({ children, sx, ...appBarProps }: Props) {
  const resolvedSx = [appBarSx];
  if (sx) {
    if (Array.isArray(sx)) {
      resolvedSx.push(...sx);
    } else {
      resolvedSx.push(sx);
    }
  }

  return (
    <AppBar
      position="fixed"
      elevation={5}
      sx={resolvedSx as SxProps}
      {...appBarProps}
    >
      <Toolbar disableGutters sx={toolbarSx}>
        {children}
      </Toolbar>
    </AppBar>
  );
}
