import React, { memo } from "react";
import Media from "@/models/Media";
import { SxProps, Theme, Tooltip, Typography } from "@mui/material";
import { Roboto_Mono } from "next/font/google";
import { sortLabels } from "@/app/(media)/_components/MediaGrid/labels/specialLabels";

const robotoMono = Roboto_Mono({
  display: "swap",
  subsets: ["latin"],
  weight: ["400"],
});

const labelsSx: SxProps = {
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  fontFamily: robotoMono.style.fontFamily,
  fontSize: "0.5rem",
  padding: "0 2px",
};
const specialLabelIconSx: SxProps<Theme> = {
  marginRight: "0.125rem",
  verticalAlign: "middle",
  fill: (theme) => theme.palette.grey["600"],
};

export default memo(function MediaGridItemCardLabels({
  labels,
}: {
  labels: Media<any>["labels"];
}) {
  const [specialLabels, normalLabels] = sortLabels(labels);

  return (
    <Typography variant="body1" sx={labelsSx}>
      {specialLabels.map(({ label, Icon }) => {
        return (
          <Tooltip key={label} title={label} arrow>
            <Icon sx={specialLabelIconSx} fontSize="small" />
          </Tooltip>
        );
      })}
      {normalLabels.join(", ")}
    </Typography>
  );
});
