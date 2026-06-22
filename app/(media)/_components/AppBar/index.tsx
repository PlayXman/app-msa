import React, { Suspense } from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Grid,
  SxProps,
  Theme,
} from "@mui/material";
import MediaListButton from "@/app/(media)/_components/AppBar/MediaListButton";
import { FilterContextProvider } from "@/app/(media)/_components/FilterContext";
import TextSearch from "@/app/(media)/_components/AppBar/TextSearch";
import Filter from "@/app/(media)/_components/AppBar/Filter";
import RefreshButton from "@/app/(media)/_components/AppBar/RefreshButton";
import EditBar from "@/app/(media)/_components/AppBar/EditBar";
import AddMediaButton, {
  Props as AddMediaButtonProps,
} from "@/app/(media)/_components/AppBar/AddMediaButton";
import { CONTAINER_MAX_WIDTH } from "@/app/(media)/_components/MediaGrid/MediaGrid";

const appBarSx: SxProps<Theme> = {
  borderRadius: `999px`,
  width: "auto",
  maxWidth: CONTAINER_MAX_WIDTH - 16,
  left: "2%",
  right: "2%",
  margin: "0 auto",
  background: `rgba(32, 32, 32, 0.9)`,
  outline: (theme) => `1px solid ${theme.palette.grey["800"]}`,
  outlineOffset: -1,
  top: (theme) => ({
    xs: "auto",
    sm: theme.spacing(1),
  }),
  bottom: (theme) => ({
    xs: theme.spacing(1),
    sm: "auto",
  }),
};
const toolbarSx: SxProps = {
  px: {
    xs: 1,
    sm: 2,
  },
};
const toolbarRowSx: SxProps = {
  justifyContent: "space-between",
  alignItems: "center",
  flexGrow: 1,
};
const toolbarRowLastItemSx: SxProps = {
  justifyContent: "flex-end",
};

export type Props = Pick<AddMediaButtonProps, "onSearch">;

export default function AppBar({ onSearch }: Props) {
  return (
    <>
      <MuiAppBar position="fixed" elevation={5} sx={appBarSx}>
        <Toolbar disableGutters sx={toolbarSx}>
          <FilterContextProvider>
            <Grid container sx={toolbarRowSx} wrap="nowrap" spacing={1}>
              <Grid container size={{ xs: "auto", sm: 3 }}>
                <Grid>
                  <MediaListButton />
                </Grid>
                <Grid>
                  <RefreshButton />
                </Grid>
              </Grid>
              <Grid size={{ xs: "grow", sm: 6 }}>
                <TextSearch />
              </Grid>
              <Grid
                container
                size={{ xs: "auto", sm: 3 }}
                wrap="nowrap"
                sx={toolbarRowLastItemSx}
              >
                <Grid>
                  <Filter />
                </Grid>
                <Grid>
                  <Suspense>
                    <AddMediaButton onSearch={onSearch} />
                  </Suspense>
                </Grid>
              </Grid>
            </Grid>
          </FilterContextProvider>
        </Toolbar>
      </MuiAppBar>
      <EditBar />
    </>
  );
}
