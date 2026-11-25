
import primas from "@/lib/prisma";
import { AppError } from "@/lib/app-error";
import type { CrearRecuperacionPassword } from "@/types/recuperacion.type";
import { createHash, randomBytes } from "crypto";
import bcrypt from "bcrypt";
import { enviarCorreoRecuperacion } from "@/services/email.service";

// Solicitar recuperación
export async function solicitarRecuperacionPassword(correo: string) {
    const usuario = await primas.usuario.findUnique({
        where: { correo },
        select: { id: true, correo: true }
    });

    if (!usuario) return null;

    // Generar token aleatorio
    const token = randomBytes(32).toString("hex");

    // Guardar únicamente el hash
    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");

    const expiracion = new Date(Date.now() + 15 * 60 * 1000);

    const data: CrearRecuperacionPassword = {
        token: tokenHash,
        expiracion,
        usuarioId: usuario.id
    };

    await primas.$transaction(async (tx) => {
        // Invalidar solicitudes anteriores
        await tx.recuperacionPassword.updateMany({
            where: {
                usuarioId: usuario.id,
                usado: false
            },
            data: { usado: true }
        });

        // Crear nueva solicitud
        await tx.recuperacionPassword.create({
            data
        });
    });

    // Enviar correo con el token original
    await enviarCorreoRecuperacion(usuario.correo, token);

    return true;
}

// Restablecer contraseña
export async function restablecerPassword(
    token: string,
    password: string
) {
    const tokenHash = createHash("sha256")
        .update(token)
        .digest("hex");

    const ahora = new Date();

    const resultado = await primas.$transaction(async (tx) => {
        const recuperacion = await tx.recuperacionPassword.findUnique({
            where: { token: tokenHash }
        });

        if (
            !recuperacion ||
            recuperacion.usado ||
            recuperacion.expiracion <= ahora
        ) {
            throw new AppError("Token inválido o expirado", 400);
        }

        // Marcar como utilizado
        const actualizado = await tx.recuperacionPassword.updateMany({
            where: {
                id: recuperacion.id,
                usado: false,
                expiracion: { gt: ahora }
            },
            data: { usado: true }
        });

        if (actualizado.count === 0) {
            throw new AppError("Token inválido o expirado", 400);
        }

        // Encriptar nueva contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        await tx.usuario.update({
            where: { id: recuperacion.usuarioId },
            data: { password: passwordHash }
        });

        return true;
    });

    return resultado;
}
