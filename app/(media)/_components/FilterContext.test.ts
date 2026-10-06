import { describe, test, expect } from "@jest/globals";
import {
  reducer,
  filterReducerInitialValue,
  FilterReducerValue,
} from "./FilterContext";
import { Status } from "@/models/Media";

describe("FilterContext reducer", () => {
  describe("reset action", () => {
    test("should reset state back to filterReducerInitialValue", () => {
      const currentState: FilterReducerValue = {
        text: "Star Wars",
        isReleased: true,
        status: Status.OWNED,
      };

      const nextState = reducer(currentState, { type: "reset" });

      expect(nextState).toEqual(filterReducerInitialValue);
    });
  });

  describe("filter action", () => {
    test("should update text while preserving isReleased and status", () => {
      const currentState: FilterReducerValue = {
        text: "",
        isReleased: false,
        status: Status.DOWNLOADABLE,
      };

      const nextState = reducer(currentState, {
        type: "filter",
        text: "Matrix",
      });

      expect(nextState).toEqual({
        text: "Matrix",
        isReleased: false,
        status: Status.DOWNLOADABLE,
      });
    });

    test("should update isReleased while preserving text and status", () => {
      const currentState: FilterReducerValue = {
        text: "Matrix",
        isReleased: null,
        status: Status.DEFAULT,
      };

      const nextState = reducer(currentState, {
        type: "filter",
        isReleased: true,
      });

      expect(nextState).toEqual({
        text: "Matrix",
        isReleased: true,
        status: Status.DEFAULT,
      });
    });

    test("should update status while preserving text and isReleased", () => {
      const currentState: FilterReducerValue = {
        text: "Matrix",
        isReleased: true,
        status: null,
      };

      const nextState = reducer(currentState, {
        type: "filter",
        status: Status.OWNED,
      });

      expect(nextState).toEqual({
        text: "Matrix",
        isReleased: true,
        status: Status.OWNED,
      });
    });

    test("should allow resetting isReleased and status to null when explicitly specified", () => {
      const currentState: FilterReducerValue = {
        text: "Matrix",
        isReleased: true,
        status: Status.OWNED,
      };

      const nextState = reducer(currentState, {
        type: "filter",
        isReleased: null,
        status: null,
      });

      expect(nextState).toEqual({
        text: "Matrix",
        isReleased: null,
        status: null,
      });
    });

    test("should update all filter fields simultaneously", () => {
      const nextState = reducer(filterReducerInitialValue, {
        type: "filter",
        text: "Alien",
        isReleased: true,
        status: Status.DEFAULT,
      });

      expect(nextState).toEqual({
        text: "Alien",
        isReleased: true,
        status: Status.DEFAULT,
      });
    });
  });

  describe("default / unknown action", () => {
    test("should throw an error when an unknown action type is provided", () => {
      expect(() => {
        reducer(filterReducerInitialValue, { type: "unknown" } as any);
      }).toThrow("Unknown action type");
    });
  });
});
