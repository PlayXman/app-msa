import React from "react";
import {
  useScrollTrigger,
  AppBar as MuiAppBar,
  Toolbar,
  GridLegacy as Grid,
} from "@mui/material";
import SideMenu from "@/app/(media)/_components/AppBar/SideMenu";
import { FilterContextProvider } from "@/app/(media)/_components/FilterContext";
import TextSearch from "@/app/(media)/_components/AppBar/TextSearch";
import Filter from "@/app/(media)/_components/AppBar/Filter";
import RefreshButton from "@/app/(media)/_components/AppBar/RefreshButton";
import EditBar from "@/app/(media)/_components/AppBar/EditBar";

export default function AppBar() {
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
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            wrap="nowrap"
            spacing={1}
          >
            <Grid item xs="auto" sm={2}>
              <SideMenu />
            </Grid>
            <FilterContextProvider>
              <Grid item xs sm={4}>
                <TextSearch />
              </Grid>
              <Grid item xs="auto" sm={2}>
                <Grid
                  container
                  justifyContent="flex-end"
                  wrap="nowrap"
                  spacing={1}
                >
                  <Grid item>
                    <Filter />
                  </Grid>
                  <Grid item>
                    <RefreshButton />
                  </Grid>
                </Grid>
              </Grid>
            </FilterContextProvider>
          </Grid>
        </Toolbar>
      </MuiAppBar>
      <EditBar />
      <Toolbar />
    </>
  );
}
