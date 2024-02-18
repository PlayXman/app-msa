import React from "react";
import { SxProps, Typography } from "@mui/material";
import Button from "@/components/Button";
import { SvgIconComponent } from "@mui/icons-material";
import Link from "next/link";

const rootSx: SxProps = {
  aspectRatio: 1,
  py: 4,
  px: 2,
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
};

export default function MediaButton({
  href,
  label,
  Icon,
}: {
  href: string;
  Icon: SvgIconComponent;
  label: string;
}) {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={rootSx}
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
