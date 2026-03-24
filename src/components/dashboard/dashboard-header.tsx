import { Button, Group, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type DashboardHeaderProps = {
  userLabel: string;
  onCreate: () => void;
  onSignOut: () => void;
};

export function DashboardHeader({
  onCreate,
  onSignOut,
  userLabel,
}: DashboardHeaderProps) {
  return (
    <Group className="dashboard-bar magazine-dashboard-bar" justify="space-between">
      <div className="dashboard-bar-copy">
        <span className="eyebrow">Editor studio</span>
        <Text className="dashboard-bar-title" fw={700}>
          Studio Inkspire
        </Text>
        <Text c="dimmed" size="sm">
          {userLabel}
        </Text>
      </div>
      <Group className="dashboard-toolbar">
        <Button leftSection={<IconPlus size={16} />} onClick={onCreate}>
          Nový článek
        </Button>
        <Button onClick={onSignOut} variant="default">
          Odhlásit se
        </Button>
      </Group>
    </Group>
  );
}
