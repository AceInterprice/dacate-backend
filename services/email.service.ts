import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarCorreoRecuperacion(
    correo: string,
    token: string
) {
    const enlace = `${process.env.FRONTEND_URL}/restablecer-password?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: "DACATE <onboarding@resend.dev>",
        to: correo,
        subject: "Recuperación de contraseña - DACATE",
        html: `
            <h2>Recuperación de contraseña</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
            <p>Haz clic en el siguiente enlace:</p>
            <a href="${enlace}">Restablecer contraseña</a>
            <p>Este enlace expirará en 15 minutos.</p>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        `
    });

    if (error) {
        throw new Error(`Error al enviar correo: ${error.message}`);
    }

    return data;
}