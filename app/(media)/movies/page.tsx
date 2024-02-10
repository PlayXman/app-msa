"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import Movie from "@/app/(media)/movies/Movie";
import PageContent, {
  Props as PageContentProps,
} from "@/app/(media)/_components/PageContent";
import { config } from "@/models/utils/config";
import Media from "@/models/Media";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import UrlHelpers from "@/models/utils/UrlHelpers";
import { Tmdb } from "@/models/services/Tmdb";
import ExtraActions from "@/app/(media)/movies/ExtraActions";

const infoLinks: PageContentProps["infoLinks"] = [
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
const handleNewItemsSearch: PageContentProps["onSearch"] = async (
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
const handleSearchItemClick: PageContentProps["onSearchItemClick"] = async (
  item,
) => {
  UrlHelpers.openNewTab(
    config.vendors.imdbCom.movieSearchUrl + UrlHelpers.encodeText(item.title),
  );
};

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [sync, setSync] = useState(false);
  const { items: mediaItems, dispatchMedia } = useMediaContext();
  const notification = useNotificationDispatch();

  /**
   * Generate extra actions for each item in the grid.
   */
  const createExtraActions = useCallback<
    NonNullable<PageContentProps["extraActions"]>
  >((model: Media) => {
    if (!(model instanceof Movie)) {
      return null;
    }
    const item = model as Movie;

    return <ExtraActions item={item} />;
  }, []);

  const loadFromDb = useCallback(async () => {
    const itemsFromDB = await Media.fetchAll(Movie);
    dispatchMedia({
      type: "load",
      mediaModel: Movie,
      mediaItems: itemsFromDB,
    });
  }, [dispatchMedia]);

  // INIT

  // Initial load from DB.
  useEffect(() => {
    (async () => {
      try {
        await loadFromDb();
      } catch (e) {
        notification({
          type: "error",
          message: "Failed to load movies",
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
        message: "Syncing movies from Trakt...",
      });

      (async () => {
        try {
          const movieController = new Movie();
          await movieController.syncWithTrakt(
            mediaItems.map((item) => item.model as Movie),
          );

          await loadFromDb();

          notification({ type: "close" });
        } catch (e) {
          notification({
            type: "error",
            message: "Failed to sync movies from Trakt",
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
      extraActions={createExtraActions}
      onSearch={handleNewItemsSearch}
      onSearchItemClick={handleSearchItemClick}
    />
  );
}
