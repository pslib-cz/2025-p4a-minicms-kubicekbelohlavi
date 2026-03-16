import Link from "next/link";
import { Paper, Stack, Text } from "@mantine/core";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

type SearchParams = Promise<{
  callbackUrl?: string;
}>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolved = await searchParams;
  const callbackUrl = resolved.callbackUrl || "/dashboard";

  return (
    <div className="container">
      <AuthShell
        description="Use the protected editorial workspace to create, edit, publish and delete only your own content."
        eyebrow="Auth.js credentials sign-in"
        title="Sign in to the dashboard"
      >
        <Paper p="xl" radius="lg" shadow="sm" withBorder>
          <Stack>
            <LoginForm callbackUrl={callbackUrl} />
            <Text c="dimmed" size="sm">
              Need an account? <Link href="/register">Create one here.</Link>
            </Text>
          </Stack>
        </Paper>
      </AuthShell>
    </div>
  );
}
