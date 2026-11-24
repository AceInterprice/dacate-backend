
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { actualizarDatosExamen } from "@/services/examen.service";
import { actualizarExamen } from "@/validations/examen.validation";
import { manejarError } from "@/lib/manejar-error";

export async function PATCH(req: NextRequest) {
    try {
        const usuarioID = await obtenerUsuarioAutenticado();

        // Obtener y validar el ID desde la URL
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const examenID = Number(id);

        if (!id || !Number.isInteger(examenID) || examenID <= 0) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "ID de examen inválido"
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        // Obtener los datos enviados
        const body = await req.json();

        // Validar los campos que se actualizarán
        const validacion = actualizarExamen.safeParse(body);

        if (!validacion.success) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "Datos del examen inválidos",
                errors: validacion.error.issues.map(error => ({
                    campo: error.path.join("."),
                    mensaje: error.message
                }))
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        // Actualizar examen
        const examen = await actualizarDatosExamen(
            examenID,
            usuarioID,
            validacion.data
        );

        const respuesta: ApiResponse<typeof examen> = {
            success: true,
            message: "Examen actualizado correctamente",
            data: examen
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}
