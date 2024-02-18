import React from "react";
import { SxProps, Theme, Typography } from "@mui/material";
import Button from "@/components/Button";
import { SvgIconComponent } from "@mui/icons-material";
import Link from "next/link";
import { colorToHexAlpha } from "@/models/utils/formatters";

const rootSx: SxProps = {
  aspectRatio: 1,
  py: 4,
  px: 2,
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "background.paper",
  color: "text.primary",
  backgroundImage: `radial-gradient( ellipse at 50% 4rem, var(--mediaButtonColor) 0%, rgba(0,0,0,0) 100% )`,
  "&:hover": {
    backgroundColor: "var(--mediaButtonColor)",
  },
};

export default function MediaButton({
  href,
  label,
  Icon,
  bgColor,
}: {
  href: string;
  Icon: SvgIconComponent;
  label: string;
  bgColor: string;
}) {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{
        ...rootSx,
        "--mediaButtonColor": colorToHexAlpha(bgColor, 0.2),
      }}
      component={Link}
      href={href}
    >
      <div>
        <Icon fontSize="large" />
      </div>
      <div>
        <Typography variant="h6">{label}</Typography>
      </div>
    </Button>
  );
}
