import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SxProps,
} from "@mui/material";
import React, { ReactNode, useState } from "react";

const confirmSx: SxProps = {
  backgroundColor: "error.main",
  "&:focus": {
    backgroundColor: "error.main",
  },
  "&:hover": {
    backgroundColor: "error.light",
  },
};

export default function MediaGridItemMenuItem({
  label,
  icon,
  onClick,
  confirm,
}: {
  label: string;
  icon?: ReactNode;
  onClick: () => Promise<void> | void;
  confirm?: boolean;
}) {
  const [displayConfirm, setDisplayConfirm] = useState(false);

  const handleClick = async () => {
    if (confirm) {
      //confirm button
      if (displayConfirm) {
        await onClick();
        setDisplayConfirm(false);
      } else {
        setDisplayConfirm(true);
      }
    } else {
      //regular button
      await onClick();
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton
        color="error.main"
        onClick={handleClick}
        sx={displayConfirm ? confirmSx : undefined}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText
          inset={!icon}
          primary={displayConfirm ? "Confirm" : label}
        />
      </ListItemButton>
    </ListItem>
  );
}
