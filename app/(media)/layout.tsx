"use client";

import { AppBar, Grid, Toolbar } from "@mui/material";
import React, { ReactNode } from "react";
import SideMenu from "@/app/(media)/_components/SideMenu";
import TextSearch from "@/app/(media)/_components/TextSearch";
import { MediaContextProvider } from "@/app/(media)/_components/MediaContext";
import { LabelContextProvider } from "@/app/(media)/_components/LabelContext";
import { FilterContextProvider } from "@/app/(media)/_components/FilterContext";
import Filter from "@/app/(media)/_components/Filter";
import RefreshButton from "@/app/(media)/_components/RefreshButton";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <MediaContextProvider>
      <LabelContextProvider>
        <AppBar elevation={3}>
          <Toolbar>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              wrap="nowrap"
            >
              <Grid item xs="auto" sm={2}>
                <SideMenu />
              </Grid>
              <FilterContextProvider>
                <Grid item xs sm={4}>
                  <TextSearch />
                </Grid>
                <Grid item xs="auto" sm={2}>
                  <Grid container justifyContent="flex-end" wrap="nowrap">
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
        </AppBar>
        <Toolbar />
        {children}
      </LabelContextProvider>
    </MediaContextProvider>
  );
}
