import React from "react";
import { LabelContextProvider } from "@/app/(media)/_components/LabelContext";
import {
  MediaContextProvider,
  Props as MediaContextProviderProps,
} from "@/app/(media)/_components/MediaContext";
import PageTheme from "@/app/(media)/_components/PageLayout/PageTheme";
import MediaCache from "@/app/(media)/_components/MediaCache";
import Overlay, {
  Props as OverlayProps,
} from "@/app/(media)/_components/PageLayout/Overlay";

export type Props = OverlayProps &
  Pick<MediaContextProviderProps, "mediaModel"> & {
    themeSecondaryColor: string;
  };

export default function PageLayout({
  themeSecondaryColor,
  mediaModel,
  ...overlayProps
}: Props) {
  return (
    <PageTheme secondaryColor={themeSecondaryColor}>
      <MediaContextProvider mediaModel={mediaModel}>
        <MediaCache />
        <LabelContextProvider>
          <Overlay {...overlayProps} />
        </LabelContextProvider>
      </MediaContextProvider>
    </PageTheme>
  );
}
