import { compare } from "bcryptjs";
import type { NextAuthOptions, Session } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import {
  resolveSessionSafely,
  shouldIgnoreAuthLoggerError,
} from "@/lib/auth-session";
import { loginSchema } from "@/lib/validation/auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  logger: {
    error(code, metadata) {
      if (shouldIgnoreAuthLoggerError(code, metadata)) {
        console.warn(
          "[next-auth][warn][JWT_SESSION_ERROR] Ignoring stale or invalid session cookie.",
        );
        return;
      }

      console.error(
        `[next-auth][error][${code}]`,
        `\nhttps://next-auth.js.org/errors#${code.toLowerCase()}`,
        metadata instanceof Error ? metadata.message : undefined,
        metadata,
      );
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Heslo", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await compare(parsed.data.password, user.passwordHash);

        if (!isValid || !user.email) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      return session;
    },
  },
};

export async function getCurrentSession(): Promise<Session | null> {
  return resolveSessionSafely<Session>(() => getServerSession(authOptions));
}

export async function getCurrentUser() {
  const session = await getCurrentSession();

  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
