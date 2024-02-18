"use client";

import React, { useCallback, useState } from "react";
import {
  Container,
  Grid,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import MediaButton from "@/app/_components/MediaButton";
import {
  LocalMovies as LocalMoviesIcon,
  VideogameAsset as VideogameAssetIcon,
  Book as BookIcon,
  LiveTv as LiveTvIcon,
} from "@mui/icons-material";
import { QUICK_SEARCH_URL_PROPERTY_NAME } from "@/app/(media)/_components/AddMediaButton";

const containerSx: SxProps = {
  py: 2,
  minHeight: "100vh",
};
const hideOnMobileSx: SxProps = {
  display: { xs: "none", sm: "block" },
};

export default function Page() {
  const [quickSearchUrlParam, setQuickSearchUrlParam] = useState("");

  const handleSearchChange = useCallback<
    NonNullable<TextFieldProps["onChange"]>
  >((event) => {
    const value = event.target.value;

    if (value) {
      setQuickSearchUrlParam(`?${QUICK_SEARCH_URL_PROPERTY_NAME}=${value}`);
    } else {
      setQuickSearchUrlParam("");
    }
  }, []);

  return (
    <main>
      <Container maxWidth="md">
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          alignContent="center"
          spacing={{ xs: 2, sm: 4 }}
          sx={containerSx}
        >
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
              MediaStorage App
            </Typography>
          </Grid>
          <Grid item xs={false} sm={3} sx={hideOnMobileSx} />
          <Grid item xs={12} sm={6}>
            <TextField
              type="search"
              placeholder="Quick search..."
              fullWidth
              name={QUICK_SEARCH_URL_PROPERTY_NAME}
              onChange={handleSearchChange}
            />
          </Grid>
          <Grid item xs={false} sm={3} sx={hideOnMobileSx} />
          <Grid item xs={6} sm={3}>
            <MediaButton
              href={`/movies${quickSearchUrlParam}`}
              Icon={LocalMoviesIcon}
              label="Movies"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <MediaButton
              href={`/games${quickSearchUrlParam}`}
              Icon={VideogameAssetIcon}
              label="Games"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <MediaButton
              href={`/books${quickSearchUrlParam}`}
              Icon={BookIcon}
              label="Books"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <MediaButton
              href={`/tv-shows${quickSearchUrlParam}`}
              Icon={LiveTvIcon}
              label="TV Shows"
            />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
