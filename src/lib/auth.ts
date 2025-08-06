import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb"; 

export const authOptions: NextAuthOptions = {
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabase();

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Utilisateur non trouvé");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          
          if (!isValid) {
            throw new Error("Mot de passe incorrect");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
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
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};