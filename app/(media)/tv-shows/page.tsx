"use client";

import React from "react";
import { Tmdb } from "@/models/services/Tmdb";
import TvShow from "@/app/(media)/tv-shows/TvShow";
import PageLayout, {
  Props as PageLayoutProps,
} from "@/app/(media)/_components/PageLayout";
import { MAIN_COLOR } from "@/app/(media)/tv-shows/color";

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

export default function Page() {
  return (
    <PageLayout
      mediaModel={TvShow}
      onSearch={handleNewItemsSearch}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
