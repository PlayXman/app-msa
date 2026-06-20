import React, { ReactNode } from "react";
import { Box, SxProps, Theme, Toolbar } from "@mui/material";
import AppBar, { Props as AppBarProps } from "@/app/(media)/_components/AppBar";
import Alphabet, {
  SX_WIDTH,
  SX_WIDTH as alphabetWidth,
} from "@/app/(media)/_components/Alphabet/Alphabet";
import MediaGrid, {
  Props as MediaGridProps,
} from "@/app/(media)/_components/MediaGrid/MediaGrid";

const rootSx: SxProps = {
  display: "flex",
  "--layoutOrientation": {
    xs: "column",
    sm: "column-reverse",
  },
  flexDirection: "var(--layoutOrientation)",
};
const contentSx: SxProps<Theme> = {
  paddingLeft: (theme) => `max(6%, ${theme.spacing(2)})`,
  paddingRight: (theme) => `max(6%, ${theme.spacing(alphabetWidth + 0.5)})`,
  paddingTop: "min(8%, 3em)",
  paddingBottom: "min(8%, 3em)",
};
const alphabetContainerSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "var(--layoutOrientation)",
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
};
const alphabetSx: SxProps<Theme> = {
  display: "flex",
  flexGrow: 1,
  justifyContent: "center",
};

export type Props = Pick<AppBarProps, "onSearch"> &
  Pick<MediaGridProps, "extraActions">;

export default function Overlay({ onSearch, extraActions }: Props) {
  return (
    <Box sx={rootSx}>
      <Box component="main" sx={contentSx}>
        <MediaGrid extraActions={extraActions} />
      </Box>
      <Box sx={alphabetContainerSx}>
        <Box sx={alphabetSx}>
          <Alphabet />
        </Box>
        <Toolbar />
      </Box>
      <Toolbar />
      <AppBar onSearch={onSearch} />
    </Box>
  );
}
