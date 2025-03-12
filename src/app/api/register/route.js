import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoDB from "@/libs/mongodb";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email, password, confirmPassword } = await request.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json({ error: "Tous les champs sont requis !" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Les mots de passe ne correspondent pas !" }, { status: 400 });
    }

    await connectMongoDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé !" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword });

    return NextResponse.json({ message: `Utilisateur ${newUser.email} créé avec succès !` }, { status: 201 });
  } catch (error) {
    console.error("❌ Erreur MongoDB:", error);
    return NextResponse.json({ error: "Erreur lors de l'inscription !" }, { status: 500 });
  }
}
