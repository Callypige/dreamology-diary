// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/User"
import connectToDatabase from "@/lib/mongodb"
import { sendWelcomeEmail } from "@/lib/emailService"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { message: "Token de vérification requis" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }, 
    })

    if (!user) {
      const expiredUser = await User.findOne({
        emailVerificationToken: token,
      })

      if (expiredUser) {
        return NextResponse.json(
          { message: "Le lien de vérification a expiré" },
          { status: 410 } // Gone
        )
      }

      return NextResponse.json(
        { message: "Token de vérification invalide" },
        { status: 400 }
      )
    }

    user.emailVerified = true
    user.emailVerificationToken = undefined
    user.emailVerificationExpires = undefined
    await user.save()

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name)

    return NextResponse.json(
      { 
        message: "Email vérifié avec succès !",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          emailVerified: true
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}