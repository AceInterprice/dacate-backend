import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { registrarExamen } from "@/services/examen.service";
import { crearExamen } from "@/validations/examen.validation";

export async function POST(req: NextRequest) {
    try {
        // 1. Obtener el usuario autenticado
        const usuarioID = await obtenerUsuarioAutenticado();

        // 2. Obtener los datos enviados
        const body = await req.json();

        // 3. Validar los datos
        const validacion = crearExamen.safeParse(body);

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

        // 4. Registrar el examen
        const examen = await registrarExamen(usuarioID, validacion.data);

        // 5. Responder
        const respuesta: ApiResponse<typeof examen> = {
            success: true,
            message: "Examen registrado correctamente",
            data: examen
        };

        return NextResponse.json(respuesta, { status: 201 });

    } catch (error) {
        console.error("Error al registrar examen:", error);

        const respuesta: ApiResponse<null> = {
            success: false,
            message: "Error al registrar el examen"
        };

        return NextResponse.json(respuesta, { status: 500 });
    }
}