import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Model,
  toMediaList,
  useMediaContext,
} from "@/app/(media)/_components/MediaContext";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import Labels from "@/models/Labels";

// Context

interface LabelContextValue {
  labels: string[];
  update: (addLabels: string[], removeLabels: string[]) => Promise<void>;
  refresh: () => Promise<void>;
}

const LabelContext = createContext<LabelContextValue>({
  labels: [],
  update: async () => {},
  refresh: async () => {},
});

export function useLabelContext() {
  return useContext(LabelContext);
}

// Provider

/**
 * Holds and manages labels for the current media model.
 * @constructor
 */
export function LabelContextProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState(new Labels());
  const currentModel = useRef<Model>(null);

  const notification = useNotificationDispatch();
  const { model, items, loading: areItemsLoading } = useMediaContext();

  // Load labels
  useEffect(() => {
    (function () {
      if (areItemsLoading || model == null || model == currentModel.current) {
        return;
      }

      try {
        const labels = new Labels();
        labels.set(toMediaList(items));
        setLabels(labels);
        currentModel.current = model;
      } catch (error) {
        notification({
          type: "error",
          message: "Failed to load labels",
          error,
        });
      }
    })();
  }, [model, items, notification, areItemsLoading]);

  const handleUpdate = useCallback<LabelContextValue["update"]>(
    async (addLabels, removeLabels) => {
      try {
        const nextLabels = labels.clone();
        nextLabels.update({ add: addLabels, remove: removeLabels });
        setLabels(nextLabels);
      } catch (error) {
        notification({
          type: "error",
          message: "Failed to update label",
          error,
        });
      }
    },
    [labels, notification],
  );

  const handleRefresh = useCallback<LabelContextValue["refresh"]>(async () => {
    try {
      const nextLabels = labels.clone();
      nextLabels.set(toMediaList(items));
      setLabels(nextLabels);
    } catch (error) {
      notification({
        type: "error",
        message: "Failed to refresh labels",
        error,
      });
    }
  }, [items, labels, notification]);

  return (
    <LabelContext.Provider
      value={{
        labels: labels.toArray(),
        update: handleUpdate,
        refresh: handleRefresh,
      }}
    >
      {children}
    </LabelContext.Provider>
  );
}
