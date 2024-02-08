import React from "react";
import {
  Tooltip,
  IconButton as MuiIconButton,
  IconButtonProps as MuiIconButtonProps,
  CircularProgress,
  SxProps,
} from "@mui/material";

const loaderSx: SxProps = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100% !important",
  height: "100% !important",
  zIndex: 1,
};

export interface Props extends MuiIconButtonProps {
  label?: string;
  loading?: boolean;
}

export default function IconButton({
  label,
  loading = false,
  children,
  disabled,
  ...buttonProps
}: Props) {
  return (
    <Tooltip disableFocusListener title={label ?? null}>
      <div>
        <MuiIconButton disabled={disabled || loading} {...buttonProps}>
          {children}
          {loading && <CircularProgress color="inherit" sx={loaderSx} />}
        </MuiIconButton>
      </div>
    </Tooltip>
  );
}
