export const QUICK_SEARCH_URL_PROPERTY_NAME = "search-new-q";

/** Quick search value - quick search url param tuple */
export type QuickSearchState = [string, string];

export function quickSearchReducer(
  _: QuickSearchState,
  action: string,
): QuickSearchState {
  if (action) {
    return [action, `?${QUICK_SEARCH_URL_PROPERTY_NAME}=${action}`];
  } else {
    return ["", ""];
  }
}
