"use client";

import React from "react";
import { config } from "@/models/utils/config";
import UrlHelpers from "@/models/utils/UrlHelpers";
import Book from "@/app/(media)/books/Book";
import GoogleBooks from "@/models/services/GoogleBooks";
import PageLayout, {
  Props as PageLayoutProps,
} from "@/app/(media)/_components/PageLayout";
import { MAIN_COLOR } from "@/app/(media)/books/color";

const infoLinks: PageLayoutProps["infoLinks"] = [
  {
    variant: "googleBooks",
    url: (m) => config.vendors.googleBooks.infoUrl + m.id,
  },
  {
    variant: "amazon",
    url: config.vendors.amazonCom.searchUrl,
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

  const googleBooks = new GoogleBooks();
  return googleBooks.searchBooks(searchText);
};

/**
 * Handle search item info open.
 */
const handleSearchItemClick: PageLayoutProps["onSearchItemClick"] = async (
  item,
) => {
  UrlHelpers.openNewTab(config.vendors.googleBooks.infoUrl + item.id);
};

export default function Page() {
  return (
    <PageLayout
      mediaModel={Book}
      infoLinks={infoLinks}
      onSearch={handleNewItemsSearch}
      onSearchItemClick={handleSearchItemClick}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
