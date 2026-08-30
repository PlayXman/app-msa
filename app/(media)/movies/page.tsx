"use client";

import React from "react";
import Movie from "@/app/(media)/movies/Movie";
import { Tmdb } from "@/models/services/Tmdb";
import PageLayout, {
  Props as PageLayoutProps,
} from "@/app/(media)/_components/PageLayout";
import { MAIN_COLOR } from "@/app/(media)/movies/color";

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

export default function Page() {
  return (
    <PageLayout
      mediaModel={Movie}
      onSearch={handleNewItemsSearch}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
