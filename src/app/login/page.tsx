import Link from "next/link";
import { Paper, Stack, Text } from "@mantine/core";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { resolveAuthErrorMessage } from "@/lib/auth-error";
import { isDiscordAuthEnabled } from "@/lib/discord-auth";

type SearchParams = Promise<{
  callbackUrl?: string;
  error?: string;
}>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolved = await searchParams;
  const callbackUrl = resolved.callbackUrl || "/dashboard";
  const authError = resolveAuthErrorMessage(resolved.error);
  const discordEnabled = isDiscordAuthEnabled();

  return (
    <div className="container">
      <AuthShell
        description="Vstupte do Spider-Studia, kde spravujete panely z vaší dimenze — vytvářejte, upravujte a publikujte vlastní příběhy."
        eyebrow="Přihlášení do Spider-Studia"
        title="Vstupte do multiverzálního editoru"
      >
        <Paper p="xl" radius="lg" shadow="sm" withBorder>
          <Stack>
            <LoginForm
              authError={authError}
              callbackUrl={callbackUrl}
              discordEnabled={discordEnabled}
            />
            <Text c="dimmed" size="sm">
              Ještě nemáte identitu? <Link href="/register">Založte si ji tady.</Link>
            </Text>
          </Stack>
        </Paper>
      </AuthShell>
    </div>
  );
}
