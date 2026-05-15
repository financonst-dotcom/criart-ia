import { prisma } from "@/lib/prisma";

export default async function AdminGenerationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const typeFilter = params.type || "";
  const statusFilter = params.status || "";
  const page = parseInt(params.page || "1");
  const pageSize = 25;

  const where: Record<string, unknown> = {};
  if (typeFilter) where.type = typeFilter;
  if (statusFilter) where.status = statusFilter;

  const [generations, total] = await Promise.all([
    prisma.generation.findMany({
      where,
      take: pageSize,
      skip: (page - 1) * pageSize,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.generation.count({ where }),
  ]);

  const typeStats = await prisma.generation.groupBy({
    by: ["type"],
    _count: true,
    orderBy: { _count: { type: "desc" } },
  });

  const totalPages = Math.ceil(total / pageSize);

  const GENERATION_TYPES = [
    "OUTFIT_SWAP", "AVATAR_CREATION", "BACKGROUND_SWAP", "PRODUCT_PHOTO",
    "CAMPAIGN", "UPSCALE", "REMOVE_BG", "VIRTUAL_TRYON", "POSE_CHANGE",
    "MOCKUP", "VIDEO", "CATALOG", "SOCIAL_PACK",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gerações</h1>
        <p className="text-sm text-muted-foreground">{total.toLocaleString("pt-BR")} gerações no total</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {typeStats.slice(0, 5).map((s) => (
          <div key={s.type} className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-lg font-bold">{s._count}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.type.replace("_", " ")}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <a href="?" className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${!typeFilter ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-border hover:bg-accent"}`}>
          Todos
        </a>
        {GENERATION_TYPES.map((t) => (
          <a key={t} href={`?type=${t}`}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${typeFilter === t ? "border-brand-500 bg-brand-500/10 text-brand-400" : "border-border hover:bg-accent"}`}>
            {t.replace("_", " ")}
          </a>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usuário</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Créditos</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {generations.map((gen) => (
              <tr key={gen.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-xs">{gen.user.name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{gen.user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                    {gen.type.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    gen.status === "COMPLETED" ? "bg-green-500/10 text-green-400" :
                    gen.status === "FAILED" ? "bg-red-500/10 text-red-400" :
                    "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {gen.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{gen.creditsUsed}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(gen.createdAt).toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a href={`?type=${typeFilter}&page=${page - 1}`}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors">
                Anterior
              </a>
            )}
            {page < totalPages && (
              <a href={`?type=${typeFilter}&page=${page + 1}`}
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
