import React from "react";
import { PlaylistAddCheck as PlaylistAddCheckIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import MediaGridItemMenuItem from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuItem";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { useLabelContext } from "@/app/(media)/_components/LabelContext";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import Movie from "@/app/(media)/movies/Movie";

export default function ExtraActions({ item }: { item: Movie }) {
  const { dispatchMedia } = useMediaContext();
  const { update: updateLabels } = useLabelContext();
  const notification = useNotificationDispatch();

  const handleMarkAsWatched = async () => {
    try {
      await item.markAsWatched();
      await item.delete();
      await updateLabels([], item.labels);
      dispatchMedia({
        type: "remove",
        id: item.id,
      });

      notification({
        type: "log",
        message: "Marked as watched",
        autoHideDuration: 15000,
        action: (
          <Button color="secondary" size="small" onClick={handleUndoAction}>
            UNDO
          </Button>
        ),
      });
    } catch (error) {
      notification({
        type: "error",
        message: "Failed to mark as watched",
        error,
      });
    }
  };

  const handleUndoAction = async () => {
    try {
      await item.addToWatchlist();
      await item.save();
      await updateLabels(item.labels, []);
      dispatchMedia({
        type: "add",
        item: {
          id: item.id,
          display: true,
          model: item,
        },
      });
      notification({ type: "close" });
    } catch (error) {
      notification({
        type: "error",
        message: `Failed to undo mark as watched the movie ${item.title}`,
        error,
      });
    }
  };

  return (
    <MediaGridItemMenuItem
      label="Mark as watched"
      icon={<PlaylistAddCheckIcon />}
      onClick={handleMarkAsWatched}
    />
  );
}
