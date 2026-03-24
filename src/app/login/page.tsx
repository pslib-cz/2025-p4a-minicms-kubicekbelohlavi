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
        description="Vstupte do chráněného studia, kde můžete vytvářet, upravovat, publikovat a mazat jen svůj vlastní obsah."
        eyebrow="Přihlášení do redakčního studia"
        title="Otevřít editor studio"
      >
        <Paper p="xl" radius="lg" shadow="sm" withBorder>
          <Stack>
            <LoginForm callbackUrl={callbackUrl} />
            <Text c="dimmed" size="sm">
              Ještě nemáte účet? <Link href="/register">Založte si ho tady.</Link>
            </Text>
          </Stack>
        </Paper>
      </AuthShell>
    </div>
  );
}
