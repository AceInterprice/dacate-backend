
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { AppError } from "@/lib/app-error";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { actualizarPerfilUsuario } from "@/services/usuario.service";
import { actualizarSchema } from "@/validations/usuario.validation";

export async function PATCH(req: NextRequest) {
    try {
        // 1. Obtener usuario autenticado
        const usuarioID = await obtenerUsuarioAutenticado();

        // 2. Obtener datos enviados
        const body = await req.json();

        // 3. Validar datos con Zod
        const validacion = actualizarSchema.safeParse(body);

        if (!validacion.success) {
            throw new AppError(
                validacion.error.issues[0].message,
                400
            );
        }

        // 4. Actualizar perfil
        const usuario = await actualizarPerfilUsuario(
            usuarioID,
            validacion.data
        );

        const response: ApiResponse<typeof usuario> = {
            success: true,
            message: "Perfil actualizado correctamente",
            data: usuario
        };

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("Error al actualizar perfil:", error);

        if (error instanceof AppError) {
            const response: ApiResponse<null> = {
                success: false,
                message: error.message
            };

            return NextResponse.json(response, {
                status: error.statusCode
            });
        }

        const response: ApiResponse<null> = {
            success: false,
            message: "Error interno del servidor"
        };

        return NextResponse.json(response, { status: 500 });
    }
}
