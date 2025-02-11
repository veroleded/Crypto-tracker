import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Create a response object to modify
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            // If we're setting a cookie, update the response with it
            request.cookies.set({ name, value, ...options });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({ name, value, ...options });
          },
          remove(name, options) {
            request.cookies.delete(name);
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.delete(name);
          },
        },
      }
    );

    // Refresh session if expired - this will update cookies
    await supabase.auth.getSession();

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

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
