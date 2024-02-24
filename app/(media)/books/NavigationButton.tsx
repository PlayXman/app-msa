import React from "react";
import { Book as BookIcon } from "@mui/icons-material";
import MediaButton from "@/app/_components/MediaButton";
import { MAIN_COLOR } from "@/app/(media)/books/color";

export default function NavigationButton({ urlParam }: { urlParam: string }) {
  return (
    <MediaButton
      href={`/books${urlParam}`}
      Icon={BookIcon}
      label="Books"
      bgColor={MAIN_COLOR}
    />
  );
}
