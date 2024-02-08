"use client";

import {
  Alert,
  CircularProgress,
  Slide,
  SlideProps,
  Snackbar,
  SnackbarProps,
  Stack,
} from "@mui/material";
import {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useReducer,
} from "react";

// Context

type NotificationContextState = Pick<
  SnackbarProps,
  "open" | "message" | "autoHideDuration" | "children" | "action"
>;

const NotificationContext = createContext<
  Dispatch<Parameters<typeof reducer>[1]>
>(() => {});

export function useNotificationDispatch() {
  return useContext(NotificationContext);
}

// Provider

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const initialNotification: NotificationContextState = {
  open: false,
  autoHideDuration: 2000,
  message: "",
};

function reducer(
  state: NotificationContextState,
  action:
    | { type: "close" }
    | { type: "error"; message: string; error?: Error | unknown }
    | { type: "loading"; message: string; progress?: number }
    | ({ type: "log" } & Partial<Omit<NotificationContextState, "open">>),
): NotificationContextState {
  switch (action.type) {
    case "close":
      return {
        ...state,
        open: false,
      };
    case "log":
      const { type, ...rest } = action;
      return {
        ...initialNotification,
        open: true,
        ...rest,
      };
    case "error":
      if (action.error) {
        console.error(action.error);
      }
      return {
        ...initialNotification,
        open: true,
        message: null,
        autoHideDuration: 8000,
        children: (
          <Alert severity="error" sx={{ width: "100%" }}>
            {action.message}
          </Alert>
        ),
      };
    case "loading":
      const loadingVariant =
        action.progress == null ? "indeterminate" : "determinate";
      const loadingValue = action.progress ?? 0;

      return {
        ...initialNotification,
        open: true,
        autoHideDuration: null,
        message: (
          <Stack spacing={2} direction="row" alignItems="center">
            <CircularProgress
              size={25}
              variant={loadingVariant}
              value={loadingValue}
            />
            <div>{action.message}</div>
          </Stack>
        ),
      };
    default:
      throw new Error(`Unknown action type`);
  }
}

/**
 * Displays notification/snackbar messages.
 * @param children
 * @constructor
 */
export function NotificationContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notification, dispatch] = useReducer(reducer, initialNotification);

  const handleClose = useCallback((_: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch({ type: "close" });
  }, []);

  return (
    <NotificationContext.Provider value={dispatch}>
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={handleClose}
        message={notification.message}
        action={notification.action}
        TransitionComponent={SlideTransition}
      >
        {notification.children}
      </Snackbar>
    </NotificationContext.Provider>
  );
}
