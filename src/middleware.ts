import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/api/auth"];
const AUTH_PATHS = ["/login", "/register", "/forgot-password"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isApiPublic = pathname.startsWith("/api/auth");
  const isApiWebhook = pathname.startsWith("/api/billing/webhook");
  const isDashboard = pathname.startsWith("/dashboard");
  const isAuthPath = AUTH_PATHS.includes(pathname);

  if (isApiPublic || isApiWebhook) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth-token")?.value;
  const session = token ? await verifyToken(token) : null;

  // Redirect authenticated users away from auth pages
  if (session && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard routes
  if (isDashboard && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect API routes (except public ones)
  if (pathname.startsWith("/api") && !isApiPublic && !session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|images|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
