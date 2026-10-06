import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Status } from "@/models/Media";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";

// Context

interface FilterContextValue {
  text: string;
  isReleased: boolean | null;
  status: Status | null;
  dispatchFilter: Dispatch<Parameters<typeof reducer>[1]>;
}

const FilterContext = createContext<FilterContextValue>({
  text: "",
  isReleased: null,
  status: null,
  dispatchFilter: () => {},
});

export function useFilterContext() {
  return useContext(FilterContext);
}

// Provider

export type FilterReducerValue = Omit<FilterContextValue, "dispatchFilter">;

export const filterReducerInitialValue: FilterReducerValue = {
  text: "",
  isReleased: null,
  status: null,
};

export type FilterAction =
  | { type: "reset" }
  | {
      type: "filter";
      text?: string;
      isReleased?: boolean | null;
      status?: Status | null;
    };

export function reducer(
  state: FilterReducerValue,
  action: FilterAction,
): FilterReducerValue {
  switch (action.type) {
    case "reset":
      return { ...filterReducerInitialValue };
    case "filter":
      return {
        text: action.text ?? state.text,
        isReleased:
          action.isReleased === undefined
            ? state.isReleased
            : action.isReleased,
        status: action.status === undefined ? state.status : action.status,
      };
    default:
      throw new Error(`Unknown action type`);
  }
}

/**
 * Holds and manages media item filters for the current media model.
 * @constructor
 */
export function FilterContextProvider({ children }: { children: ReactNode }) {
  const [data, dispatch] = useReducer(reducer, filterReducerInitialValue);
  const { model } = useMediaContext();

  // Reset filters when model changes.
  useEffect(() => {
    if (model) {
      dispatch({ type: "reset" });
    }
  }, [model]);

  return (
    <FilterContext.Provider
      value={{
        ...data,
        dispatchFilter: dispatch,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
