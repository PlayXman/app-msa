import { useEffect } from "react";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { PersistedCache } from "@/models/PersistedCache";

/**
 * Persist media items in cache on page leave/close.
 * @constructor
 */
export default function MediaCache() {
  const { model, items } = useMediaContext();

  useEffect(() => {
    async function persistItems() {
      if (!model) {
        return;
      }

      try {
        const cache = new PersistedCache(model);
        await cache.set(items.map((i) => i.model));
      } catch (error) {
        console.error("Failed to persist media items in cache", error);
      }
    }
    async function handleVisibilityChange() {
      if (document.hidden) {
        await persistItems();
      }
    }
    async function handlePageHide() {
      await persistItems();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [items, model]);

  return null;
}
