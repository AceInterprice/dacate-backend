import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { actualizarTarea } from "@/services/tarea.service";
import { actualizarTareaSchema } from "@/validations/tarea.validation";
import { manejarError } from "@/lib/manejar-error";

type Context = {
    params: Promise<{ id: string }>;
};

export async function PATCH(req: NextRequest) {
    try {
        // 1. Obtener usuario autenticado
        const usuarioID = await obtenerUsuarioAutenticado();
        const { searchParams } = new URL(req.url);

        const id = searchParams.get("id");
        const tareaID = Number(id);

        if (!Number.isInteger(tareaID) || tareaID <= 0) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "ID de tarea inválido"
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        // 3. Validar datos
        const body = await req.json();
        const validacion = actualizarTareaSchema.safeParse(body);

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

        // 4. Ejecutar actualización
        const tarea = await actualizarTarea(
            tareaID,
            usuarioID,
            validacion.data
        );

        // 5. Responder
        const respuesta: ApiResponse<typeof tarea> = {
            success: true,
            message: "Tarea actualizada correctamente",
            data: tarea
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}