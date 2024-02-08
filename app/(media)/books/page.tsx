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
import Book from "@/app/(media)/books/Book";
import GoogleBooks from "@/models/services/GoogleBooks";

const infoLinks: PageContentProps["infoLinks"] = [
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
const handleNewItemsSearch: PageContentProps["onSearch"] = async (
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
const handleSearchItemClick: PageContentProps["onSearchItemClick"] = async (
  item,
) => {
  UrlHelpers.openNewTab(config.vendors.googleBooks.infoUrl + item.id);
};

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const { dispatchMedia } = useMediaContext();
  const notification = useNotificationDispatch();

  // Initial load from DB.
  useEffect(() => {
    (async () => {
      try {
        const itemsFromDB = await Media.fetchAll(Book);
        dispatchMedia({
          type: "load",
          mediaModel: Book,
          mediaItems: itemsFromDB,
        });
      } catch (e) {
        notification({
          type: "error",
          message: "Failed to load books",
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
