import {
  Avatar,
  Box,
  IconButton,
  List,
  SwipeableDrawer,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import {
  LocalMovies as LocalMoviesIcon,
  VideogameAsset as VideogameAssetIcon,
  Book as BookIcon,
  LiveTv as LiveTvIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import SideMenuItem from "@/app/(media)/_components/AppBar/SideMenuItem";

const buttonSx: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.grey["800"],
};
const logoSx: SxProps = {
  background: "#fff",
  margin: "0 auto 1rem",
  width: "4rem",
  height: "4rem",
  "& img": {
    maxWidth: "70%",
    height: "auto",
  },
};

export default function SideMenu() {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        aria-label="Menu"
        edge="start"
        sx={buttonSx}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        disableSwipeToOpen
      >
        <Box p={4} bgcolor="secondary.dark" color="secondary.contrastText">
          <Avatar alt="MSA" src="/images/logo.svg" sx={logoSx} />
          <Typography variant="h6" sx={{ color: "inherit" }}>
            MediaStorage App
          </Typography>
        </Box>
        <List component="nav">
          <SideMenuItem
            href="/movies"
            label="Movies"
            icon={<LocalMoviesIcon />}
          />
          <SideMenuItem
            href="/games"
            label="Games"
            icon={<VideogameAssetIcon />}
          />
          <SideMenuItem href="/books" label="Books" icon={<BookIcon />} />
          <SideMenuItem
            href="/tv-shows"
            label="TV Shows"
            icon={<LiveTvIcon />}
          />
        </List>
      </SwipeableDrawer>
    </>
  );
}
