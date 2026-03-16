import { DashboardScreen } from "@/components/dashboard/dashboard-screen";
import { requireUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireUser();

  return <DashboardScreen user={user} />;
}
