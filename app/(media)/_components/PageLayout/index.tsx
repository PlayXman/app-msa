import React, { useCallback, useState } from "react";
import { LabelContextProvider } from "@/app/(media)/_components/LabelContext";
import { Grid, Toolbar } from "@mui/material";
import SideMenu from "@/app/(media)/_components/appBar/SideMenu";
import { FilterContextProvider } from "@/app/(media)/_components/FilterContext";
import TextSearch from "@/app/(media)/_components/appBar/TextSearch";
import Filter from "@/app/(media)/_components/appBar/Filter";
import RefreshButton from "@/app/(media)/_components/appBar/RefreshButton";
import {
  MediaContextProvider,
  Props as MediaContextProviderProps,
} from "@/app/(media)/_components/MediaContext";
import PageContent, {
  Props as PageContentProps,
} from "@/app/(media)/_components/PageContent";
import AppBar from "./AppBar";
import PageTheme from "@/app/(media)/_components/PageLayout/PageTheme";

export type Props = Omit<PageContentProps, "loading"> &
  Pick<MediaContextProviderProps, "mediaModel" | "onInitialMediaLoad"> & {
    themeSecondaryColor: string;
  };

export default function PageLayout({
  themeSecondaryColor,
  mediaModel,
  onInitialMediaLoad = async (p) => p,
  ...contentProps
}: Props) {
  const [isLoading, setIsLoading] = useState(true);

  const handleInitialMediaLoad = useCallback<
    NonNullable<MediaContextProviderProps["onInitialMediaLoad"]>
  >(
    (prevMediaItems) => {
      setIsLoading(false);
      return onInitialMediaLoad(prevMediaItems);
    },
    [onInitialMediaLoad],
  );

  return (
    <PageTheme secondaryColor={themeSecondaryColor}>
      <MediaContextProvider
        mediaModel={mediaModel}
        onInitialMediaLoad={handleInitialMediaLoad}
      >
        <LabelContextProvider>
          <AppBar>
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
          </AppBar>
          <Toolbar />

          <PageContent loading={isLoading} {...contentProps} />
        </LabelContextProvider>
      </MediaContextProvider>
    </PageTheme>
  );
}
