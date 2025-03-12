import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoose from "mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: MongoDBAdapter(mongoose.connection.getClient()), 
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          throw new Error("Email et mot de passe requis !");
        }

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("Utilisateur non trouvé !");
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
          throw new Error("Mot de passe incorrect !");
        }

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
