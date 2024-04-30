import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function SideMenuItem({
  label,
  href,
  icon,
}: {
  label: string;
  icon: ReactNode;
  href: string;
}) {
  const pathname = usePathname();
  const isDisabled = useMemo(() => {
    return href === pathname;
  }, [href, pathname]);

  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} href={href} disabled={isDisabled}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}
