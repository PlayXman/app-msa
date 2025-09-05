"use client";

import React, { useCallback, useState } from "react";
import {
  Container,
  GridLegacy as Grid,
  SxProps,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { QUICK_SEARCH_URL_PROPERTY_NAME } from "@/app/(media)/_components/AddMediaButton";
import TvShowsNavigationButton from "@/app/(media)/tv-shows/NavigationButton";
import MoviesNavigationButton from "@/app/(media)/movies/NavigationButton";
import GamesNavigationButton from "@/app/(media)/games/NavigationButton";
import BooksNavigationButton from "@/app/(media)/books/NavigationButton";

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
            <MoviesNavigationButton urlParam={quickSearchUrlParam} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <GamesNavigationButton urlParam={quickSearchUrlParam} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <BooksNavigationButton urlParam={quickSearchUrlParam} />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TvShowsNavigationButton urlParam={quickSearchUrlParam} />
          </Grid>
        </Grid>
      </Container>
    </main>
  );
}
