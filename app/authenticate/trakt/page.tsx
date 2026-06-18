"use client";

import React, { Suspense } from "react";
import { Button, Grid, Stack, Typography } from "@mui/material";
import Link from "next/link";
import TraktAuthentication from "@/app/authenticate/trakt/TraktAuthentication";

/**
 * Trakt authentication page.
 * @constructor
 */
export default function Page() {
  return (
    <Stack
      component="main"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
      spacing={2}
    >
      <Grid size="auto">
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Sign in to your Trakt account and authorize MediaStorage app. When
          finished you will be redirected back to the app.
        </Typography>
      </Grid>
      <Grid size="auto">
        <Typography variant="body1" sx={{ textAlign: "center" }}>
          You can close this tab.
        </Typography>
      </Grid>
      <Grid size="auto">
        <Button variant="outlined" component={Link} href="/">
          Back to home screen
        </Button>
      </Grid>

      <Suspense>
        <TraktAuthentication />
      </Suspense>
    </Stack>
  );
}
