import { Resend } from "resend";

export async function sendPasswordResetEmail(email: string, token: string, baseUrl: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  const from = process.env.RESEND_FROM ?? "VitaLoop <onboarding@resend.dev>";

  await resend.emails.send({
    from,
    to: email,
    subject: "Réinitialisation de votre mot de passe — VitaLoop",
    html: `
      <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #f5f0e8;">
        <h1 style="font-size: 32px; letter-spacing: 3px; color: #1a1a1a; margin-bottom: 4px;">
          VITA<span style="color: #c0392b;">LOOP</span>
        </h1>
        <p style="font-size: 11px; color: #7a7268; letter-spacing: 2px; margin-bottom: 32px;">SPORT &amp; NUTRITION PERSONNALISÉS</p>

        <div style="background: #fff; border: 1px solid #d8d0c4; border-radius: 4px; padding: 32px;">
          <h2 style="font-size: 18px; color: #1a1a1a; margin-top: 0; margin-bottom: 12px;">Réinitialisation du mot de passe</h2>
          <p style="color: #7a7268; font-size: 14px; margin-bottom: 24px; line-height: 1.6;">
            Tu as demandé à réinitialiser ton mot de passe VitaLoop.<br/>
            Clique sur le bouton ci-dessous — ce lien est valable <strong>1 heure</strong>.
          </p>
          <a href="${resetUrl}"
             style="display: inline-block; background: #1a1a1a; color: #f5f0e8; padding: 12px 24px; border-radius: 3px; text-decoration: none; font-size: 11px; letter-spacing: 1px;">
            RÉINITIALISER MON MOT DE PASSE
          </a>
          <p style="color: #7a7268; font-size: 12px; margin-top: 24px; margin-bottom: 0;">
            Si tu n'as pas fait cette demande, ignore cet email.
          </p>
        </div>
      </div>
    `,
  });
}
