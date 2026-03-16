"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import {
  Alert,
  Button,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { registerSchema } from "@/lib/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: zodResolver(registerSchema),
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
      setError(data.error ?? "Registration failed.");
      return;
    }

    const signInResponse = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoading(false);

    if (!signInResponse || signInResponse.error) {
      setError("Account created, but automatic sign-in failed.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        {error ? <Alert color="red">{error}</Alert> : null}
        <TextInput
          label="Name"
          placeholder="Alice Editor"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Email"
          placeholder="alice@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="At least 8 characters"
          {...form.getInputProps("password")}
        />
        <Button loading={loading} type="submit">
          Create account
        </Button>
      </Stack>
    </form>
  );
}
