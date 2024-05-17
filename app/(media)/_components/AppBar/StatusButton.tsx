import React, { useCallback, useMemo, useState } from "react";
import IconButton from "@/components/IconButton";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import { Bookmark as BookmarkIcon } from "@mui/icons-material";
import { Status } from "@/models/Media";

export default function StatusButton() {
  const { selectedItems, dispatchMedia } = useMediaContext();
  const notification = useNotificationDispatch();

  const status = useMemo(() => {
    const selectedItemsArray = Array.from(selectedItems);

    if (
      selectedItemsArray.length > 0 &&
      selectedItemsArray.every(
        (item) => item.status === selectedItemsArray[0].status,
      )
    ) {
      return selectedItemsArray[0].status;
    }

    return "MIXED";
  }, [selectedItems]);
  const displayStatus = useMemo(() => {
    switch (status) {
      case "DOWNLOADABLE":
        return "Downloadable";
      case "OWNED":
        return "Owned";
      case "DEFAULT":
        return "Not owned";
      default:
        return "Mixed";
    }
  }, [status]);

  const handleStatusChange = useCallback(async () => {
    try {
      let nextStatus: Status;
      switch (status) {
        case Status.DEFAULT:
          nextStatus = Status.DOWNLOADABLE;
          break;
        case Status.DOWNLOADABLE:
          nextStatus = Status.OWNED;
          break;
        case Status.OWNED:
        default:
          nextStatus = Status.DEFAULT;
          break;
      }

      await Promise.all(
        [...selectedItems].map(async (model) => {
          const nextModel = model.clone();
          nextModel.status = nextStatus;
          await nextModel.save();
          dispatchMedia({
            type: "update",
            item: {
              model: nextModel,
              display: true,
              id: nextModel.id,
            },
          });
          dispatchMedia({ type: "toggleSelect", item: model });
          dispatchMedia({ type: "toggleSelect", item: nextModel });
        }),
      );
    } catch (error) {
      notification({
        type: "error",
        message: "Failed to update status",
        error,
      });
    }
  }, [dispatchMedia, notification, selectedItems, status]);

  return (
    <IconButton
      color="inherit"
      label={displayStatus}
      onClick={handleStatusChange}
    >
      <BookmarkIcon />
    </IconButton>
  );
}
