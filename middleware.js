import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    // 1. Agar user logged in hai aur login/register page par jaane ki koshish kare, toh use direct dashboard bhej do
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Yeh authorized function true return karega toh hi user aage badh payega
      authorized: ({ token, req }) => {
        const isProtectedPage = req.nextUrl.pathname.startsWith("/dashboard");
        
        // Agar page dashboard hai, toh token (session) hona mandatory hai
        if (isProtectedPage) {
          return !!token; // returns true if token exists, else false
        }
        
        // Baki public pages ke liye access open rakho
        return true;
      },
    },
  }
);

// 🛠️ CONFIG: Next.js ko batao ki kis-kis paths par ye middleware check lagana hai
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};