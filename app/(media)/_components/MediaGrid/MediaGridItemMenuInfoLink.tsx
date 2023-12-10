import { Button, SxProps } from "@mui/material";
import React, { useMemo } from "react";
import Link from "next/link";
import CsfdIcon from "@/app/_components/icons/CsfdIcon";
import ImdbIcon from "@/app/_components/icons/ImdbIcon";
import TraktIcon from "@/app/_components/icons/TraktIcon";
import SteamIcon from "@/app/_components/icons/SteamIcon";
import GamespotIcon from "@/app/_components/icons/GamespotIcon";
import GamesIcon from "@/app/_components/icons/GamesIcon";
import GoogleBooksIcon from "@/app/_components/icons/GoogleBooksIcon";
import AmazonIcon from "@/app/_components/icons/AmazonIcon";

type Variant =
  | "csfd"
  | "imdb"
  | "trakt"
  | "steam"
  | "gamespot"
  | "games"
  | "googleBooks"
  | "amazon";

const rootSx: SxProps = {
  width: "100%",
  height: "2.5em",
  "& .MuiButton-label": {
    height: "100%",
  },
  "& svg": {
    width: "auto",
    height: "100%",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
  },
};
const iconStyles: { [key in Variant]: SxProps } = {
  csfd: {
    background: "#ba0305",
    "&:hover": {
      backgroundColor: "#d21517",
    },
    "&:active": {
      backgroundColor: "#990305",
    },
  },
  imdb: {
    background: "#F5C518",
    "&:hover": {
      backgroundColor: "#fcdb5f",
    },
    "&:active": {
      backgroundColor: "#cba311",
    },
  },
  trakt: {
    background: "#ed1c24",
    "&:hover": {
      backgroundColor: "#f64046",
    },
    "&:active": {
      backgroundColor: "#b80f14",
    },
  },
  steam: {
    background: "#1b2838",
    "&:hover": {
      backgroundColor: "#243447",
    },
    "&:active": {
      backgroundColor: "#121b26",
    },
  },
  gamespot: {
    fill: "#FFDD00",
    background: "#2b2d31",
    "&:hover": {
      backgroundColor: "#3e4045",
    },
    "&:active": {
      backgroundColor: "#191c1d",
    },
  },
  games: {
    background: "#161616",
    "&:hover": {
      backgroundColor: "#313131",
    },
    "&:active": {
      backgroundColor: "#070707",
    },
  },
  googleBooks: {
    background: "#ffffff",
    outline: "1px solid rgba(0, 0, 0, 0.1)",
  },
  amazon: {
    background: "#131921",
    "&:hover": {
      backgroundColor: "#2d3f4d",
    },
    "&:active": {
      backgroundColor: "#030405",
    },
  },
};

export interface Props {
  url: string;
  variant: Variant;
}

export default function MediaGridItemMenuInfoLink({ url, variant }: Props) {
  const icon = useMemo(() => {
    switch (variant) {
      case "csfd":
        return <CsfdIcon />;
      case "imdb":
        return <ImdbIcon />;
      case "trakt":
        return <TraktIcon />;
      case "steam":
        return <SteamIcon />;
      case "gamespot":
        return <GamespotIcon />;
      case "games":
        return <GamesIcon />;
      case "googleBooks":
        return <GoogleBooksIcon />;
      case "amazon":
        return <AmazonIcon />;
      default:
        return null;
    }
  }, [variant]);

  return (
    <Button
      disableRipple
      component={Link}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={[rootSx, iconStyles[variant] ?? false] as SxProps}
    >
      {icon}
    </Button>
  );
}
