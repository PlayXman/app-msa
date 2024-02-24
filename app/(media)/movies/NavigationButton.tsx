import React from "react";
import { LocalMovies as LocalMoviesIcon } from "@mui/icons-material";
import MediaButton from "@/app/_components/MediaButton";
import { MAIN_COLOR } from "@/app/(media)/movies/color";

export default function NavigationButton({ urlParam }: { urlParam: string }) {
  return (
    <MediaButton
      href={`/movies${urlParam}`}
      Icon={LocalMoviesIcon}
      label="Movies"
      bgColor={MAIN_COLOR}
    />
  );
}
