import { NextResponse } from "next/server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { obtenerNotificaciones } from "@/services/notificacion.service";
import { manejarError } from "@/lib/manejar-error";
import type { ApiResponse } from "@/types/response.type";

export async function GET() {
    try {
        const usuarioID = await obtenerUsuarioAutenticado();

        const notificaciones = await obtenerNotificaciones(usuarioID);

        const respuesta: ApiResponse<typeof notificaciones> = {
            success: true,
            message: "Notificaciones obtenidas correctamente",
            data: notificaciones
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}