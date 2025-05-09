// app/api/auth/[...nextauth]/route.ts
export const runtime = "nodejs";

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Instagram from "next-auth/providers/instagram";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma"; // ajuste esse import conforme o seu path
import Credentials from "next-auth/providers/credentials";
import Libsodium from "@/lib/libsodium";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },
  providers: [
    Google,
    Facebook,
    Instagram,
    Credentials({
      credentials: {
        login: { type: "text", label: "Login", placeholder: "email or username" },
        password: { type: "password", label: "Password", placeholder: "*****" },
      },
      authorize: async (credentials) => {
        const { login, password } = credentials;

        if (!login || !password) return null;

        const isEmail = (login as string).includes("@");
        const user = await prisma.user.findUnique({ where: isEmail ? { email: login } : { username: login } });

        if (!user?.password || !user?.private_key_auth || !user?.public_key_auth) return null;

        const libsodium = new Libsodium();
        const valid = await libsodium.validate_password_keypair((password as string), user.password, user.private_key_auth, user.public_key_auth);

        return valid ? user : null;
      },
    }),
  ],
});
