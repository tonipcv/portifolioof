import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      subscriptionStatus?: string
      emailVerified?: Date | null
      whatsappVerified?: boolean
      whatsapp?: string
    }
  }

  interface User {
    id: string
    email?: string | null
    name?: string | null
    image?: string | null
    subscriptionStatus?: string
    whatsappVerified?: boolean
    whatsapp?: string
  }
} 