import React from "react";
import { Button, ButtonGroup, ListItem } from "@mui/material";
import { useMediaContext } from "@/app/(media)/_components/MediaContext";
import { useLabelContext } from "@/app/(media)/_components/LabelContext";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import SteamLogoIcon from "@/components/icons/SteamLogoIcon";
import EpicLogoIcon from "@/components/icons/EpicLogoIcon";
import Game from "@/app/(media)/games/Game";
import { SpecialLabels } from "@/app/(media)/_components/MediaGrid/labels/specialLabels";

export default function ExtraActions({ item }: { item: Game }) {
  const { dispatchMedia } = useMediaContext();
  const { update: updateLabels } = useLabelContext();
  const notification = useNotificationDispatch();
  const labels = item.labels;

  const handleClick = async (label: SpecialLabels) => {
    try {
      const nextLabels = new Set(labels);
      if (nextLabels.has(label)) {
        // Remove
        nextLabels.delete(label);
        await updateLabels([], [label]);
      } else {
        // Add
        nextLabels.add(label);
        await updateLabels([label], []);
      }
      const nextItem = item.clone();
      nextItem.labels = Array.from(nextLabels);
      await nextItem.save();
      dispatchMedia({
        type: "update",
        item: {
          id: nextItem.id,
          display: true,
          model: nextItem,
        },
      });
    } catch (error) {
      notification({
        type: "error",
        message: `Failed to update stores with ${label}`,
        error,
      });
    }
  };

  const isSteamSelected = labels.includes("Steam");
  const isEpicSelected = labels.includes("Epic");

  return (
    <ListItem disablePadding>
      <ButtonGroup variant="text" fullWidth color="inherit" disableElevation>
        <Button
          startIcon={<SteamLogoIcon />}
          onClick={() => handleClick("Steam")}
          variant={isSteamSelected ? "contained" : undefined}
        >
          Steam
        </Button>
        <Button
          startIcon={<EpicLogoIcon />}
          onClick={() => handleClick("Epic")}
          variant={isEpicSelected ? "contained" : undefined}
        >
          Epic Games
        </Button>
      </ButtonGroup>
    </ListItem>
  );
}
