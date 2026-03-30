import Link from "next/link";
import { Paper, Stack, Text } from "@mantine/core";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="container">
      <AuthShell
        description="Vytvořte si identitu v multiverzálním systému — nové účty získají okamžitý přístup do Spider-Studia."
        eyebrow="Nová Spider-identita"
        title="Zaregistrujte se do multiverzálního editoru"
      >
        <Paper p="xl" radius="lg" shadow="sm" withBorder>
          <Stack>
            <RegisterForm />
            <Text c="dimmed" size="sm">
              Už máte identitu? <Link href="/login">Přejděte na přihlášení.</Link>
            </Text>
          </Stack>
        </Paper>
      </AuthShell>
    </div>
  );
}
