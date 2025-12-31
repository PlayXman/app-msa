"use client";

import React from "react";
import Movie from "@/app/(media)/movies/Movie";
import Media from "@/models/Media";
import { Tmdb } from "@/models/services/Tmdb";
import ExtraActions from "@/app/(media)/movies/ExtraActions";
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

/**
 * Generate extra actions for each item in the grid.
 */
const createExtraActions: NonNullable<PageLayoutProps["extraActions"]> = (
  model: Media<any>,
) => {
  if (!(model instanceof Movie)) {
    return null;
  }
  const item = model as Movie;

  return <ExtraActions item={item} />;
};

export default function Page() {
  return (
    <PageLayout
      mediaModel={Movie}
      extraActions={createExtraActions}
      onSearch={handleNewItemsSearch}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
