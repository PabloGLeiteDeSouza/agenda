import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const protectedPaths = ["/", "/dashboard", "/admin"];
  const shouldProtect = protectedPaths.some((p) => path.startsWith(p));

  if (!shouldProtect) return NextResponse.next();

  // Verificando cookies de forma segura
  const token = req.cookies.has("__Secure-next-auth.session-token")
    ? req.cookies.get("__Secure-next-auth.session-token")?.value
    : req.cookies.has("next-auth.session-token")
    ? req.cookies.get("next-auth.session-token")?.value
    : null;

  // Evitar loop de redirecionamento
  if (!token && path !== "/sign-in") {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
  }

  return NextResponse.next();
}