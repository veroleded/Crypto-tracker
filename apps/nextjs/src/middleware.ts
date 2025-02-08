import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  try {
    // Create a response object to modify
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    // Create supabase server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name, options) {
            request.cookies.set({ name, value: "", ...options });
            response.cookies.set({ name, value: "", ...options });
          },
        },
      },
    );

    // Refresh session if expired
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError) {
      throw sessionError;
    }

    // Get URL information
    const url = new URL(request.url);
    const isAuthPage =
      url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/auth/");
    const isPublicRoute =
      url.pathname === "/error" ||
      url.pathname.startsWith("/_next") ||
      url.pathname.startsWith("/static") ||
      url.pathname.startsWith("/api/trpc");

    // Handle authentication routing
    if (session) {
      // Logged in users shouldn't access auth pages
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      // Non-logged in users can only access public routes and auth pages
      if (!isAuthPage && !isPublicRoute) {
        const redirectUrl = new URL("/sign-in", request.url);
        redirectUrl.searchParams.set("redirect", url.pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }

    return response;
  } catch (error) {
    // If there's an error, redirect to error page
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
