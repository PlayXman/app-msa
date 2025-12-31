import React, { ReactNode, useCallback } from "react";
import Media from "@/models/Media";
import {
  Box,
  Card,
  CardActionArea,
  CardActionAreaProps,
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
  model: Media<any>;
  highlight?: boolean;
  onClick?: (model: Media<any>) => void;
  onContextMenu?: (model: Media<any>) => void;
  actions?: ReactNode;
}

export default function MediaGridItemCard({
  model,
  highlight = false,
  onClick,
  onContextMenu,
  actions,
}: Props) {
  const isReleased = model.isReleased;

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick(model);
    }
  }, [model, onClick]);
  const handleContextMenu = useCallback<
    NonNullable<CardActionAreaProps["onContextMenu"]>
  >(
    (event) => {
      if (onContextMenu) {
        event.preventDefault();
        onContextMenu(model);
      }
    },
    [model, onContextMenu],
  );

  return (
    <Card elevation={2} sx={[cardSx, highlight && cardOpenedSx] as SxProps}>
      <CardActionArea
        sx={clickableAreaSx}
        onClick={handleClick}
        /*
         * Allows long touch and right mouse click to select item. This type of event allows to bypass complicated solution with mouse/touch/pointer events. Although, it doesn't trigger on IOS Safari.
         *
         * @see https://bugs.webkit.org/show_bug.cgi?id=213953
         */
        onContextMenu={handleContextMenu}
      >
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
