import { Button, SxProps } from "@mui/material";
import React, { useMemo } from "react";
import Link from "next/link";
import CsfdIcon from "@/components/icons/CsfdIcon";
import ImdbIcon from "@/components/icons/ImdbIcon";
import TraktIcon from "@/components/icons/TraktIcon";
import SteamIcon from "@/components/icons/SteamIcon";
import SteamDBIcon from "@/components/icons/SteamDBIcon";
import GamespotIcon from "@/components/icons/GamespotIcon";
import GamesIcon from "@/components/icons/GamesIcon";
import GoogleBooksIcon from "@/components/icons/GoogleBooksIcon";
import AmazonIcon from "@/components/icons/AmazonIcon";
import EpicStoreIcon from "@/components/icons/EpicStoreIcon";
import GoodreadsIcon from "@/components/icons/GoodreadsIcon";

type Variant =
  | "csfd"
  | "imdb"
  | "trakt"
  | "epicStore"
  | "steam"
  | "steamDB"
  | "gamespot"
  | "games"
  | "googleBooks"
  | "amazon"
  | "goodreads";

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
  epicStore: {
    background: "#131313",
    "&:hover": {
      backgroundColor: "#232323",
    },
    "&:active": {
      backgroundColor: "#000000",
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
  steamDB: {
    background: "#101821",
    "&:hover": {
      backgroundColor: "#182431",
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
  goodreads: {
    background: "#faf8f6",
    "&:hover": {
      backgroundColor: "#e8e6e3",
    },
    "&:active": {
      backgroundColor: "#dbdad7",
    },
  },
};

export interface Props {
  /** Link to external info page. */
  url: string;
  /** Button variant. */
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
      case "epicStore":
        return <EpicStoreIcon />;
      case "steam":
        return <SteamIcon />;
      case "steamDB":
        return <SteamDBIcon />;
      case "gamespot":
        return <GamespotIcon />;
      case "games":
        return <GamesIcon />;
      case "googleBooks":
        return <GoogleBooksIcon />;
      case "amazon":
        return <AmazonIcon />;
      case "goodreads":
        return <GoodreadsIcon />;
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
