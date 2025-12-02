'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function VerifyEmailContent() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
    const [message, setMessage] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    // Use useCallback to memoize the verifyEmail function
    const verifyEmail = useCallback(async (token: string) => {
        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                // Redirect to sign-in after 3 seconds
                setTimeout(() => {
                    router.push('/auth/sign-in');
                }, 3000);
            } else {
                setStatus(data.error === 'TOKEN_EXPIRED' ? 'expired' : 'error');
                setMessage(data.message);
            }
        } catch {
            setStatus('error');
            setMessage('Erreur lors de la vérification');
        }
    }, [router]);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token de vérification manquant');
            return;
        }

        verifyEmail(token);
    }, [token, verifyEmail]);

    const resendEmail = async () => {
        // Implement resend email functionality
        try {
            const response = await fetch('/api/auth/resend-verification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (response.ok) {
                setStatus('success');
                setMessage('Email de vérification renvoyé avec succès !');
            } else {
                setStatus('error');
                setMessage(data.message);
            }   
        } catch {
            setStatus('error');
            setMessage('Erreur lors de l\'envoi de l\'email de vérification');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        Vérification de votre email
                    </h2>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    {status === 'loading' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Vérification en cours...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-green-800">Email vérifié avec succès !</h3>
                            <p className="mt-2 text-gray-600">{message}</p>
                            <p className="mt-2 text-sm text-gray-500">Redirection vers la page de connexion dans 3 secondes...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-red-800">Erreur de vérification</h3>
                            <p className="mt-2 text-gray-600">{message}</p>
                            <button 
                                onClick={() => router.push('/auth/sign-in')}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Retour à la connexion
                            </button>
                        </div>
                    )}

                    {status === 'expired' && (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold text-yellow-800">Token expiré</h3>
                        <p className="mt-2 text-gray-600">{message}</p>
                        <button 
                            onClick={resendEmail}
                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Renvoyer l&#39;email de vérification
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
);
}
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-white text-lg">Chargement...</div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}