"use client";

import React from "react";
import Book from "@/app/(media)/books/Book";
import GoogleBooks from "@/models/services/GoogleBooks";
import PageLayout, {
  Props as PageLayoutProps,
} from "@/app/(media)/_components/PageLayout";
import { MAIN_COLOR } from "@/app/(media)/books/color";

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

export default function Page() {
  return (
    <PageLayout
      mediaModel={Book}
      onSearch={handleNewItemsSearch}
      themeSecondaryColor={MAIN_COLOR}
    />
  );
}
