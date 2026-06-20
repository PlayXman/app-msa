import React, { useCallback } from "react";
import {
  AppBar,
  Grid,
  IconButton,
  Slide,
  SxProps,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Zoom,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import DeleteButton from "@/app/(media)/_components/AppBar/DeleteButton";
import StatusButton from "@/app/(media)/_components/AppBar/StatusButton";
import LabelButton from "@/app/(media)/_components/AppBar/LabelButton";

const appBarSx: SxProps = {
  top: {
    xs: "auto",
    sm: 0,
  },
  bottom: {
    xs: 0,
    sm: "auto",
  },
};

export default function EditBar() {
  const { selectedItems, dispatchMedia } = useMediaContext();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const handleClear = useCallback(() => {
    dispatchMedia({ type: "toggleSelect", item: null });
  }, [dispatchMedia]);

  return (
    <Slide
      appear={false}
      direction={matches ? "down" : "up"}
      in={selectedItems.size > 0}
    >
      <AppBar enableColorOnDark color="secondary" sx={appBarSx}>
        <Toolbar>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              flexGrow: 1,
            }}
            wrap="nowrap"
            spacing={1}
          >
            <Grid size="auto">
              <IconButton color="inherit" edge="start" onClick={handleClear}>
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid size="grow">
              <Typography variant="h6" sx={{ color: "inherit" }}>
                Selected {selectedItems.size}
              </Typography>
            </Grid>
            <Grid size="auto">
              <StatusButton />
            </Grid>
            <Grid size="auto">
              <LabelButton />
            </Grid>
            <Grid size="auto">
              <DeleteButton />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}
