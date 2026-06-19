import React, { Suspense } from "react";
import {
  useScrollTrigger,
  AppBar as MuiAppBar,
  Toolbar,
  Grid,
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

export type Props = Pick<AddMediaButtonProps, "onSearch">;

export default function AppBar({ onSearch }: Props) {
  const windowObj = typeof window !== "undefined" ? window : undefined;
  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: windowObj,
  });

  return (
    <>
      <MuiAppBar
        elevation={scrollTrigger ? 1 : 0}
        sx={() => {
          return {
            backgroundColor: scrollTrigger ? "background.paper" : "transparent",
          };
        }}
      >
        <Toolbar>
          <FilterContextProvider>
            <Grid
              container
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                flexGrow: 1,
              }}
              wrap="nowrap"
              spacing={1}
            >
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
                sx={{
                  justifyContent: "flex-end",
                }}
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
      <Toolbar />
    </>
  );
}
