import Media, { Status } from "@/models/Media";
import { MediaContextItem } from "@/app/(media)/_components/MediaContext/context";
import { ActionDispatch, useReducer } from "react";

interface ReducerValue {
  loading: boolean;
  items: MediaContextItem[];
  selectedItems: Set<Media>;
}

export type ReducerActions =
  | { type: "load"; mediaItems: Media[]; override?: boolean }
  | { type: "add"; item: MediaContextItem }
  | { type: "remove"; id: MediaContextItem["id"] }
  | { type: "update"; item: MediaContextItem }
  | { type: "filter"; text?: string; isReleased?: boolean; status?: Status }
  | { type: "toggleSelect"; item: Media | null };

function reducer(state: ReducerValue, action: ReducerActions): ReducerValue {
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
          const nextDisplay = item.model.display({
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

const initialState: ReducerValue = {
  loading: true,
  items: [],
  selectedItems: new Set<Media>(),
};

export function useContextData(): [
  ReducerValue,
  ActionDispatch<[action: ReducerActions]>,
] {
  return useReducer(reducer, initialState);
}
