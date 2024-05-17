import React, { useCallback, useMemo, useState } from "react";
import IconButton from "@/components/IconButton";
import { Label as LabelIcon } from "@mui/icons-material";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import MediaGridItemMenuLabelsDialog, {
  Props as MediaGridItemMenuLabelsDialogProps,
} from "@/app/(media)/_components/MediaGrid/labels/MediaGridItemMenuLabelsDialog";

export default function LabelButton() {
  const [openDialog, setOpenDialog] = useState(false);
  const { selectedItems, dispatchMedia } = useMediaContext();
  const notification = useNotificationDispatch();

  const handleOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleLabelsUpdate = useCallback<
    MediaGridItemMenuLabelsDialogProps["onLabelsUpdate"]
  >(
    async (updatedModels) => {
      try {
        await Promise.all(
          updatedModels.map(async (model) => {
            await model.save();
            dispatchMedia({
              type: "update",
              item: {
                model: model,
                display: true,
                id: model.id,
              },
            });
          }),
        );
        dispatchMedia({ type: "toggleSelect", item: null });
        notification({ type: "log", message: "Labels updated" });
      } catch (e) {
        notification({
          type: "error",
          message: "Failed to update labels",
          error: e,
        });
      }
    },
    [dispatchMedia, notification],
  );

  const selectedItemsArray = useMemo(() => {
    return [...selectedItems];
  }, [selectedItems]);

  return (
    <>
      <IconButton label="Labels" color="inherit" onClick={handleOpen}>
        <LabelIcon />
      </IconButton>
      <MediaGridItemMenuLabelsDialog
        onClose={handleClose}
        open={openDialog}
        models={selectedItemsArray}
        onLabelsUpdate={handleLabelsUpdate}
      />
    </>
  );
}
