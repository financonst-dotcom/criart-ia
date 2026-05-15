import { prisma } from "@/lib/prisma";
import { Search } from "lucide-react";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const page = parseInt(params.page || "1");
  const pageSize = 20;

  const where = q
    ? { OR: [{ email: { contains: q, mode: "insensitive" as const } }, { name: { contains: q, mode: "insensitive" as const } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: "desc" },
      include: { subscription: { select: { plan: true, status: true } } },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Usuários</h1>
          <p className="text-sm text-muted-foreground">{total.toLocaleString("pt-BR")} usuários cadastrados</p>
        </div>
        <form className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nome ou email..."
            className="pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm w-72 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          />
        </form>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usuário</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plano</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Créditos</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Cadastro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{user.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.subscription?.plan === "PRO" ? "bg-orange-500/15 text-orange-400" :
                    user.subscription?.plan === "BUSINESS" ? "bg-purple-500/15 text-purple-400" :
                    user.subscription?.plan === "ENTERPRISE" ? "bg-blue-500/15 text-blue-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {user.subscription?.plan || "FREE"}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm">{user.credits}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.role === "ADMIN" ? "bg-red-500/15 text-red-400" : "bg-muted text-muted-foreground"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={`?q=${q}&page=${page - 1}`}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors">
                Anterior
              </a>
            )}
            {page < totalPages && (
              <a href={`?q=${q}&page=${page + 1}`}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors">
                Próxima
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
