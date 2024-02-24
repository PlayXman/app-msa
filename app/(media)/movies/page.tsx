"use client";

import React, { useCallback } from "react";
import Movie from "@/app/(media)/movies/Movie";
import { config } from "@/models/utils/config";
import Media from "@/models/Media";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import UrlHelpers from "@/models/utils/UrlHelpers";
import { Tmdb } from "@/models/services/Tmdb";
import ExtraActions from "@/app/(media)/movies/ExtraActions";
import PageLayout, {
  Props as PageLayoutProps,
} from "@/app/(media)/_components/PageLayout";
import { MAIN_COLOR } from "@/app/(media)/movies/color";

const infoLinks: PageLayoutProps["infoLinks"] = [
  {
    variant: "trakt",
    url: config.vendors.traktTv.movieSearchUrl,
  },
  {
    variant: "imdb",
    url: config.vendors.imdbCom.movieSearchUrl,
  },
  {
    variant: "csfd",
    url: config.vendors.csfdCz.movieSearchUrl,
  },
];

/**
 * Search for new items.
 */
const handleNewItemsSearch: PageLayoutProps["onSearch"] = async (
  searchText,
) => {
  if (!searchText) {
    return [];
  }

  const tmdb = new Tmdb();
  return tmdb.searchMovies(searchText);
};

/**
 * Handle search item info open.
 */
const handleSearchItemClick: PageLayoutProps["onSearchItemClick"] = async (
  item,
) => {
  UrlHelpers.openNewTab(
    config.vendors.imdbCom.movieSearchUrl + UrlHelpers.encodeText(item.title),
  );
};

/**
 * Generate extra actions for each item in the grid.
 */
const createExtraActions: NonNullable<PageLayoutProps["extraActions"]> = (
  model: Media,
) => {
  if (!(model instanceof Movie)) {
    return null;
  }
  const item = model as Movie;

  return <ExtraActions item={item} />;
};

export default function Page() {
  const notification = useNotificationDispatch();

  const handleSyncWithTrakt: NonNullable<
    PageLayoutProps["onInitialMediaLoad"]
  > = useCallback(
    async (prevMediaItems) => {
      notification({
        type: "loading",
        message: "Syncing movies from Trakt...",
      });

      try {
        const movieController = new Movie();
        await movieController.syncWithTrakt(prevMediaItems as Movie[]);

        const nextItems = await Media.fetchAll(Movie);
        notification({ type: "close" });

        return nextItems;
      } catch (error) {
        notification({
          type: "error",
          message: "Failed to sync movies from Trakt",
          error,
        });
      }

      return prevMediaItems;
    },
    [notification],
  );

  return (
    <PageLayout
      mediaModel={Movie}
      infoLinks={infoLinks}
      extraActions={createExtraActions}
      onSearch={handleNewItemsSearch}
      onSearchItemClick={handleSearchItemClick}
      onInitialMediaLoad={handleSyncWithTrakt}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
