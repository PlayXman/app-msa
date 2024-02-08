"use client";

import React, { useCallback, useEffect, useState } from "react";
import PageContent, {
  Props as PageContentProps,
} from "@/app/(media)/_components/PageContent";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import { config } from "@/models/utils/config";
import Media from "@/models/Media";
import { Tmdb } from "@/models/services/Tmdb";
import UrlHelpers from "@/models/utils/UrlHelpers";
import TvShow from "@/app/(media)/tv-shows/TvShow";

const infoLinks: PageContentProps["infoLinks"] = [
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
const handleNewItemsSearch: PageContentProps["onSearch"] = async (
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
const handleSearchItemClick: PageContentProps["onSearchItemClick"] = async (
  item,
) => {
  UrlHelpers.openNewTab(
    config.vendors.imdbCom.tvShowSearchUrl + UrlHelpers.encodeText(item.title),
  );
};

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [sync, setSync] = useState(false);
  const { items: mediaItems, dispatchMedia } = useMediaContext();
  const notification = useNotificationDispatch();

  const loadFromDb = useCallback(async () => {
    const itemsFromDB = await Media.fetchAll(TvShow);
    dispatchMedia({
      type: "load",
      mediaModel: TvShow,
      mediaItems: itemsFromDB,
    });
  }, [dispatchMedia]);

  // Initial load from DB.
  useEffect(() => {
    (async () => {
      try {
        await loadFromDb();
      } catch (e) {
        notification({
          type: "error",
          message: "Failed to load TV shows",
          error: e,
        });
      }

      setIsLoading(false);
      setSync(true);
    })();
  }, [loadFromDb, notification]);

  // Sync with Trakt.
  useEffect(() => {
    if (sync) {
      setSync(false);

      notification({
        type: "loading",
        message: "Syncing TV shows from Trakt...",
      });

      (async () => {
        try {
          const tvShowController = new TvShow();
          await tvShowController.syncWithTrakt(
            mediaItems.map((item) => item.model as TvShow),
          );

          await loadFromDb();

          notification({ type: "close" });
        } catch (e) {
          notification({
            type: "error",
            message: "Failed to sync TV shows from Trakt",
            error: e,
          });
        }
      })();
    }
  }, [loadFromDb, mediaItems, notification, sync]);

  // RENDER

  return (
    <PageContent
      loading={isLoading}
      infoLinks={infoLinks}
      onSearch={handleNewItemsSearch}
      onSearchItemClick={handleSearchItemClick}
    />
  );
}
