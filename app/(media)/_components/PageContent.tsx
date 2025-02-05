import React, { Suspense } from "react";
import MediaGrid, {
  Props as MediaGridProps,
} from "@/app/(media)/_components/MediaGrid/MediaGrid";
import AddMediaButton, {
  Props as AddMediaButtonProps,
} from "@/app/(media)/_components/AddMediaButton";
import { Box, SxProps } from "@mui/material";
import Alphabet, {
  SX_WIDTH as alphabetWidth,
} from "@/app/(media)/_components/Alphabet/Alphabet";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";

const contentSx: SxProps = {
  paddingLeft: 1,
  paddingRight: alphabetWidth,
  paddingTop: "min(8%, 3em)",
  paddingBottom: "5em",
};

export type Props = Pick<MediaGridProps, "extraActions"> &
  Pick<AddMediaButtonProps, "onSearch">;

/**
 * Main content of the media page.
 * @param extraActions
 * @param onSearch
 * @constructor
 */
export default function PageContent({ extraActions, onSearch }: Props) {
  const { loading } = useMediaContext();

  return (
    <main>
      <Box sx={contentSx}>
        <MediaGrid loading={loading} extraActions={extraActions} />
      </Box>
      <Alphabet loading={loading} />
      <Suspense>
        <AddMediaButton loading={loading} onSearch={onSearch} />
      </Suspense>
    </main>
  );
}
