import React, { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import RootTheme from "@/app/_components/RootTheme";
import FirebaseSetup from "@/app/_components/FirebaseSetup";
import { NotificationContextProvider } from "@/app/_components/NotificationContext";
import { AuthenticationContextProvider } from "@/app/_components/AuthenticationContext";

export const metadata: Metadata = {
  title: "MediaStorage App",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/images/favicons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/images/favicons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: {
      url: "/images/favicons/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    shortcut: "/favicon.ico",
    other: [
      {
        rel: "mask-icon",
        url: "/images/favicons/safari-pinned-tab.svg",
        color: "#5bbad5",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#9dc358",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <FirebaseSetup />
        <RootTheme>
          <NotificationContextProvider>
            <AuthenticationContextProvider>
              {children}
            </AuthenticationContextProvider>
          </NotificationContextProvider>
        </RootTheme>
      </body>
    </html>
  );
}
