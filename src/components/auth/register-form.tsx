"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Alert,
  Button,
  Divider,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { DiscordAuthButton } from "@/components/auth/discord-auth-button";
import { useForm } from "@mantine/form";
import { registerSchema } from "@/lib/validation/auth";
import { formResolver } from "@/lib/validation/form-resolver";

type RegisterFormProps = {
  discordEnabled: boolean;
};

export function RegisterForm({ discordEnabled }: RegisterFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: formResolver(registerSchema),
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    setError(null);

    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!registerResponse.ok) {
      const data = (await registerResponse.json()) as { error?: string };
      setLoading(false);
      setError(data.error ?? "Registrace selhala.");
      return;
    }

    const signInResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);

    if (!signInResponse || signInResponse.error) {
      setError("Účet byl vytvořen, ale automatické přihlášení selhalo.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {discordEnabled ? (
          <DiscordAuthButton
            callbackUrl="/dashboard"
            label="Vytvořit účet přes Discord"
          />
        ) : null}
        {discordEnabled ? <Divider label="nebo" labelPosition="center" /> : null}
        {error ? <Alert color="red">{error}</Alert> : null}
        <TextInput
          label="Jméno"
          placeholder="Alice Editorka"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="E-mail"
          placeholder="alice@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Heslo"
          placeholder="Alespoň 8 znaků"
          {...form.getInputProps("password")}
        />
        <Button loading={loading} type="submit">
          Vytvořit účet
        </Button>
      </Stack>
    </form>
  );
}
