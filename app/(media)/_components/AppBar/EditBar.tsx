import React, { useCallback } from "react";
import {
  AppBar,
  GridLegacy as Grid,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import DeleteButton from "@/app/(media)/_components/AppBar/DeleteButton";
import StatusButton from "@/app/(media)/_components/AppBar/StatusButton";
import LabelButton from "@/app/(media)/_components/AppBar/LabelButton";

export default function EditBar() {
  const { selectedItems, dispatchMedia } = useMediaContext();

  const handleClear = useCallback(() => {
    dispatchMedia({ type: "toggleSelect", item: null });
  }, [dispatchMedia]);

  return (
    <Slide appear={false} direction="down" in={selectedItems.size > 0}>
      <AppBar enableColorOnDark color="secondary">
        <Toolbar>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            wrap="nowrap"
            spacing={1}
          >
            <Grid item>
              <IconButton color="inherit" edge="start" onClick={handleClear}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" sx={{ color: "inherit" }}>
                Selected {selectedItems.size}
              </Typography>
            </Grid>
            <Grid item>
              <StatusButton />
            </Grid>
            <Grid item>
              <LabelButton />
            </Grid>
            <Grid item>
              <DeleteButton />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
