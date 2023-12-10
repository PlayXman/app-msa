"use client";

import Button from "@/components/Button";
import {
  Card,
  CardActions,
  CardContent,
  Stack,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { FormEventHandler, useCallback } from "react";
import { useNotificationDispatch } from "@/app/_components/NotificationContext";
import { useAuthenticationContext } from "@/app/_components/AuthenticationContext";
import { useRouter } from "next/navigation";

const cardSx: SxProps = {
  maxWidth: 300,
  width: "100%",
};
const actionsSx: SxProps = {
  justifyContent: "right",
};

export default function Page() {
  const notification = useNotificationDispatch();
  const { signIn } = useAuthenticationContext();
  const router = useRouter();

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    async (event) => {
      event.preventDefault();

      notification({ type: "loading", message: "Signing in..." });

      const formData = new FormData(event.currentTarget);
      const email = (formData.get("email") ?? "") as string;
      const password = (formData.get("password") ?? "") as string;

      try {
        await signIn(email, password);
        notification({ type: "close" });
        router.push("/");
      } catch (error) {
        notification({ type: "error", message: "Failed to sing in", error });
      }
    },
    [notification, router, signIn],
  );

  return (
    <Stack justifyContent="center" alignItems="center" height="100%">
      <Card sx={cardSx}>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h4">Sign-in</Typography>
              <TextField
                autoFocus
                name="email"
                label="Email"
                type="email"
                required
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                required
              />
            </Stack>
          </CardContent>
          <CardActions sx={actionsSx}>
            <Button variant="text" color="primary" type="submit">
              Log in
            </Button>
          </CardActions>
        </form>
      </Card>
    </Stack>
  );
}
