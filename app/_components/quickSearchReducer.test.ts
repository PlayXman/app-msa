import { describe, test, expect } from "@jest/globals";
import {
  quickSearchReducer,
  QuickSearchState,
  QUICK_SEARCH_URL_PROPERTY_NAME,
} from "./quickSearchReducer";

describe("quickSearchReducer", () => {
  const currentState: QuickSearchState = ["", ""];

  test("should return action and url parameter when action string is non-empty", () => {
    const nextState = quickSearchReducer(currentState, "Batman");

    expect(nextState).toEqual([
      "Batman",
      `?${QUICK_SEARCH_URL_PROPERTY_NAME}=Batman`,
    ]);
  });

  test("should return empty strings when action is an empty string", () => {
    const activeState: QuickSearchState = [
      "Batman",
      `?${QUICK_SEARCH_URL_PROPERTY_NAME}=Batman`,
    ];

    const nextState = quickSearchReducer(activeState, "");

    expect(nextState).toEqual(["", ""]);
  });
});
