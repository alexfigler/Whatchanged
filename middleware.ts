import { NextResponse, type NextRequest } from "next/server";

// Gate /admin and /admin/* behind HTTP Basic Auth using ADMIN_PASSWORD.
// Username can be anything; only the password is checked.
export function middleware(req: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return new NextResponse("ADMIN_PASSWORD not set on server.", {
      status: 500,
    });
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const idx = decoded.indexOf(":");
      const password = idx >= 0 ? decoded.slice(idx + 1) : "";
      if (password === expected) {
        return NextResponse.next();
      }
    } catch {
      // fall through to challenge
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="What Changed Admin"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
