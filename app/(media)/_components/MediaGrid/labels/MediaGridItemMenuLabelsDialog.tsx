import React, {
  ChangeEvent,
  SubmitEventHandler,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import { useLabelContext } from "@/app/(media)/_components/LabelContext";
import Button from "@/components/Button";
import Labels from "@/models/Labels";
import Media from "@/models/Media";
import { SPECIAL_LABELS } from "@/app/(media)/_components/MediaGrid/labels/specialLabels";

export interface Props {
  onClose: () => void;
  open: boolean;
  mediaItems: Media[];
  /**
   * @param updatedModels Media copies with updated labels.
   */
  onLabelsUpdate: (updatedModels: Media[]) => Promise<void>;
}

export default function MediaGridItemMenuLabelsDialog({
  onClose,
  open,
  mediaItems,
  onLabelsUpdate,
}: Props) {
  /** Label-selected on all pair. */
  const [initialLabels, setInitialLabels] = useState<Map<string, number>>(
    new Map(),
  );
  /** Label-selected on all pair. */
  const [nextLabels, setNextLabels] = useState<Map<string, number>>(new Map());
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const mediaItemCount = mediaItems.length;
  const { labels: allAvailableLabels, update: updateAvailableLabels } =
    useLabelContext();

  // Reset on open.

  useEffect(() => {
    if (open) {
      const labelCounts = new Map<string, number>(
        allAvailableLabels.map((l) => [l, 0]),
      );
      for (const item of mediaItems) {
        for (const label of item.labels) {
          labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
        }
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialLabels(new Map(labelCounts));
      setNextLabels(labelCounts);
      setNewLabel("");
    }
  }, [allAvailableLabels, mediaItems, open]);

  // HANDLERS

  const handleNewLabelChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setNewLabel(event.target.value);
    },
    [],
  );

  const handleLabelToggle = useCallback(
    (label: string) => {
      setNextLabels((prevLabels) => {
        const count = prevLabels.get(label) ?? 0;
        prevLabels.set(label, count === mediaItemCount ? 0 : mediaItemCount);
        return new Map(prevLabels);
      });
    },
    [mediaItemCount],
  );

  const handleLabelAdd = useCallback<SubmitEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();

      if (!newLabel) {
        return;
      }

      const label = Labels.createNewLabel(newLabel);
      handleLabelToggle(label);
      setNewLabel("");
    },
    [handleLabelToggle, newLabel],
  );

  const handleUpdate = useCallback(async () => {
    setLoading(true);

    const add: string[] = [];
    const remove: string[] = [];
    const availableLabelUpdates: [string, number][] = [];
    for (const [label, count] of nextLabels.entries()) {
      const initialCount = initialLabels.get(label) ?? 0;

      if (count > initialCount) {
        add.push(label);
      } else if (count < initialCount) {
        remove.push(label);
      }

      availableLabelUpdates.push([label, count - initialCount]);
    }
    const nextModels = mediaItems.map((model) => {
      const nextModel = model.clone();
      nextModel.labels = Array.from(new Set([...model.labels, ...add])).filter(
        (l) => !remove.includes(l),
      );
      return nextModel;
    });

    await onLabelsUpdate(nextModels);
    await updateAvailableLabels(availableLabelUpdates);

    setLoading(false);
    onClose();
  }, [
    initialLabels,
    mediaItems,
    nextLabels,
    onClose,
    onLabelsUpdate,
    updateAvailableLabels,
  ]);

  // RENDER

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Edit labels</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <form onSubmit={handleLabelAdd}>
              <TextField
                margin="dense"
                label="New label"
                type="text"
                fullWidth
                variant="outlined"
                disabled={loading}
                value={newLabel}
                onChange={handleNewLabelChange}
              />
            </form>
          </Grid>
          {[...nextLabels.entries()].map(([label, count]) => {
            const isSelected = count > 0;
            const isSelectedOnAllItems = count === mediaItemCount;
            const Icon = SPECIAL_LABELS[label];
            return (
              <Grid size="auto" key={label}>
                <Chip
                  label={label}
                  variant={isSelected ? "filled" : "outlined"}
                  color={
                    isSelected && isSelectedOnAllItems ? "secondary" : "default"
                  }
                  onClick={() => {
                    handleLabelToggle(label);
                  }}
                  disabled={loading}
                  icon={Icon ? <Icon /> : undefined}
                />
              </Grid>
            );
          })}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleUpdate} loading={loading}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
