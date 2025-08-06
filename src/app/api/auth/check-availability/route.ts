
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/User"
import connectToDatabase from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { field, value } = await request.json()

    if (!field || !value) {
      return NextResponse.json(
        { message: "Champ et valeur requis" },
        { status: 400 }
      )
    }

    await connectToDatabase()

    let query = {}
    let fieldName = ""

    // Field validation
    if (field === "name") {
      query = { name: value }
      fieldName = "nom d'utilisateur"
    } else if (field === "email") {
      query = { email: value.toLowerCase() }
      fieldName = "email"
    } else {
      return NextResponse.json(
        { message: "Champ non valide" },
        { status: 400 }
      )
    }

    // 
    const existingUser = await User.findOne(query)

    if (existingUser) {
      return NextResponse.json({
        available: false,
        message: `Ce ${fieldName} est déjà utilisé`
      }, { status: 200 })
    }

    if (field === "name") {
      if (value.length < 3) {
        return NextResponse.json({
          available: false,
          message: "Le pseudo doit contenir au moins 3 caractères"
        }, { status: 200 })
      }

      if (value.length > 20) {
        return NextResponse.json({
          available: false,
          message: "Le pseudo ne peut pas dépasser 20 caractères"
        }, { status: 200 })
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
        return NextResponse.json({
          available: false,
          message: "Le pseudo ne peut contenir que des lettres, chiffres, - et _"
        }, { status: 200 })
      }

      const forbiddenNames = [
        "admin", "administrator", "root", "user", "test", "demo", "api", "www", 
        "mail", "email", "support", "help", "info", "contact", "about", "login",
        "register", "signup", "signin", "logout", "profile", "account", "settings",
        "dreamology", "dream", "moderator", "mod", "staff", "official", "bot",
        "system", "service", "null", "undefined", "true", "false"
      ]

      if (forbiddenNames.includes(value.toLowerCase())) {
        return NextResponse.json({
          available: false,
          message: "Ce nom d'utilisateur est réservé"
        }, { status: 200 })
      }
    }

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return NextResponse.json({
          available: false,
          message: "Format d'email invalide"
        }, { status: 200 })
      }
    }
    // If we reach here, the field is available
    return NextResponse.json({
      available: true,
      message: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} disponible`
    }, { status: 200 })

  } catch (error) {
    console.error("Check availability error:", error)
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}