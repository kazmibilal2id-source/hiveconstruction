import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const backendApi =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  "https://hiveconstruction.onrender.com/api";

type BackendAuthResponse = {
  success: boolean;
  data?: {
    user: {
      _id: string;
      email: string;
      fullName: string;
      role: string;
      status: string;
    };
    token: string;
  };
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await fetch(`${backendApi}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password
          })
        });

        const payload = (await response.json()) as BackendAuthResponse;

        if (!response.ok || !payload.success || !payload.data) {
          return null;
        }

        const { user, token } = payload.data;

        return {
          id: user._id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          status: user.status,
          accessToken: token
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as {
          id: string;
          email?: string | null;
          name?: string | null;
          role?: string;
          status?: string;
          accessToken?: string;
        };

        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = typedUser.role;
        token.status = typedUser.status;
        token.accessToken = typedUser.accessToken;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.role = (token.role as string) || "visitor";
        session.user.status = (token.status as string) || "pending";
      }
      session.accessToken = (token.accessToken as string) || "";
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET
};
