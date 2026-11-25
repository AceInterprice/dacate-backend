import { NextRequest, NextResponse } from "next/server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { marcarNotificacionLeida } from "@/services/notificacion.service";
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

        const resultado = await marcarNotificacionLeida(
            notificacionID,
            usuarioID
        );

        const respuesta: ApiResponse<typeof resultado> = {
            success: true,
            message: "Notificación marcada como leída",
            data: resultado
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}