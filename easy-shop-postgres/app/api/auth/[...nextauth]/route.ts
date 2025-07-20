import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const authOptions = NextAuth({
  // adapter: PrismaAdapter(prisma),
  // secret: process.env.NEXTAUTH_SECRET,
  // session: {
  //   strategy: "jwt",
  // },
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const { name, email, image } = user;
        if (email && name) {
          const existingUser = await prisma.user.findUnique({
            where: { email },
          });
          if (!existingUser) {
            await prisma.user.create({
              data: {
                name,
                email,
                imageUrl: image,
                role: "seller",
              },
            });
          } else {
            console.error("❌ User already saved in DB as seller.");
          }
        }
        return true; //
      } catch (err) {
        console.error("❌ Error in signIn callback:", err);
        return false;
      }
    },
    async jwt({ token, user }) {
      console.log("token", token, "User", user);
      return token;
    },
    // 🧠 session => exposed to client via useSession
    async session({ session, token}) {
      const existingUser = await prisma.user.findUnique({
            where: { email: token.email || '' },
          });
      session.user.role = existingUser?.role
      return session;
    }
  },
});

export { authOptions as GET, authOptions as POST, authOptions };
