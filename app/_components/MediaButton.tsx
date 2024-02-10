import React, { ReactNode, useCallback } from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  SxProps,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

const iconSx: SxProps = {
  backgroundColor: "primary.light",
  textAlign: "center",
  color: "background.default",
  textShadow: "0 1px 3px rgba(0, 0, 0, 0.29)",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default function MediaButton({
  href,
  label,
  icon,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(href);
  }, [href, router]);

  return (
    <Card variant="elevation" elevation={2}>
      <CardActionArea onClick={handleClick}>
        <CardContent sx={iconSx}>{icon}</CardContent>
        <CardContent>
          <Typography variant="h6">{label}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
