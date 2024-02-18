import React from "react";
import { VideogameAsset as VideogameAssetIcon } from "@mui/icons-material";
import MediaButton from "@/app/_components/MediaButton";
import { MAIN_COLOR } from "@/app/(media)/games/color";

export default function NavigationButton({ urlParam }: { urlParam: string }) {
  return (
    <MediaButton
      href={`/games${urlParam}`}
      Icon={VideogameAssetIcon}
      label="Games"
      bgColor={MAIN_COLOR}
    />
  );
}
