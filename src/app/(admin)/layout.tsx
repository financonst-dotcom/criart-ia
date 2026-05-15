import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import Link from "next/link";
import { LayoutDashboard, Users, CreditCard, Zap, Settings, BarChart3, Shield } from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuários", icon: Users },
  { href: "/admin/generations", label: "Gerações", icon: Zap },
  { href: "/admin/billing", label: "Faturamento", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } });
  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-56 border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-400" />
            </div>
            <span className="font-bold text-sm">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:bg-accent transition-colors">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
