import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "24");
    const type = searchParams.get("type");
    const projectId = searchParams.get("projectId");
    const onlyFavorited = searchParams.get("favorited") === "true";

    const where = {
      userId: session.userId,
      status: "COMPLETED" as const,
      ...(type && { type: type as any }),
      ...(projectId && { projectId }),
      ...(onlyFavorited && { isFavorited: true }),
    };

    const [generations, total] = await Promise.all([
      prisma.generation.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.generation.count({ where }),
    ]);

    return NextResponse.json({ data: generations, total, page, pageSize, hasMore: total > page * pageSize });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
