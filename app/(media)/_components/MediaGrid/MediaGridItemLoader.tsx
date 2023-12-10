import React from "react";
import { Skeleton } from "@mui/material";

export default function MediaGridItemLoader() {
  return (
    <>
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="circular" width={20} height={20} />
    </>
  );
}
