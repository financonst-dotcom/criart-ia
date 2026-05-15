import { prisma } from "@/lib/prisma";
import { Users, Zap, CreditCard, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [totalUsers, totalGenerations, activeSubscriptions, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.generation.count(),
    prisma.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
    prisma.creditTransaction.aggregate({
      _sum: { amount: true },
      where: { type: "PURCHASE" },
    }),
  ]);

  const recentGenerations = await prisma.generation.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, credits: true, createdAt: true },
  });

  return { totalUsers, totalGenerations, activeSubscriptions, totalRevenue: totalRevenue._sum.amount || 0, recentGenerations, recentUsers };
}

export default async function AdminPage() {
  const stats = await getStats();

  const cards = [
    { label: "Usuários totais", value: stats.totalUsers.toLocaleString("pt-BR"), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Gerações totais", value: stats.totalGenerations.toLocaleString("pt-BR"), icon: Zap, color: "text-orange-400", bg: "bg-orange-500/10" },
    { label: "Assinantes ativos", value: stats.activeSubscriptions.toLocaleString("pt-BR"), icon: CreditCard, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Créditos vendidos", value: stats.totalRevenue.toLocaleString("pt-BR"), icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">Últimas Gerações</h2>
          <div className="space-y-3">
            {stats.recentGenerations.map((gen) => (
              <div key={gen.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{gen.user.name || gen.user.email}</p>
                  <p className="text-xs text-muted-foreground">{gen.type} · {gen.creditsUsed} cr</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  gen.status === "COMPLETED" ? "bg-green-500/10 text-green-400" :
                  gen.status === "FAILED" ? "bg-red-500/10 text-red-400" :
                  "bg-yellow-500/10 text-yellow-400"
                }`}>
                  {gen.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-semibold mb-4">Novos Usuários</h2>
          <div className="space-y-3">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{user.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{user.credits} cr</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
