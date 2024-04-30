import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import Media, { Status } from "@/models/Media";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import { LinearProgress, SxProps, Theme } from "@mui/material";
import { func } from "prop-types";
import { PersistedCache } from "@/models/PersistedCache";

// Context

export type Model = (new (...args: any) => Media) | null;

export interface MediaContextItem {
  id: Media["id"];
  display: boolean;
  model: Media;
}

interface MediaContextValue {
  loading: boolean;
  model: Model;
  items: MediaContextItem[];
  selectedItems: Set<Media>;
  dispatchMedia: Dispatch<Parameters<typeof reducer>[1]>;
}

const MediaContext = createContext<MediaContextValue>({
  loading: true,
  model: null,
  items: [],
  selectedItems: new Set<Media>(),
  dispatchMedia: () => {},
});

export function useMediaContext() {
  return useContext(MediaContext);
}

// Provider

interface ReducerValue {
  loading: boolean;
  items: MediaContextItem[];
  selectedItems: Set<Media>;
}

function reducer(
  state: ReducerValue,
  action:
    | { type: "load"; mediaItems: Media[]; override?: boolean }
    | { type: "add"; item: MediaContextItem }
    | { type: "remove"; id: MediaContextItem["id"] }
    | { type: "update"; item: MediaContextItem }
    | { type: "filter"; text?: string; isReleased?: boolean; status?: Status }
    | { type: "toggleSelect"; item: Media | null },
): ReducerValue {
  switch (action.type) {
    case "load":
      return {
        loading: false,
        selectedItems: new Set(),
        items:
          !state.loading && !action.override
            ? state.items
            : action.mediaItems.map((item) => {
                return {
                  id: item.id,
                  display: true,
                  model: item,
                };
              }),
      };
    case "add":
      return {
        loading: state.loading,
        selectedItems: state.selectedItems,
        items: [action.item, ...state.items],
      };
    case "remove":
      return {
        loading: state.loading,
        selectedItems: state.selectedItems,
        items: state.items.filter((item) => item.id !== action.id),
      };
    case "update":
      return {
        loading: state.loading,
        selectedItems: state.selectedItems,
        items: state.items.map((item) => {
          if (item.id === action.item.id) {
            return {
              ...action.item,
              data: action.item.model.clone(),
            };
          }

          return item;
        }),
      };
    case "filter":
      return {
        loading: state.loading,
        selectedItems: state.selectedItems,
        items: state.items.map((item) => {
          let nextDisplay = item.model.display({
            text: action.text,
            isReleased: action.isReleased,
            status: action.status,
          });

          if (nextDisplay === item.display) {
            return item;
          }

          return {
            ...item,
            display: nextDisplay,
          };
        }),
      };
    case "toggleSelect":
      const nextSelectedItems = new Set(state.selectedItems);
      if (action.item == null) {
        nextSelectedItems.clear();
      } else if (nextSelectedItems.has(action.item)) {
        nextSelectedItems.delete(action.item);
      } else {
        nextSelectedItems.add(action.item);
      }

      return {
        loading: state.loading,
        selectedItems: nextSelectedItems,
        items: state.items,
      };
    default:
      throw new Error(`Unknown action type`);
  }
}

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
  const [data, dispatchMedia] = useReducer(reducer, {
    loading: true,
    items: [],
    selectedItems: new Set<Media>(),
  });
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
          valueBuffer={0}
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
