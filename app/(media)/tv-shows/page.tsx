"use client";

import React, { useCallback } from "react";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import { config } from "@/models/utils/config";
import Media from "@/models/Media";
import { Tmdb } from "@/models/services/Tmdb";
import UrlHelpers from "@/models/utils/UrlHelpers";
import TvShow from "@/app/(media)/tv-shows/TvShow";
import PageLayout, {
  Props as PageLayoutProps,
} from "@/app/(media)/_components/PageLayout";
import { MAIN_COLOR } from "@/app/(media)/tv-shows/color";

const infoLinks: PageLayoutProps["infoLinks"] = [
  {
    variant: "trakt",
    url: config.vendors.traktTv.tvShowSearchUrl,
  },
  {
    variant: "imdb",
    url: config.vendors.imdbCom.tvShowSearchUrl,
  },
  {
    variant: "csfd",
    url: config.vendors.csfdCz.tvShowSearchUrl,
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
  return tmdb.searchTvShows(searchText);
};

/**
 * Handle search item info open.
 */
const handleSearchItemClick: PageLayoutProps["onSearchItemClick"] = async (
  item,
) => {
  UrlHelpers.openNewTab(
    config.vendors.imdbCom.tvShowSearchUrl + UrlHelpers.encodeText(item.title),
  );
};

export default function Page() {
  const notification = useNotificationDispatch();

  const handleSyncWithTrakt: NonNullable<
    PageLayoutProps["onInitialMediaLoad"]
  > = useCallback(
    async (prevMediaItems) => {
      notification({
        type: "loading",
        message: "Syncing TV shows from Trakt...",
      });

      try {
        const tvShowController = new TvShow();
        await tvShowController.syncWithTrakt(prevMediaItems as TvShow[]);

        const nextItems = await Media.fetchAll(TvShow);
        notification({ type: "close" });

        return nextItems;
      } catch (error) {
        notification({
          type: "error",
          message: "Failed to sync TV shows from Trakt",
          error,
        });
      }

      return prevMediaItems;
    },
    [notification],
  );

  return (
    <PageLayout
      mediaModel={TvShow}
      infoLinks={infoLinks}
      onSearch={handleNewItemsSearch}
      onSearchItemClick={handleSearchItemClick}
      onInitialMediaLoad={handleSyncWithTrakt}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
