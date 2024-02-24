"use client";

import React from "react";
import Media from "@/models/Media";
import { config } from "@/models/utils/config";
import UrlHelpers from "@/models/utils/UrlHelpers";
import Game from "@/app/(media)/games/Game";
import GiantBomb from "@/models/services/GiantBomb";
import ExtraActions from "@/app/(media)/games/ExtraActions";
import PageLayout, {
  Props as PageLayoutProps,
} from "@/app/(media)/_components/PageLayout";
import { MAIN_COLOR } from "@/app/(media)/games/color";

const infoLinks: PageLayoutProps["infoLinks"] = [
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
const handleNewItemsSearch: PageLayoutProps["onSearch"] = async (
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
const handleSearchItemClick: PageLayoutProps["onSearchItemClick"] = async (
  item,
) => {
  UrlHelpers.openNewTab(
    config.vendors.gamesCz.searchUrl + UrlHelpers.encodeText(item.title),
  );
};

/**
 * Generate extra actions for each item in the grid.
 */
const createExtraActions: NonNullable<PageLayoutProps["extraActions"]> = (
  model: Media,
) => {
  return <ExtraActions item={model} />;
};

export default function Page() {
  return (
    <PageLayout
      mediaModel={Game}
      infoLinks={infoLinks}
      extraActions={createExtraActions}
      onSearch={handleNewItemsSearch}
      onSearchItemClick={handleSearchItemClick}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
