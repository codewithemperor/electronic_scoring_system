import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // First try to find user in User table (for admin, staff, examiner)
        let user = await db.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (user) {
          if (!user.isActive) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          // Update last login
          await db.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          })

          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          }
        }

        // If not found in User table, try Candidate table
        const candidate = await db.candidate.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { registrationNumber: credentials.email }
            ]
          }
        })

        if (candidate) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            candidate.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: candidate.id,
            email: candidate.email,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            role: "CANDIDATE",
            registrationNumber: candidate.registrationNumber,
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.firstName = user.firstName
        token.lastName = user.lastName
        if ("registrationNumber" in user) {
          token.registrationNumber = user.registrationNumber
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        if (token.registrationNumber) {
          session.user.registrationNumber = token.registrationNumber as string
        }
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
}