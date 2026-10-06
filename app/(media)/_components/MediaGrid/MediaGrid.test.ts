import { describe, test, expect, jest } from "@jest/globals";

jest.mock("next/font/google", () => ({
  Roboto_Mono: () => ({
    className: "mock-roboto-mono",
    style: { fontFamily: "Roboto Mono" },
  }),
}));

import { menuReducer, MenuState } from "./MediaGrid";

describe("MediaGrid menuReducer", () => {
  describe("open action", () => {
    test("should open the menu and set selectedItemId", () => {
      const currentState: MenuState = {
        open: false,
        selectedItemId: "",
      };

      const nextState = menuReducer(currentState, {
        type: "open",
        itemId: "media-123",
      });

      expect(nextState).toEqual({
        open: true,
        selectedItemId: "media-123",
      });
    });

    test("should update selectedItemId if menu was already open", () => {
      const currentState: MenuState = {
        open: true,
        selectedItemId: "media-1",
      };

      const nextState = menuReducer(currentState, {
        type: "open",
        itemId: "media-2",
      });

      expect(nextState).toEqual({
        open: true,
        selectedItemId: "media-2",
      });
    });
  });

  describe("close action", () => {
    test("should set open to false while retaining selectedItemId", () => {
      const currentState: MenuState = {
        open: true,
        selectedItemId: "media-123",
      };

      const nextState = menuReducer(currentState, { type: "close" });

      expect(nextState).toEqual({
        open: false,
        selectedItemId: "media-123",
      });
    });

    test("should keep open false when menu is already closed", () => {
      const currentState: MenuState = {
        open: false,
        selectedItemId: "media-123",
      };

      const nextState = menuReducer(currentState, { type: "close" });

      expect(nextState).toEqual({
        open: false,
        selectedItemId: "media-123",
      });
    });
  });

  describe("default / unknown action", () => {
    test("should throw an error when an unknown action type is provided", () => {
      const currentState: MenuState = {
        open: false,
        selectedItemId: "",
      };

      expect(() => {
        menuReducer(currentState, { type: "unknown" } as any);
      }).toThrow("Unknown action type");
    });
  });
});
