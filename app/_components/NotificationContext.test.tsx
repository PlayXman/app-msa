import React from "react";
import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import {
  reducer,
  initialNotification,
  NotificationContextState,
} from "./NotificationContext";

describe("NotificationContext reducer", () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("close action", () => {
    test("should set open to false while preserving other state properties", () => {
      const currentState: NotificationContextState = {
        open: true,
        message: "Active notification",
        autoHideDuration: 5000,
        action: <button>Undo</button>,
      };

      const nextState = reducer(currentState, { type: "close" });

      expect(nextState).toEqual({
        open: false,
        message: "Active notification",
        autoHideDuration: 5000,
        action: <button>Undo</button>,
      });
    });

    test("should remain open false when state was already closed", () => {
      const currentState: NotificationContextState = {
        open: false,
        message: "Closed notification",
        autoHideDuration: 2000,
      };

      const nextState = reducer(currentState, { type: "close" });

      expect(nextState.open).toBe(false);
      expect(nextState.message).toBe("Closed notification");
    });
  });

  describe("log action", () => {
    test("should open notification with default values from initialNotification", () => {
      const currentState: NotificationContextState = {
        open: false,
        message: "Previous message",
        autoHideDuration: 8000,
      };

      const nextState = reducer(currentState, { type: "log" });

      expect(nextState).toEqual({
        ...initialNotification,
        open: true,
      });
    });

    test("should open notification with provided message", () => {
      const nextState = reducer(initialNotification, {
        type: "log",
        message: "Item saved",
      });

      expect(nextState).toEqual({
        ...initialNotification,
        open: true,
        message: "Item saved",
      });
    });

    test("should override autoHideDuration, action, and children when provided in action payload", () => {
      const actionButton = <button>Retry</button>;
      const customChildren = <span>Custom child</span>;

      const nextState = reducer(initialNotification, {
        type: "log",
        message: "Custom notification",
        autoHideDuration: 10000,
        action: actionButton,
        children: customChildren,
      });

      expect(nextState).toEqual({
        open: true,
        autoHideDuration: 10000,
        message: "Custom notification",
        action: actionButton,
        children: customChildren,
      });
    });

    test("should reset any previous state properties back to initialNotification defaults", () => {
      const previousDirtyState: NotificationContextState = {
        open: true,
        autoHideDuration: 9999,
        message: "Old text",
        children: <div>Old child</div>,
        action: <button>Old action</button>,
      };

      const nextState = reducer(previousDirtyState, {
        type: "log",
        message: "New message",
      });

      expect(nextState.open).toBe(true);
      expect(nextState.message).toBe("New message");
      expect(nextState.autoHideDuration).toBe(2000);
      expect(nextState.children).toBeUndefined();
      expect(nextState.action).toBeUndefined();
    });
  });

  describe("error action", () => {
    test("should open error notification with 8000ms duration, null message, and Alert component containing message", () => {
      const nextState = reducer(initialNotification, {
        type: "error",
        message: "Something went wrong",
      });

      expect(nextState.open).toBe(true);
      expect(nextState.autoHideDuration).toBe(8000);
      expect(nextState.message).toBeNull();
      expect(React.isValidElement(nextState.children)).toBe(true);

      const alertElement = nextState.children as React.ReactElement<any>;
      expect(alertElement.props.severity).toBe("error");
      expect(alertElement.props.children).toBe("Something went wrong");
      expect(alertElement.props.sx).toEqual({ width: "100%" });
    });

    test("should log error to console.error when error object is provided", () => {
      const errorObj = new Error("Network timeout");

      reducer(initialNotification, {
        type: "error",
        message: "Failed to connect",
        error: errorObj,
      });

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(errorObj);
    });

    test("should not call console.error when error property is omitted", () => {
      reducer(initialNotification, {
        type: "error",
        message: "Validation failed",
      });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("loading action", () => {
    test("should open loading notification with null autoHideDuration and indeterminate progress when progress is omitted", () => {
      const nextState = reducer(initialNotification, {
        type: "loading",
        message: "Loading data...",
      });

      expect(nextState.open).toBe(true);
      expect(nextState.autoHideDuration).toBeNull();
      expect(React.isValidElement(nextState.message)).toBe(true);

      const stackElement = nextState.message as React.ReactElement<any>;
      const [circularProgress, textDiv] = React.Children.toArray(
        stackElement.props.children,
      ) as React.ReactElement<any>[];

      expect(circularProgress.props.variant).toBe("indeterminate");
      expect(circularProgress.props.value).toBe(0);
      expect(circularProgress.props.size).toBe(25);
      expect(textDiv.props.children).toBe("Loading data...");
    });

    test("should open loading notification with determinate progress and progress value when progress is specified", () => {
      const nextState = reducer(initialNotification, {
        type: "loading",
        message: "Uploading file...",
        progress: 65,
      });

      expect(nextState.open).toBe(true);
      expect(nextState.autoHideDuration).toBeNull();

      const stackElement = nextState.message as React.ReactElement<any>;
      const [circularProgress, textDiv] = React.Children.toArray(
        stackElement.props.children,
      ) as React.ReactElement<any>[];

      expect(circularProgress.props.variant).toBe("determinate");
      expect(circularProgress.props.value).toBe(65);
      expect(textDiv.props.children).toBe("Uploading file...");
    });

    test("should render determinate CircularProgress with value 0 when progress is 0", () => {
      const nextState = reducer(initialNotification, {
        type: "loading",
        message: "Starting upload...",
        progress: 0,
      });

      const stackElement = nextState.message as React.ReactElement<any>;
      const [circularProgress] = React.Children.toArray(
        stackElement.props.children,
      ) as React.ReactElement<any>[];

      expect(circularProgress.props.variant).toBe("determinate");
      expect(circularProgress.props.value).toBe(0);
    });
  });

  describe("default / unknown action", () => {
    test("should throw an error when an unknown action type is provided", () => {
      expect(() => {
        reducer(initialNotification, { type: "unsupported" } as any);
      }).toThrow("Unknown action type");
    });
  });
});
