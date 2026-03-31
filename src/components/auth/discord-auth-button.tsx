"use client";

import { useState } from "react";
import { Button } from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

type DiscordAuthButtonProps = {
  callbackUrl: string;
  label?: string;
};

export function DiscordAuthButton({
  callbackUrl,
  label = "Pokračovat přes Discord",
}: DiscordAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    await signIn("discord", {
      callbackUrl,
    });
  };

  return (
    <Button
      color="indigo"
      fullWidth
      leftSection={<IconBrandDiscord size={18} />}
      loading={loading}
      onClick={handleClick}
      type="button"
      variant="light"
    >
      {label}
    </Button>
  );
}
