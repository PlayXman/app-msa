import Media from "@/models/Media";
import SteamLogoIcon from "@/components/icons/SteamLogoIcon";
import EpicLogoIcon from "@/components/icons/EpicLogoIcon";
import React from "react";

export const SPECIAL_LABELS: Record<
  string,
  React.JSXElementConstructor<any>
> = {
  Steam: SteamLogoIcon,
  Epic: EpicLogoIcon,
};

export type SpecialLabels = keyof typeof SPECIAL_LABELS;

interface SpecialLabel {
  label: string;
  Icon: React.JSXElementConstructor<any>;
}

/**
 * Sort labels into special and normal labels.
 * @param labels
 */
export function sortLabels(
  labels: Media["labels"],
): [SpecialLabel[], Media["labels"]] {
  const specialLabels: SpecialLabel[] = [];
  const normalLabels: Media["labels"] = [];

  for (const label of labels) {
    if (label in SPECIAL_LABELS) {
      specialLabels.push({
        label,
        Icon: SPECIAL_LABELS[label],
      });
    } else {
      normalLabels.push(label);
    }
  }

  return [specialLabels, normalLabels];
}
