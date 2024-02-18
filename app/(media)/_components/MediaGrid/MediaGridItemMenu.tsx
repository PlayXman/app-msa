import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  SwipeableDrawer,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import React, { ReactNode, useMemo, memo, useEffect } from "react";
import Media from "@/models/Media";
import Image from "next/image";
import MediaGridItemMenuItem from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuItem";
import {
  Delete as DeleteIcon,
  FileCopy as FileCopyIcon,
  Bookmark as BookmarkIcon,
} from "@mui/icons-material";
import MediaGridItemMenuInfoLink, {
  Props as MediaGridItemMenuInfoLinkProps,
} from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";
import UrlHelpers from "@/models/utils/UrlHelpers";
import MediaGridItemMenuLabels, {
  Props as MediaGridItemMenuLabelsProps,
} from "@/app/(media)/_components/MediaGrid/labels/MediaGridItemMenuLabels";

const rootSx: SxProps = {
  "& .MuiDrawer-paper": {
    background: "transparent",
    boxShadow: "none",
  },
};
const imageSx: SxProps<Theme> = {
  background: "#292929",
  outline: "4px solid",
  outlineColor: "background.paper",
  borderRadius: 2,
  overflow: "hidden",
  margin: "0 auto 0",
  marginLeft: 2,
  display: "inline-block",
  verticalAlign: "top",
  transform: (theme) => `translateY(${theme.spacing(1.5)})`,

  "& img": {
    display: "block",
    width: "auto",
  },
  "& div": {
    width: 158,
    height: 200,
  },
};
const backgroundSx: SxProps = {
  borderRadius: 0,
  borderTopRightRadius: 8,
  borderTopLeftRadius: 8,
  backgroundImage: "none",
};
const headingSx: SxProps = {
  p: 2,
};

export interface Props {
  open: boolean;
  onClose: () => void;
  model: Media | undefined;
  infoLinks: {
    url:
      | MediaGridItemMenuInfoLinkProps["url"]
      | ((model: Media) => MediaGridItemMenuInfoLinkProps["url"]);
    variant: MediaGridItemMenuInfoLinkProps["variant"];
  }[];
  onLabelsUpdate: MediaGridItemMenuLabelsProps["onLabelsUpdate"];
  onStatusChange: (model: Media) => Promise<void>;
  onTitleCopy: (model: Media) => Promise<void>;
  onDelete: (model: Media) => Promise<void>;
  extraActions?: (model: Media) => ReactNode;
}

function MediaGridItemMenu({
  open,
  model,
  onClose,
  infoLinks,
  onLabelsUpdate,
  onStatusChange,
  onTitleCopy,
  onDelete,
  extraActions = () => null,
}: Props) {
  useEffect(() => {
    if (model == null) {
      onClose();
    }
  }, [model, onClose]);

  const status = useMemo(() => {
    switch (model?.status) {
      case "DOWNLOADABLE":
        return "Downloadable";
      case "OWNED":
        return "Owned";
      case "DEFAULT":
      default:
        return "Not owned";
    }
  }, [model?.status]);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      disableSwipeToOpen
      onOpen={() => {}}
      sx={rootSx}
    >
      {model == null ? null : (
        <>
          <Grid container justifyContent="center" onClick={onClose}>
            <Grid item xs sm={6} md={4} lg={3} xl={3}>
              <Box sx={imageSx}>
                {model.imageUrl ? (
                  <Image
                    src={model.imageUrl}
                    alt={""}
                    height={200}
                    width={158}
                  />
                ) : (
                  <div />
                )}
              </Box>
            </Grid>
          </Grid>
          <Paper elevation={8} sx={backgroundSx}>
            <Grid container justifyContent="center">
              <Grid item xs sm={6} md={4} lg={3} xl={3}>
                <Box sx={headingSx}>
                  <Typography variant="h5" gutterBottom>
                    {model.title}
                  </Typography>
                  <MediaGridItemMenuLabels
                    model={model}
                    onLabelsUpdate={onLabelsUpdate}
                  />
                </Box>
                <Divider />
                <List>
                  <ListItem>
                    <Grid container spacing={1}>
                      {infoLinks.map((link, index) => {
                        const url =
                          typeof link.url === "function"
                            ? link.url(model)
                            : link.url + UrlHelpers.encodeText(model.title);

                        return (
                          <Grid item xs key={index}>
                            <MediaGridItemMenuInfoLink
                              variant={link.variant}
                              url={url}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </ListItem>
                  {extraActions(model)}
                  <MediaGridItemMenuItem
                    label={`Status: ${status}`}
                    icon={<BookmarkIcon />}
                    onClick={() => {
                      return onStatusChange(model);
                    }}
                  />
                  <MediaGridItemMenuItem
                    label="Copy title"
                    icon={<FileCopyIcon />}
                    onClick={() => {
                      return onTitleCopy(model);
                    }}
                  />
                </List>
                <Divider />
                <List>
                  <MediaGridItemMenuItem
                    label="Delete"
                    icon={<DeleteIcon />}
                    confirm
                    onClick={() => {
                      return onDelete(model);
                    }}
                  />
                </List>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </SwipeableDrawer>
  );
}

export default memo(MediaGridItemMenu);
