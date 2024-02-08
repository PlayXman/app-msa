import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
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
 * @param children
 * @constructor
 */
export function LabelContextProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState(new Labels(""));

  const notification = useNotificationDispatch();
  const { model, items } = useMediaContext();

  // Load labels
  useEffect(() => {
    (async function () {
      if (model == null) {
        return;
      }

      try {
        const modelName = new (model as any)().modelName;
        const labels = new Labels(modelName);
        await labels.load();
        setLabels(labels);
      } catch (error) {
        notification({
          type: "error",
          message: "Failed to load labels",
          error,
        });
      }
    })();
  }, [model, notification]);

  const handleUpdate = useCallback<LabelContextValue["update"]>(
    async (addLabels, removeLabels) => {
      try {
        const nextLabels = labels.clone();
        await nextLabels.update({ add: addLabels, remove: removeLabels });
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
      await nextLabels.refresh(items.map((i) => i.model));
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
