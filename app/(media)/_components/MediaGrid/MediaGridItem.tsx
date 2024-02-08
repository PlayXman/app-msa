import React, { memo } from "react";
import MediaGridItemCard, {
  Props as MediaGridItemCardProps,
} from "@/app/(media)/_components/MediaGrid/MediaGridItemCard";
import MediaGridItemStatusButton, {
  Props as MediaGridItemStatusButtonProps,
} from "@/app/(media)/_components/MediaGrid/MediaGridItemStatusButton";

export type Props = Required<
  Pick<MediaGridItemCardProps, "highlight" | "model" | "onClick"> & {
    onStatusChange: MediaGridItemStatusButtonProps["onChange"];
  }
>;

function MediaGridItem({ model, onStatusChange, ...rest }: Props) {
  return (
    <MediaGridItemCard
      model={model}
      actions={
        <MediaGridItemStatusButton model={model} onChange={onStatusChange} />
      }
      {...rest}
    />
  );
}

// Expects the model prop to receive the same object reference if there are no changes.
export default memo(MediaGridItem);
