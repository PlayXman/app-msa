"use client";

import React, { useEffect, useState } from "react";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import Media from "@/models/Media";
import PageContent, {
  Props as PageContentProps,
} from "@/app/(media)/_components/PageContent";
import { config } from "@/models/utils/config";
import UrlHelpers from "@/models/utils/UrlHelpers";
import Game from "@/app/(media)/games/Game";
import GiantBomb from "@/models/services/GiantBomb";

const infoLinks: PageContentProps["infoLinks"] = [
  {
    variant: "games",
    url: config.vendors.gamesCz.searchUrl,
  },
  {
    variant: "gamespot",
    url: config.vendors.gamespotCom.searchUrl,
  },
  {
    variant: "steam",
    url: config.vendors.steampoweredCom.searchUrl,
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

  const giantBomb = new GiantBomb();
  return giantBomb.searchGames(searchText);
};

/**
 * Handle search item info open.
 */
const handleSearchItemClick: PageContentProps["onSearchItemClick"] = async (
  item,
) => {
  UrlHelpers.openNewTab(
    config.vendors.gamesCz.searchUrl + UrlHelpers.encodeText(item.title),
  );
};

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const { dispatchMedia } = useMediaContext();
  const notification = useNotificationDispatch();

  // Initial load from DB.
  useEffect(() => {
    (async () => {
      try {
        const itemsFromDB = await Media.fetchAll(Game);
        dispatchMedia({
          type: "load",
          mediaModel: Game,
          mediaItems: itemsFromDB,
        });
      } catch (e) {
        notification({
          type: "error",
          message: "Failed to load games",
          error: e,
        });
      }

      setIsLoading(false);
    })();
  }, [dispatchMedia, notification]);

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
