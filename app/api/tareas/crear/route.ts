import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { crearTarea } from "@/services/tarea.service";
import { crearTareaSchema } from "@/validations/tarea.validation";
import { manejarError } from "@/lib/manejar-error";

export async function POST(req: NextRequest) {
    try {
        const usuarioID = await obtenerUsuarioAutenticado();

        const body = await req.json();
        const validacion = crearTareaSchema.safeParse(body);

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

        const tarea = await crearTarea(validacion.data, usuarioID);

        const respuesta: ApiResponse<typeof tarea> = {
            success: true,
            message: "Tarea creada correctamente",
            data: tarea
        };

        return NextResponse.json(respuesta, { status: 201 });

    } catch (error) {
        return manejarError(error);
    }
}