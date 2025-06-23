import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import User from "@/models/user";
import connectToDatabase from "@/libs/mongodb";


export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();

          const user = await User.findOne({ email: credentials?.email });
          if (!user) throw new Error("Utilisateur non trouvé");

          const isValid = await bcrypt.compare(
            credentials?.password ?? "",
            user.password
          );
          if (!isValid) throw new Error("Mot de passe incorrect");

          return user;
        } catch (err) {
          console.error("Erreur d'authentification :", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,     
          email: token.email,
          name: token.name,
          image: token.picture,
        } as typeof session.user & { id: string };;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
