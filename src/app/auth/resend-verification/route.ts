import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/emailService';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email requis" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "Aucun compte trouvé avec cet email" },
                { status: 404 }
            );
        }
        // if the user already has a verified email, no need to resend
        if (user.emailVerified) {
            return NextResponse.json(
                { message: "Votre email est déjà vérifié" },
                { status: 400 }
            );
        }

        // Generate a new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        // Update the user with the new token
        user.emailVerificationToken = verificationToken;
        user.emailVerificationExpires = tokenExpiry;
        await user.save();

        // Send the verification email
        const emailResult = await sendVerificationEmail(email, verificationToken, user.name);

        if (!emailResult.success) {
            console.error('Erreur envoi email:', emailResult.error);
            return NextResponse.json(
                { message: "Erreur lors de l'envoi de l'email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Email de vérification envoyé avec succès" },
            { status: 200 }
        );

    } catch (error) {
        console.error('❌ Erreur resend verification:', error);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}