import React from "react";
import { LabelContextProvider } from "@/app/(media)/_components/LabelContext";
import {
  MediaContextProvider,
  Props as MediaContextProviderProps,
} from "@/app/(media)/_components/MediaContext";
import PageContent, {
  Props as PageContentProps,
} from "@/app/(media)/_components/PageContent";
import AppBar, { Props as AppBarProps } from "../AppBar";
import PageTheme from "@/app/(media)/_components/PageLayout/PageTheme";
import MediaCache from "@/app/(media)/_components/MediaCache";

export type Props = PageContentProps &
  Pick<AppBarProps, "onSearch"> &
  Pick<MediaContextProviderProps, "mediaModel"> & {
    themeSecondaryColor: string;
  };

export default function PageLayout({
  themeSecondaryColor,
  mediaModel,
  onSearch,
  ...contentProps
}: Props) {
  return (
    <PageTheme secondaryColor={themeSecondaryColor}>
      <MediaContextProvider mediaModel={mediaModel}>
        <MediaCache />
        <LabelContextProvider>
          <AppBar onSearch={onSearch} />
          <PageContent {...contentProps} />
        </LabelContextProvider>
      </MediaContextProvider>
    </PageTheme>
  );
}
