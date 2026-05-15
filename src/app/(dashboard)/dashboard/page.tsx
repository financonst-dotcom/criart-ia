import { DashboardStats } from "@/components/dashboard/stats";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentGenerations } from "@/components/dashboard/recent-generations";
import { RecentProjects } from "@/components/dashboard/recent-projects";

export const metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bom dia! 👋</h1>
        <p className="text-muted-foreground mt-1">
          Você tem <span className="text-brand-400 font-medium">10 créditos</span> disponíveis. O que vamos criar hoje?
        </p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Quick actions */}
      <QuickActions />

      {/* Recent content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentGenerations />
        <RecentProjects />
      </div>
    </div>
  );
}
