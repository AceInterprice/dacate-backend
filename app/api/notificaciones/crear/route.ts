import { NextRequest, NextResponse } from "next/server";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { registrarNotificacion } from "@/services/notificacion.service";
import { crearNotificacion } from "@/validations/notificacion.validation";
import { manejarError } from "@/lib/manejar-error";
import type { ApiResponse } from "@/types/response.type";
import type { OrigenNotificacion } from "@/types/notificaciones.type";

export async function POST(req: NextRequest) {
    try {
        const usuarioID = await obtenerUsuarioAutenticado();

        const { searchParams } = new URL(req.url);

        const tareaId = searchParams.get("tareaId");
        const examenId = searchParams.get("examenId");

        // Validar que se proporcione exactamente un identificador
        if ((!tareaId && !examenId) || (tareaId && examenId)) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "Debes proporcionar un ID de tarea o examen, pero no ambos"
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        const id = Number(tareaId ?? examenId);

        if (!Number.isInteger(id) || id <= 0) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "El ID proporcionado no es válido"
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        const origen: OrigenNotificacion = tareaId
            ? { tareaId: id }
            : { examenId: id };

        const body = await req.json();

        const validacion = crearNotificacion.safeParse(body);

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

        const notificacion = await registrarNotificacion(
            usuarioID,
            validacion.data,
            origen
        );

        const respuesta: ApiResponse<typeof notificacion> = {
            success: true,
            message: "Notificación creada correctamente",
            data: notificacion
        };

        return NextResponse.json(respuesta, { status: 201 });

    } catch (error) {
        return manejarError(error);
    }
}