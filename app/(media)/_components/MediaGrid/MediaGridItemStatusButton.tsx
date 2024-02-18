import React, { useCallback, useMemo, useState } from "react";
import {
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from "@mui/icons-material";
import Media, { Status } from "@/models/Media";
import IconButton, { Props as IconButtonProps } from "@/components/IconButton";

export interface Props {
  model: Media;
  onChange: (model: Media) => Promise<void>;
}

export default function MediaGridItemStatusButton({ model, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const status = model.status;
  const isReleased = model.isReleased;

  const data = useMemo<{
    title: string;
    color: IconButtonProps["color"];
    icon: typeof BookmarkIcon;
  }>(() => {
    switch (status) {
      case Status.DOWNLOADABLE:
        return {
          title: "Downloadable",
          color: "success",
          icon: BookmarkIcon,
        };
      case Status.OWNED:
        return {
          title: "Owned",
          color: "info",
          icon: BookmarkIcon,
        };
      case Status.DEFAULT:
      default:
        if (!isReleased) {
          return {
            title: "Not Released",
            color: "default",
            icon: BookmarkBorderIcon,
          };
        } else {
          return {
            title: "Released",
            color: "default",
            icon: BookmarkIcon,
          };
        }
    }
  }, [isReleased, status]);

  const handleClick = useCallback(async () => {
    setLoading(true);
    await onChange(model);
    setLoading(false);
  }, [model, onChange]);

  return (
    <IconButton
      label={data.title}
      onClick={handleClick}
      size="medium"
      loading={loading}
      color={data.color}
    >
      <data.icon fontSize="small" />
    </IconButton>
  );
}
