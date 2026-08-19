import { ReactNode, useCallback, useEffect, useState } from "react";
import Media from "@/models/Media";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import { LinearProgress, SxProps, Theme } from "@mui/material";
import { PersistedCache } from "@/models/PersistedCache";
import { useContextData } from "@/app/(media)/_components/MediaContext/useContextData";
import {
  MediaContext,
  Model,
} from "@/app/(media)/_components/MediaContext/context";

// Context
export { useMediaContext } from "@/app/(media)/_components/MediaContext/context";

// Provider

const progressSx: SxProps<Theme> = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: (theme) => theme.zIndex.snackbar,
};

export interface Props {
  mediaModel: NonNullable<Model>;
  children: ReactNode;
}

/**
 * Holds and manages Media item list.
 * @constructor
 */
export function MediaContextProvider({ mediaModel, children }: Props) {
  const [initialLoadingProgress, setInitialLoadingProgress] = useState(0);
  const [data, dispatchMedia] = useContextData();
  const notification = useNotificationDispatch();

  // Initial load. Fetch items from cache, database and external sources.

  const fetchItemsFromCache = useCallback(async () => {
    console.log("Fetch media from cache");
    try {
      const cache = new PersistedCache(mediaModel);
      const mediaItems = await cache.get();

      dispatchMedia({
        type: "load",
        mediaItems,
        override: false,
      });
    } catch (e) {
      console.error("Failed to fetch media from cache", e);
    }

    setInitialLoadingProgress((p) => p + 33);
  }, [mediaModel]);

  const fetchItemsFromDatabase = useCallback(async () => {
    console.log("Fetch media from database");
    try {
      const mediaItems = await Media.fetchAll(mediaModel);
      dispatchMedia({
        type: "load",
        mediaItems,
        override: true,
      });
      setInitialLoadingProgress((p) => p + 33);

      return mediaItems;
    } catch (error) {
      throw {
        message: "Failed to load items from database",
        error,
      };
    }
  }, [mediaModel]);

  const fetchItemsFromExternalSource = useCallback(async () => {
    console.log("Fetch media from external source");
    try {
      const mediaController = new mediaModel();
      return await mediaController.fetchItemsFromExternalSource();
    } catch (error) {
      throw {
        message: "Failed to load items from external source",
        error,
      };
    }
  }, [mediaModel]);

  useEffect(() => {
    (async () => {
      try {
        setInitialLoadingProgress(0);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, previousItems, externalSourceItems] = await Promise.all([
          fetchItemsFromCache(),
          fetchItemsFromDatabase(),
          fetchItemsFromExternalSource(),
        ]);

        // Merge external source items with current, if applicable.
        if (externalSourceItems != null) {
          notification({
            type: "loading",
            message: "Syncing with external source...",
          });

          const prevItemsMap = new Map(
            previousItems.map((item) => [item.id, item]),
          );
          const newItems: Media[] = [];
          for (const externalSourceItem of externalSourceItems) {
            if (prevItemsMap.has(externalSourceItem.id)) {
              prevItemsMap.delete(externalSourceItem.id);
            } else {
              newItems.push(externalSourceItem);
            }
          }

          // Add missing item into DB.
          if (newItems.length > 0) {
            await newItems[0].refresh(newItems);
            await Promise.all(newItems.map((item) => item.save()));
          }

          // Delete items that are not in external source.
          for (const item of prevItemsMap.values()) {
            await item.delete();
          }

          // Fetch updated list from DB.
          if (prevItemsMap.size > 0 || newItems.length > 0) {
            dispatchMedia({
              type: "load",
              mediaItems: await Media.fetchAll(mediaModel),
              override: true,
            });
          }

          notification({ type: "close" });
        }
      } catch (err: any) {
        let message = "Failed to load items";
        let error = err;

        if ("message" in err && "error" in err) {
          message = err.message;
          error = err.error;
        }

        notification({
          type: "error",
          message,
          error,
        });
      } finally {
        setInitialLoadingProgress(100);
      }
    })();
  }, [
    fetchItemsFromCache,
    fetchItemsFromDatabase,
    fetchItemsFromExternalSource,
    mediaModel,
    notification,
  ]);

  return (
    <>
      {initialLoadingProgress < 100 && (
        <LinearProgress
          variant="buffer"
          valueBuffer={initialLoadingProgress}
          value={initialLoadingProgress}
          sx={progressSx}
        />
      )}
      <MediaContext.Provider
        value={{
          loading: data.loading,
          model: mediaModel,
          items: data.items,
          selectedItems: data.selectedItems,
          dispatchMedia,
        }}
      >
        {children}
      </MediaContext.Provider>
    </>
  );
}
