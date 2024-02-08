"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CODE_PARAM, Trakt } from "@/models/services/Trakt";
import { Button, Grid, Typography } from "@mui/material";
import Link from "next/link";

/**
 * Trakt authentication page.
 * @constructor
 */
export default function Page() {
  const code = useSearchParams().get(CODE_PARAM);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const trakt = new Trakt("movies");
      if (code) {
        await trakt.getRefreshToken(code);
        router.replace("/");
      } else {
        await trakt.getAuthenticationCode();
      }
    })();
  }, [code, router]);

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
    </Grid>
  );
}
