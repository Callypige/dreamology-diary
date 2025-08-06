interface VerificationEmailParams {
  username: string;
  verificationUrl: string;
}

export const verificationEmailTemplate = ({ username, verificationUrl }: VerificationEmailParams) => {
  return {
    subject: "🌙 Vérifiez votre compte Somni Dreamology",
    
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Vérifiez votre compte</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #f8fafc;
          }
          .container { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            padding: 40px; 
            border-radius: 15px; 
            text-align: center; 
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .content { 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            margin: 20px 0; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          .button { 
            display: inline-block; 
            background: #4F46E5; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: bold; 
            margin: 20px 0;
            transition: background-color 0.3s;
          }
          .button:hover {
            background: #3730A3;
          }
          .footer { 
            color: #64748b; 
            font-size: 14px; 
            margin-top: 20px; 
          }
          .cat-emoji { 
            font-size: 3rem; 
            margin-bottom: 10px; 
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            color: #92400e;
            padding: 10px;
            border-radius: 6px;
            margin: 15px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="cat-emoji">🌙</div>
          <h1 style="color: white; margin: 0; font-size: 28px;">Dreamology Tools</h1>
          <p style="color: #e2e8f0; margin: 10px 0 0 0;">Votre journal de rêves personnel</p>
        </div>
        
        <div class="content">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Bienvenue ${username} ! 🎉</h2>
          
          <p>Merci de vous être inscrit à <strong>Somni Dreamology</strong> !</p>
          
          <p>Pour commencer à enregistrer vos rêves et accéder à toutes les fonctionnalités, vous devez d'abord vérifier votre adresse email.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" class="button">✅ Vérifier mon email</a>
          </div>
          
          <div class="warning">
            <strong>⏰ Important :</strong> Ce lien est valide pendant 24 heures seulement.
          </div>
          
          <p style="font-size: 14px; color: #64748b;">
            Si vous n'avez pas créé ce compte, vous pouvez ignorer cet email en toute sécurité.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          <p style="font-size: 14px; color: #64748b;">Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        </div>
        
        <div class="footer">
          <p>Sweet dreams! ✨</p>
          <p>L'équipe Somni Dreamology</p>
        </div>
      </body>
      </html>
    `,
    
    text: `
🌙 Dreamology Tools - Vérification de compte

Bienvenue ${username} !

Merci de vous être inscrit à Somni Dreamology !

Pour vérifier votre compte, cliquez sur ce lien :
${verificationUrl}

⏰ Ce lien est valide pendant 24 heures.

Si vous n'avez pas créé ce compte, ignorez cet email.

Sweet dreams! ✨
L'équipe Dreamology Tools
    `
  };
};


export const welcomeEmailTemplate = ({ username }: { username: string }) => {
  return {
    subject: "🎉 Bienvenue dans Somni Dreamology !",
    html: `
      <!-- Template de bienvenue après vérification -->
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h1>🌙 Bienvenue ${username} !</h1>
        <p>Votre compte est maintenant vérifié et actif.</p>
        <p>Commencez dès maintenant à enregistrer vos rêves !</p>
      </div>
    `,
    text: `Bienvenue ${username} ! Votre compte est maintenant actif.`
  };
};

export const passwordResetTemplate = ({ username, resetUrl }: { username: string, resetUrl: string }) => {
  return {
    subject: "🔐 Réinitialisation de votre mot de passe",
    html: `
      <!-- Template pour reset password -->
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h1>🔐 Réinitialisation de mot de passe</h1>
        <p>Bonjour ${username},</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <a href="${resetUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Réinitialiser mon mot de passe
        </a>
      </div>
    `,
    text: `Réinitialisation de mot de passe pour ${username}. Lien: ${resetUrl}`
  };
};