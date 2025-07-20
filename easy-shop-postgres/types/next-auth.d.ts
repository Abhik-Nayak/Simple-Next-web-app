import NextAuth, { DefaultSession } from "next-auth";

// If you always expect session.user to exist and want full typing support (e.g., for .role), you can augment the NextAuth types.
declare module "next-auth" {
  interface Session {
    user: {
      role?: string; // Add any custom fields here
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}
