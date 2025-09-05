import React, { useCallback, useState } from "react";
import { Chip, GridLegacy as Grid } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import Media from "@/models/Media";
import { sortLabels } from "@/app/(media)/_components/MediaGrid/labels/specialLabels";
import MediaGridItemMenuLabelsDialog, {
  Props as MediaGridItemMenuLabelsDialogProps,
} from "@/app/(media)/_components/MediaGrid/labels/MediaGridItemMenuLabelsDialog";

export interface Props {
  model: Media;
  onLabelsUpdate: MediaGridItemMenuLabelsDialogProps["onLabelsUpdate"];
}

export default function MediaGridItemMenuLabels({
  model,
  onLabelsUpdate,
}: Props) {
  const [open, setOpen] = useState(false);

  // HANDLERS

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

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

      <MediaGridItemMenuLabelsDialog
        open={open}
        onClose={handleClose}
        models={[model]}
        onLabelsUpdate={onLabelsUpdate}
      />
    </>
  );
}
