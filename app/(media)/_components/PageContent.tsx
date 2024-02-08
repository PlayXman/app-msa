import React from "react";
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

const contentSx: SxProps = {
  paddingLeft: 1,
  paddingRight: alphabetWidth,
  paddingTop: "min(8%, 3em)",
  paddingBottom: "5em",
};

export type Props = Pick<MediaGridProps, "infoLinks" | "extraActions"> &
  Pick<AddMediaButtonProps, "onSearch" | "onSearchItemClick"> & {
    loading: boolean;
  };

/**
 * Main content of the media page.
 * @param loading
 * @param infoLinks
 * @param extraActions
 * @param onSearch
 * @param onSearchItemClick
 * @constructor
 */
export default function PageContent({
  loading,
  infoLinks,
  extraActions,
  onSearch,
  onSearchItemClick,
}: Props) {
  return (
    <main>
      <Box sx={contentSx}>
        <MediaGrid
          loading={loading}
          infoLinks={infoLinks}
          extraActions={extraActions}
        />
      </Box>
      <Alphabet loading={loading} />
      <AddMediaButton
        loading={loading}
        onSearch={onSearch}
        onSearchItemClick={onSearchItemClick}
      />
    </main>
  );
}
