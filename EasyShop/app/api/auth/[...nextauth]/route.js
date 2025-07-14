import connectDB from "@/app/config/db";
import User from "@/app/models/user";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const authOptions = NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return user; // attaches to session.token.sub
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDB();

      try {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          // Create new user
          await User.create({
            name: user.name,
            email: user.email,
            imageUrl: user.image,
          });
          // console.log("✅ New user saved");
        } else {
          // Update user if info changed
          if (
            existingUser.name !== user.name ||
            existingUser.imageUrl !== user.image
          ) {
            existingUser.name = user.name;
            existingUser.role = 'seller';
            if (user.image) existingUser.imageUrl = user.image;
            await existingUser.save();
            // console.log("🔄 User updated");
          }
        }

        return true; // allow sign in
      } catch (err) {
        console.error("❌ Error in signIn callback:", err);
        return false;
      }
    },
    // 🔑 Add this for JWT 
    async jwt({ token, user }) {
      if (user) {
        // On initial sign in
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        token.role = dbUser?.role || "buyer";
        token._id = dbUser?._id.toString();
      }
      return token;
    },

    // 🧠 session => exposed to client via useSession
    async session({ session, token}) {
      if(!session.user.image){
         const dbUser = await User.findOne({ email: token.email });
         session.user.image = dbUser.imageUrl;
      }
      session.user.role = token.role;
      session.user._id = token._id;
      return session;
    },
  },
});

export { authOptions as GET, authOptions as POST, authOptions };
