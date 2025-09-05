"use client";

import React, { Suspense } from "react";
import { Button, GridLegacy as Grid, Typography } from "@mui/material";
import Link from "next/link";
import TraktAuthentication from "@/app/authenticate/trakt/TraktAuthentication";

/**
 * Trakt authentication page.
 * @constructor
 */
export default function Page() {
  return (
    <Grid
      container
      component="main"
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      spacing={2}
    >
      <Grid item>
        <Typography variant="h5" textAlign="center">
          Sign in to your Trakt account and authorize MediaStorage app. When
          finished you will be redirected back to the app.
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" textAlign="center">
          You can close this tab.
        </Typography>
      </Grid>
      <Grid item>
        <Button variant="outlined" component={Link} href="/">
          Back to home screen
        </Button>
      </Grid>

      <Suspense>
        <TraktAuthentication />
      </Suspense>
    </Grid>
  );
}
