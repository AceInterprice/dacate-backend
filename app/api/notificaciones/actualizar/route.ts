import { NextRequest, NextResponse } from "next/server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { actualizarNotificacion } from "@/services/notificacion.service";
import { actualizarNotifiacion } from "@/validations/notificacion.validation";
import { manejarError } from "@/lib/manejar-error";
import type { ApiResponse } from "@/types/response.type";

export async function PATCH(req: NextRequest) {
    try {
        const usuarioID = await obtenerUsuarioAutenticado();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const notificacionID = Number(id);

        if (!id || !Number.isInteger(notificacionID) || notificacionID <= 0) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "ID de notificación inválido"
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        const body = await req.json();

        const validacion = actualizarNotifiacion.safeParse(body);

        if (!validacion.success) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "Error de validación",
                errors: validacion.error.issues.map(error => ({
                    campo: error.path.join("."),
                    mensaje: error.message
                }))
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        const notificacion = await actualizarNotificacion(
            notificacionID,
            usuarioID,
            validacion.data
        );

        const respuesta: ApiResponse<typeof notificacion> = {
            success: true,
            message: "Notificación actualizada correctamente",
            data: notificacion
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}