
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Instagram from "next-auth/providers/instagram"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import Credentials from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Facebook,
    Instagram,
    Credentials({
        credentials: {
            login: {
              type: "text",
              label: "Login",
              placeholder: "johndoe@gmail.com or teste",
            },
            password: {
              type: "password",
              label: "Password",
              placeholder: "*****",
            },
        },
        authorize: async (credentials) => {
            let user = null
            if (!credentials.login) {
                return null;
            }
            if (!credentials.password) {
                return null;
            }
            if ((credentials.login as string).includes("@")) {
                const validate_password = (credentials.password as string);
                const user = prisma.user.findUnique({ where: { email: (credentials.login as string) } })
                
            } else {
                const validate_password = (credentials.password as string);
                const user = prisma.user.findUnique({ where: { username: (credentials.login as string) } })
            
            }
            // logic to salt and hash password
            const pwHash = saltAndHashPassword(credentials.password)
     
            // logic to verify if the user exists
            user = await getUserFromDb(credentials.email, pwHash)
     
            if (!user) {
              // No user found, so this is their first attempt to login
              // Optionally, this is also the place you could do a user registration
              throw new Error("Invalid credentials.")
            }
     
            // return user object with their profile data
            return user
        },
    })
  ],
  pages: {
    signIn: "/sign-in",
    newUser: "/sign-up",
  },

})