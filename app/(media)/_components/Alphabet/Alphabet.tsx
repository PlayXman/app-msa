import React, { useMemo } from "react";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { Box, SxProps, Theme } from "@mui/material";
import Chars from "@/app/(media)/_components/Alphabet/Chars";
import { slugToAlphabet } from "@/models/utils/formatters";

export const SX_WIDTH = 5;

const wrapperSx: SxProps<Theme> = {
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  width: (theme) => theme.spacing(SX_WIDTH),
};

export default function Alphabet({ loading }: { loading: boolean }) {
  const { items } = useMediaContext();

  const activeLetters = useMemo(() => {
    const result = new Set<string>();

    for (const item of items) {
      if (item.display) {
        result.add(slugToAlphabet(item.model));
      }
    }

    return result;
  }, [items]);

  return (
    <Box sx={wrapperSx}>
      <Chars loading={loading} activeLetters={activeLetters} />
    </Box>
  );
}
