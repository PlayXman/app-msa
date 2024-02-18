import React, { ReactNode, useCallback } from "react";
import Media from "@/models/Media";
import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  SxProps,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";
import { formatDate } from "@/models/utils/formatters";
import Image from "next/image";
import MediaGridItemCardLabels from "@/app/(media)/_components/MediaGrid/labels/MediaGridItemCardLabels";

const IMAGE_WIDTH = 158;
const IMAGE_HEIGHT = 200;

const cardSx: SxProps<Theme> = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  outline: "transparent 4px solid",
  transition: (theme) => theme.transitions.create("outline-color"),
};
const cardOpenedSx: SxProps = {
  outlineColor: "secondary.main",
};
const clickableAreaSx: SxProps = {
  display: "flex",
  width: "100%",
  flexGrow: 1,
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
};
const imageSx: SxProps<Theme> = {
  background: (theme) => theme.palette.grey["800"],
  height: IMAGE_HEIGHT,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& img": {
    display: "block",
    objectFit: "cover",
    maxWidth: "100%",
  },
};
const textSx: SxProps = {
  p: 1.25,
};
const dateSx: SxProps = {
  fontSize: "0.65rem",
};
const dateIconSx: SxProps<Theme> = {
  verticalAlign: "middle",
  color: (theme) => theme.palette.grey["400"],
};
const actionsSx: SxProps = {
  p: 0.5,
  paddingTop: 0,
};

export interface Props {
  model: Media;
  highlight?: boolean;
  onClick?: (model: Media) => void;
  actions?: ReactNode;
}

export default function MediaGridItemCard({
  model,
  highlight = false,
  onClick = () => {},
  actions,
}: Props) {
  const isReleased = model.isReleased;
  const labels = model.labels?.join(", ") ?? "";

  const handleClick = useCallback(() => {
    onClick(model);
  }, [model, onClick]);

  return (
    <Card elevation={2} sx={[cardSx, highlight && cardOpenedSx] as SxProps}>
      <CardActionArea sx={clickableAreaSx} onClick={handleClick}>
        <Box sx={imageSx}>
          {model.imageUrl && (
            <Image
              src={model.imageUrl}
              alt=""
              loading="lazy"
              priority={false}
              width={IMAGE_WIDTH}
              height={IMAGE_HEIGHT}
            />
          )}
        </Box>
        <CardContent sx={textSx}>
          <Typography gutterBottom variant="body2">
            {model.title}
          </Typography>
          <Typography variant="body2">
            <Tooltip
              disableFocusListener
              title={isReleased ? "Released" : "Not released"}
            >
              <Box component="span" sx={dateSx}>
                {formatDate(model.releaseDate)}{" "}
                {!isReleased && (
                  <ScheduleIcon fontSize="inherit" sx={dateIconSx} />
                )}
              </Box>
            </Tooltip>
          </Typography>
        </CardContent>
      </CardActionArea>

      <CardActions disableSpacing sx={actionsSx}>
        {actions}
        <MediaGridItemCardLabels labels={model.labels} />
      </CardActions>
    </Card>
  );
}
