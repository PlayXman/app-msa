import React from "react";
import { Button, GridLegacy as Grid, Typography } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Grid
      container
      component="main"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Grid item>
        <Typography variant="h1" textAlign="center">
          404
        </Typography>
        <Button variant="outlined" component={Link} href="/">
          Back to home screen
        </Button>
      </Grid>
    </Grid>
  );
}
