import Media from "@/models/Media";
import { createContext, Dispatch, useContext } from "react";
import { ReducerActions } from "@/app/(media)/_components/MediaContext/useContextData";

/** Media class */
export type Model = (new (...args: any) => Media) | null;

export interface MediaContextItem {
  /** DB ID. */
  id: Media["id"];
  /** Display in the list. */
  display: boolean;
  model: Media;
}

interface MediaContextValue {
  loading: boolean;
  model: Model;
  items: MediaContextItem[];
  selectedItems: Set<Media>;
  dispatchMedia: Dispatch<ReducerActions>;
}

export const MediaContext = createContext<MediaContextValue>({
  loading: true,
  model: null,
  items: [],
  selectedItems: new Set<Media>(),
  dispatchMedia: () => {},
});

export function useMediaContext() {
  return useContext(MediaContext);
}

/**
 * Converts MediaContextItem list to Media list.
 */
export function toMediaList(items: MediaContextItem[]): Media[] {
  return items.map((i) => i.model);
}
