import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (req.nextUrl.pathname.startsWith("/api/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const decodedToken = await jwtVerify(token, secret);
      const user_id = decodedToken.payload.user_id as string;
      const email = decodedToken.payload.email as string;

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("user_id", user_id);
      requestHeaders.set("email", email);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.log(error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
