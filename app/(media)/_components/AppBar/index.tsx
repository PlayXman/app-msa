import React, { Suspense } from "react";
import { AppBar as MuiAppBar, Toolbar, Grid, SxProps } from "@mui/material";
import MediaListButton from "@/app/(media)/_components/AppBar/MediaListButton";
import { FilterContextProvider } from "@/app/(media)/_components/FilterContext";
import TextSearch from "@/app/(media)/_components/AppBar/TextSearch";
import Filter from "@/app/(media)/_components/AppBar/Filter";
import RefreshButton from "@/app/(media)/_components/AppBar/RefreshButton";
import EditBar from "@/app/(media)/_components/AppBar/EditBar";
import AddMediaButton, {
  Props as AddMediaButtonProps,
} from "@/app/(media)/_components/AppBar/AddMediaButton";

const appBarSx: SxProps = {
  top: {
    xs: "auto",
    sm: 0,
  },
  bottom: {
    xs: 0,
    sm: "auto",
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
      <MuiAppBar position="fixed" elevation={0} sx={appBarSx}>
        <Toolbar>
          <FilterContextProvider>
            <Grid container sx={toolbarRowSx} wrap="nowrap" spacing={1}>
              <Grid container size={{ xs: "auto", sm: 2 }}>
                <Grid>
                  <MediaListButton />
                </Grid>
                <Grid>
                  <RefreshButton />
                </Grid>
              </Grid>
              <Grid size={{ xs: "grow", sm: 4 }}>
                <TextSearch />
              </Grid>
              <Grid
                container
                size={{ xs: "auto", sm: 2 }}
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
