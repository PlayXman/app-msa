import React from "react";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
  SxProps,
} from "@mui/material";

const progressSx: SxProps = {
  width: "1em !important",
  height: "1em !important",
};

export interface Props extends MuiButtonProps {
  loading?: boolean;
}

export default function Button({
  loading = false,
  disabled,
  startIcon,
  ...rest
}: Props) {
  return (
    <MuiButton
      {...rest}
      disabled={loading || disabled}
      startIcon={
        loading ? (
          <CircularProgress size={24} color="inherit" sx={progressSx} />
        ) : (
          startIcon
        )
      }
    />
  );
}
