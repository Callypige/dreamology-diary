import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server'
import User from '@/models/User'
import connectToDatabase from '@/lib/mongodb';
import Profile from "@/models/Profile";
import { sendVerificationEmail } from '@/lib/emailService';
import crypto from 'crypto';

// Interfaces for typing MongoDB and Mongoose errors
interface MongoServerError extends Error {
    name: 'MongoServerError';
    code: number;
    keyPattern: Record<string, number>;
    keyValue: Record<string, string>;
}

interface ValidationError extends Error {
    name: 'ValidationError';
    errors: Record<string, {
        message: string;
        kind: string;
        path: string;
        value: unknown;
    }>;
}

// Interface for request body data
interface SignupRequestBody {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Type guard to check if it's a MongoDB error
const isMongoServerError = (error: unknown): error is MongoServerError => {
    return (
        typeof error === 'object' && 
        error !== null && 
        'name' in error && 
        'code' in error &&
        'keyValue' in error &&
        typeof (error as MongoServerError).code === 'number' &&
        (error as MongoServerError).name === 'MongoServerError'
    );
};

// Type guard to check if it's a Mongoose validation error
const isValidationError = (error: unknown): error is ValidationError => {
    return (
        typeof error === 'object' && 
        error !== null && 
        'name' in error && 
        'errors' in error &&
        (error as ValidationError).name === 'ValidationError'
    );
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(request: Request) {
    const { name, email, password, confirmPassword }: SignupRequestBody = await request.json();

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
        
        // Handle MongoDB duplicate key errors
        if (isMongoServerError(error) && error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            const value = error.keyValue[field];

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
        
        // Handle Mongoose validation errors
        if (isValidationError(error)) {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({
                message: "Erreur de validation",
                errors: validationErrors
            }, { status: 400 });
        }

        // Generic error handling
        return NextResponse.json({
            message: "Erreur lors de la création du compte",
            error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : "INTERNAL_ERROR"
        }, { status: 500 });
    }
}