import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';
import { sendPasswordResetEmail } from '@/lib/emailService';
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
            // If no user found, we still respond positively to avoid email enumeration
            return NextResponse.json(
                { message: "Si cet email existe, un lien de récupération a été envoyé" },
                { status: 200 }
            );
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Save the token to the user
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = tokenExpiry;
        await user.save();

        // Send the password reset email
        const emailResult = await sendPasswordResetEmail(email, resetToken, user.name);

        if (!emailResult.success) {
            console.error('Erreur envoi email reset:', emailResult.error);
            return NextResponse.json(
                { message: "Erreur lors de l'envoi de l'email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Si cet email existe, un lien de récupération a été envoyé" },
            { status: 200 }
        );

    } catch (error) {
        console.error('❌ Erreur forgot password:', error);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}