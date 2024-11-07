import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: {
    signIn: "/login",
  },
})

export const config = {
  matcher: [
    "/portfolios/:path*",
    "/api/portfolio/:path*",
    "/api/crypto/:path*",
  ]
} 