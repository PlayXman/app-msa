import React, { useCallback, useState } from "react";
import IconButton from "@/components/IconButton";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import Button from "@/components/Button";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { useLabelContext } from "@/app/(media)/_components/LabelContext";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";

export default function DeleteButton() {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { selectedItems, dispatchMedia } = useMediaContext();
  const { update: updateLabels } = useLabelContext();
  const notification = useNotificationDispatch();

  const handleOpen = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleDelete = useCallback(async () => {
    setDeleting(true);

    try {
      await Promise.all(
        [...selectedItems].map(async (model) => {
          await model.delete();
          await updateLabels([], model.labels);
          dispatchMedia({
            type: "remove",
            id: model.id,
          });
        }),
      );
    } catch (e) {
      notification({ type: "error", message: "Failed to delete", error: e });
    }

    dispatchMedia({ type: "toggleSelect", item: null });

    setDeleting(false);
    setOpenDialog(false);
  }, [dispatchMedia, notification, selectedItems, updateLabels]);

  return (
    <>
      <IconButton
        label="Delete"
        color="inherit"
        edge="end"
        onClick={handleOpen}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>
          Delete {selectedItems.size}{" "}
          {selectedItems.size > 1 ? "items" : "item"}?
        </DialogTitle>
        <DialogActions>
          <Button color="inherit" variant="text" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            loading={deleting}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
