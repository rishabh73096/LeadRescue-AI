export interface DashboardData {
  account: { name: string; avatar?: string };
  badges: { notifications: number };
  help: { title: string; description: string; cta: string; href: string };
}
