"use client";

import React, { useCallback, useEffect, useReducer } from "react";
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

/** Quick search value - quick search url param tuple */
type QuickSearchState = [string, string];

function quickSearchReducer(
  _: QuickSearchState,
  action: string,
): QuickSearchState {
  if (action) {
    return [action, `?${QUICK_SEARCH_URL_PROPERTY_NAME}=${action}`];
  } else {
    return ["", ""];
  }
}

export default function Page() {
  const [[quickSearchValue, quickSearchUrlParam], quickSearchDispatch] =
    useReducer<QuickSearchState, [string]>(quickSearchReducer, ["", ""]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    quickSearchDispatch(params.get(QUICK_SEARCH_URL_PROPERTY_NAME) ?? "");
  }, []);

  const handleSearchChange = useCallback<
    NonNullable<TextFieldProps["onChange"]>
  >((event) => {
    const value = event.target.value;
    quickSearchDispatch(value);
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
              placeholder="Quick add..."
              fullWidth
              name={QUICK_SEARCH_URL_PROPERTY_NAME}
              onChange={handleSearchChange}
              value={quickSearchValue}
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
