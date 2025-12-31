import React, { useCallback, useEffect, useState } from "react";
import IconButton from "@/components/IconButton";
import { Sync as SyncIcon } from "@mui/icons-material";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { splitIntoChunks } from "@/models/utils/list";
import { useLabelContext } from "@/app/(media)/_components/LabelContext";
import Media from "@/models/Media";
import { SxProps, Theme } from "@mui/material";

const buttonSx: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.grey["800"],
};

export default function RefreshButton() {
  const [disabled, setDisabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const notification = useNotificationDispatch();
  const {
    items: mediaItems,
    model: mediaModel,
    dispatchMedia,
  } = useMediaContext();
  const { refresh: refreshLabels } = useLabelContext();

  // Display notification when refreshing items.
  useEffect(() => {
    if (disabled) {
      notification({
        type: "loading",
        message: "Refreshing items...",
        progress,
      });
    } else {
      notification({ type: "close" });
    }
  }, [notification, disabled, progress]);

  // Refresh labels.
  useEffect(() => {
    if (!disabled && progress >= 100) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(0);
      notification({ type: "loading", message: "Refreshing labels..." });
      refreshLabels()
        .then(() => {
          notification({ type: "close" });
        })
        .catch((error) => {
          notification({
            type: "error",
            message: "Failed to refresh labels",
            error,
          });
        });
    }
  }, [disabled, notification, progress, refreshLabels]);

  const handleClick = useCallback(async () => {
    const itemCount = mediaItems.length;

    if (itemCount === 0 || mediaModel == null) {
      return;
    }

    setProgress(0);
    setDisabled(true);

    const modelController = new (mediaModel as any)();
    const concurrencyLimit = modelController.batchOperationConcurrencyLimit;
    const chunks = splitIntoChunks(mediaItems, concurrencyLimit);
    const nextMediaItems: Media<any>[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const items = chunk.map((item) => item.model);
      // Fetch and update all items in the chunk.
      await modelController.refresh(items);

      nextMediaItems.push(
        ...(await Promise.all(
          items.map(async (item) => {
            try {
              await item.save();
            } catch (e) {
              console.error(`Failed to save refreshed ${item.id}`, e);
            }
            return item.clone();
          }),
        )),
      );

      // Update progress.
      setProgress(
        Math.min(
          Math.round((((i + 1) * concurrencyLimit) / itemCount) * 100),
          100,
        ),
      );
    }

    dispatchMedia({
      type: "load",
      mediaItems: nextMediaItems,
      override: true,
    });

    // Close snackbar.
    await new Promise((r) => {
      setTimeout(r, 500);
    });
    setDisabled(false);
  }, [dispatchMedia, mediaItems, mediaModel]);

  return (
    <IconButton
      label="Refresh items"
      color="inherit"
      onClick={handleClick}
      disabled={disabled}
      edge="end"
      sx={buttonSx}
    >
      <SyncIcon color="inherit" />
    </IconButton>
  );
}
