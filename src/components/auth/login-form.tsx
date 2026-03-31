"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Alert,
  Button,
  Divider,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { DiscordAuthButton } from "@/components/auth/discord-auth-button";
import { useForm } from "@mantine/form";
import { loginSchema } from "@/lib/validation/auth";
import { formResolver } from "@/lib/validation/form-resolver";

type LoginFormProps = {
  authError: string | null;
  callbackUrl: string;
  discordEnabled: boolean;
};

export function LoginForm({
  authError,
  callbackUrl,
  discordEnabled,
}: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: formResolver(loginSchema),
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Neplatný e-mail nebo heslo.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {authError ? <Alert color="red">{authError}</Alert> : null}
        {discordEnabled ? <DiscordAuthButton callbackUrl={callbackUrl} /> : null}
        {discordEnabled ? <Divider label="nebo" labelPosition="center" /> : null}
        {error ? <Alert color="red">{error}</Alert> : null}
        <TextInput
          label="E-mail"
          placeholder="alice@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Heslo"
          placeholder="Vaše heslo"
          {...form.getInputProps("password")}
        />
        <Button loading={loading} type="submit">
          Přihlásit se
        </Button>
        <Group justify="space-between">
          <span className="auth-hint">Demo účet: alice@example.com / DemoPassword123!</span>
        </Group>
      </Stack>
    </form>
  );
}
