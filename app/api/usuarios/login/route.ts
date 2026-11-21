import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { ApiResponse } from "@/types/response.type";
import { loginSchema } from "@/validations/usuario.validation";
import { loginUsuario } from "@/services/usuario.service";
import { manejarError } from "@/lib/manejar-error";

export async function POST(req: NextRequest) {
    try {
        // 1. Recibir datos
        const body = await req.json();

        // 2. Validar datos
        const validacion = loginSchema.safeParse(body);

        if (!validacion.success) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "Datos inválidos",
                errors: validacion.error.issues.map(error => ({
                    campo: error.path.join("."),
                    mensaje: error.message
                }))
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        // 3. Ejecutar login y generar JWT
        const resultado = await loginUsuario(validacion.data);

        // 4. Crear cookie
        const cookieStore = await cookies();

        cookieStore.set("session", resultado.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60
        });

        // 5. Responder
        const respuesta: ApiResponse<typeof resultado.usuario> = {
            success: true,
            message: "Inicio de sesión correcto",
            data: resultado.usuario
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}