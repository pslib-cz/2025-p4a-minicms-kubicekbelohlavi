import Link from "next/link";
import { Paper, Stack, Text } from "@mantine/core";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="container">
      <AuthShell
        description="Registration is handled with a custom route on top of Auth.js so that newly created users can immediately access their own dashboard."
        eyebrow="Create an editor account"
        title="Register for Inkspire"
      >
        <Paper p="xl" radius="lg" shadow="sm" withBorder>
          <Stack>
            <RegisterForm />
            <Text c="dimmed" size="sm">
              Already registered? <Link href="/login">Sign in instead.</Link>
            </Text>
          </Stack>
        </Paper>
      </AuthShell>
    </div>
  );
}
