import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ message: "Logout realizado" });
  response.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return response;
}
