"use client";

import React from "react";
import Media from "@/models/Media";
import Game from "@/app/(media)/games/Game";
import ExtraActions from "@/app/(media)/games/ExtraActions";
import PageLayout, {
  Props as PageLayoutProps,
} from "@/app/(media)/_components/PageLayout";
import { MAIN_COLOR } from "@/app/(media)/games/color";
import GameCloudFunctions from "@/models/services/GameCloudFunctions";

/**
 * Search for new items.
 */
const handleNewItemsSearch: PageLayoutProps["onSearch"] = async (
  searchText,
) => {
  if (!searchText) {
    return [];
  }

  const gameDataProvider = new GameCloudFunctions();
  return gameDataProvider.searchGames(searchText);
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
      extraActions={createExtraActions}
      onSearch={handleNewItemsSearch}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
