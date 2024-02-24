import React from "react";
import { LiveTv as LiveTvIcon } from "@mui/icons-material";
import MediaButton from "@/app/_components/MediaButton";
import { MAIN_COLOR } from "@/app/(media)/tv-shows/color";

export default function NavigationButton({ urlParam }: { urlParam: string }) {
  return (
    <MediaButton
      href={`/tv-shows${urlParam}`}
      Icon={LiveTvIcon}
      label="TV Shows"
      bgColor={MAIN_COLOR}
    />
  );
}
