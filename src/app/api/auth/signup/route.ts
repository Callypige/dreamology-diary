import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb';
import Profile from "@/models/Profile";
import { sendVerificationEmail } from '@/lib/emailService';
import crypto from 'crypto';

const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
}

export async function POST(request: Request) {
    const { name, email, password, confirmPassword } = await request.json();


    if (!name || !email || !password || !confirmPassword) {
        return NextResponse.json({message: "Tous les champs sont requis"}, {status:400})
    }

    if (!isValidEmail(email)) {
        return NextResponse.json({ message: "Format d'email invalide" }, { status: 400 });
    }
    
    if (confirmPassword !== password) {
        return NextResponse.json({message:"Les mots de passe ne correspondent pas"}, { status:400})
    }
    
    if (password.length < 6) {
        return NextResponse.json({ message: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }

    try {
        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Un utilisateur avec cet email existe déjà" }, { status: 400 });
        }

        // Check if a profile with the same email already exists
        const existingProfile = await Profile.findOne({ email });
        if (existingProfile) {
            return NextResponse.json({ message: "Un profil avec cet email existe déjà" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token and expiry
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            emailVerified: false,
            emailVerificationToken: verificationToken,
            emailVerificationExpires: tokenExpiry,
        });
        await newUser.save();

        // Create user profile
        await Profile.create({
            user: newUser._id,
            name: newUser.name, 
            email: newUser.email,
            bio: "",
            avatarUrl: "",
            location: "",
        });

        const emailResult = await sendVerificationEmail(email, verificationToken, name);
        
        if (!emailResult.success) {
            console.warn('⚠️ Email non envoyé mais inscription réussie');
        }

        return NextResponse.json({ 
            message: "Compte créé avec succès ! Vérifiez votre email pour activer votre compte." 
        }, { status: 201 });

    } catch (error) {
        console.error('Signup error:', error);
        // Handle duplicate key errors
        if (typeof error === 'object' && error !== null) {
            if ((error as any).name === 'MongoServerError' && (error as any).code === 11000) {
                const field = Object.keys((error as any).keyValue)[0];
                const value = (error as any).keyValue[field];

                if (field === 'email') {
                    return NextResponse.json({
                        message: `Un compte avec l'email "${value}" existe déjà.`,
                        error: "DUPLICATE_EMAIL"
                    }, { status: 400 });
                }

                return NextResponse.json({
                    message: `Valeur dupliquée détectée pour le champ "${field}".`,
                    error: "DUPLICATE_KEY"
                }, { status: 400 });
            }
            // ValidationError handling
            if ((error as any).name === 'ValidationError') {
                const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
                return NextResponse.json({
                    message: "Erreur de validation",
                    errors: validationErrors
                }, { status: 400 });
            }
        }

        return NextResponse.json({
            message: "Erreur lors de la création du compte",
            error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : "INTERNAL_ERROR"
        }, { status: 500 });
    }
}