import React, { memo } from "react";
import { Box, Skeleton, Stack, SxProps, Theme, Toolbar } from "@mui/material";
import Link from "next/link";

const fontSize = "0.7rem";
const chars = [
  "#",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const alphabetSx: SxProps<Theme> = {
  flexGrow: 1,
  overflow: "auto",
  py: 2,
  width: "100%",
};
const charSx: SxProps<Theme> = (theme) => ({
  textDecoration: "none",
  fontSize,
  color: theme.palette.grey["400"],
  transition: theme.transitions.create("color"),
  "&:hover": {
    color: "text.primary",
  },
});
const charDisabledSx: SxProps<Theme> = {
  pointerEvents: "none",
  color: (theme) => theme.palette.grey[300],
};

export interface Props {
  loading: boolean;
  activeLetters: Set<string>;
}

function Chars({ loading, activeLetters }: Props) {
  return (
    <>
      <Toolbar />
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        sx={alphabetSx}
      >
        {loading ? (
          <Skeleton variant="rectangular" width={fontSize} height="100%" />
        ) : (
          chars.map((char) => {
            const isDisabled = !activeLetters.has(char);

            return (
              <Box
                key={char}
                component={Link}
                href={`#${char}`}
                sx={[charSx, isDisabled && charDisabledSx] as SxProps}
                aria-disabled={isDisabled}
              >
                {char.toUpperCase()}
              </Box>
            );
          })
        )}
      </Stack>
    </>
  );
}

export default memo(Chars, (prevProps, nextProps) => {
  return (
    prevProps.loading === nextProps.loading &&
    Array.from(prevProps.activeLetters).toString() ===
      Array.from(nextProps.activeLetters).toString()
  );
});
