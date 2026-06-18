"use client";

import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Grid
      container
      component="main"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Grid size="auto">
        <Typography variant="h1" sx={{ textAlign: "center" }}>
          404
        </Typography>
        <Button variant="outlined" component={Link} href="/">
          Back to home screen
        </Button>
      </Grid>
    </Grid>
  );
}
