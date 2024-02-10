import React, {
  ChangeEvent,
  FormEvent,
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
import { Edit as EditIcon } from "@mui/icons-material";
import { useLabelContext } from "@/app/(media)/_components/LabelContext";
import Button from "@/components/Button";
import Labels from "@/models/Labels";
import Media from "@/models/Media";
import {
  sortLabels,
  SPECIAL_LABELS,
} from "@/app/(media)/_components/MediaGrid/labels/specialLabels";

export interface Props {
  model: Media;
  onLabelsUpdate: (model: Media, nextLabels: string[]) => Promise<void>;
}

export default function MediaGridItemMenuLabels({
  model,
  onLabelsUpdate,
}: Props) {
  const [open, setOpen] = useState(false);
  const [nextLabels, setNextLabels] = useState<string[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [allLabels, setAllLabels] = useState<string[]>([]);

  const labelState = useLabelContext();

  // Reset on open.

  useEffect(() => {
    if (open) {
      setAllLabels(labelState.labels);
    }
  }, [labelState.labels, open]);

  useEffect(() => {
    if (open) {
      setNextLabels(model.labels);
      setNewLabel("");
    }
  }, [model.labels, open]);

  // HANDLERS

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleNewLabelChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setNewLabel(event.target.value);
    },
    [],
  );

  const handleLabelAdd = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!newLabel) {
        return;
      }

      const label = Labels.createNewLabel(newLabel);

      setAllLabels((prevState) => {
        if (prevState.includes(label)) {
          return prevState;
        }
        return [label, ...prevState];
      });

      setNextLabels((prevState) => {
        if (prevState.includes(label)) {
          return prevState;
        }
        return [label, ...prevState];
      });

      setNewLabel("");
    },
    [newLabel],
  );

  const handleLabelToggle = useCallback((label: string) => {
    setNextLabels((prevState) => {
      if (prevState.includes(label)) {
        return prevState.filter((p) => p !== label);
      } else {
        return [label, ...prevState];
      }
    });
  }, []);

  const handleUpdate = useCallback(async () => {
    setLoading(true);

    await onLabelsUpdate(model, nextLabels);
    const add = nextLabels.filter((n) => !model.labels.includes(n));
    const remove = model.labels.filter((p) => !nextLabels.includes(p));
    await labelState.update(add, remove);

    setLoading(false);
    setOpen(false);
  }, [model, labelState, nextLabels, onLabelsUpdate]);

  // RENDER

  const [specialLabels, normalLabels] = sortLabels(model.labels);

  return (
    <>
      <Grid container spacing={1}>
        {specialLabels.map(({ label, Icon }) => {
          return (
            <Grid item key={label}>
              <Chip
                label={label}
                size="small"
                variant="outlined"
                icon={<Icon />}
              />
            </Grid>
          );
        })}
        {normalLabels.map((label) => {
          return (
            <Grid item key={label}>
              <Chip label={label} size="small" variant="outlined" />
            </Grid>
          );
        })}
        <Grid item>
          <Chip
            label="Edit labels"
            icon={<EditIcon />}
            onClick={handleOpen}
            size="small"
          />
        </Grid>
      </Grid>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Edit labels</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            {allLabels.map((label) => {
              const isSelected = nextLabels.includes(label);
              const Icon = SPECIAL_LABELS[label];
              return (
                <Grid item key={label}>
                  <Chip
                    label={label}
                    variant={isSelected ? "filled" : "outlined"}
                    color={isSelected ? "secondary" : "default"}
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
    </>
  );
}
