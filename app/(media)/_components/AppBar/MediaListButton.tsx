import { IconButton, SxProps, Theme } from "@mui/material";
import React from "react";
import { GridViewRounded as GridViewRoundedIcon } from "@mui/icons-material";
import Link from "next/link";

const buttonSx: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.grey["800"],
};

export default function MediaListButton() {
  return (
    <IconButton component={Link} href="/" color="inherit" sx={buttonSx}>
      <GridViewRoundedIcon />
    </IconButton>
  );
}
