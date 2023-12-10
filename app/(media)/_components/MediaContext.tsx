import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";
import Media, { Status } from "@/models/Media";

// Context

type Model = typeof Media | null;

interface MediaContextItem {
  id: Media["id"];
  display: boolean;
  model: Media;
}

interface MediaContextValue {
  model: Model;
  items: MediaContextItem[];
  dispatchMedia: Dispatch<Parameters<typeof reducer>[1]>;
}

const MediaContext = createContext<MediaContextValue>({
  model: null,
  items: [],
  dispatchMedia: () => {},
});

export function useMediaContext() {
  return useContext(MediaContext);
}

// Provider

interface ReducerValue {
  model: Model | null;
  items: MediaContextItem[];
}

function reducer(
  state: ReducerValue,
  action:
    | { type: "load"; mediaModel: NonNullable<Model>; mediaItems: Media[] }
    | { type: "add"; item: MediaContextItem }
    | { type: "remove"; id: MediaContextItem["id"] }
    | { type: "update"; item: MediaContextItem }
    | { type: "filter"; text?: string; isReleased?: boolean; status?: Status },
): ReducerValue {
  switch (action.type) {
    case "load":
      return {
        model: action.mediaModel,
        items: action.mediaItems.map((item) => {
          return {
            id: item.id,
            display: true,
            model: item,
          };
        }),
      };
    case "add":
      return {
        model: state.model,
        items: [action.item, ...state.items],
      };
    case "remove":
      return {
        model: state.model,
        items: state.items.filter((item) => item.id !== action.id),
      };
    case "update":
      return {
        model: state.model,
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
        model: state.model,
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
    default:
      throw new Error(`Unknown action type`);
  }
}

/**
 * Holds and manages Media item list.
 * @param children
 * @constructor
 */
export function MediaContextProvider({ children }: { children: ReactNode }) {
  const [data, dispatchMedia] = useReducer(reducer, {
    model: null,
    items: [],
  });

  return (
    <MediaContext.Provider
      value={{
        model: data.model,
        items: data.items,
        dispatchMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}
