import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
});

export { authOptions as GET, authOptions as POST };
