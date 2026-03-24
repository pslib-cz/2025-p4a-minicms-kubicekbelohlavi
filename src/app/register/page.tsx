import Link from "next/link";
import { Paper, Stack, Text } from "@mantine/core";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="container">
      <AuthShell
        description="Registrace běží přes vlastní route nad Auth.js, takže nové účty můžou rovnou vstoupit do vlastního redakčního studia."
        eyebrow="Založit redakční identitu"
        title="Vytvořit účet pro Inkspire"
      >
        <Paper p="xl" radius="lg" shadow="sm" withBorder>
          <Stack>
            <RegisterForm />
            <Text c="dimmed" size="sm">
              Už účet máte? <Link href="/login">Přejděte na přihlášení.</Link>
            </Text>
          </Stack>
        </Paper>
      </AuthShell>
    </div>
  );
}
