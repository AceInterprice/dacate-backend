import { z } from "zod";

// Solicitar recuperación
export const solicitarRecuperacion = z.object({
    correo: z.string().email({
        message: "Correo electrónico inválido"
    })
});

// Restablecer contraseña
export const restablecerPassword = z.object({
    token: z.string().min(1, {
        message: "Token requerido"
    }),
    password: z.string().min(8, {
        message: "La contraseña debe tener al menos 8 caracteres"
    })
});