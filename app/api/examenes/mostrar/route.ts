import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { obtenerExamenes } from "@/services/examen.service";

export async function GET() {
    try {
        // 1. Obtener el usuario autenticado
        const usuarioID = await obtenerUsuarioAutenticado();

        // 2. Obtener los exámenes del usuario
        const examenes = await obtenerExamenes(usuarioID);

        // 3. Responder
        const respuesta: ApiResponse<typeof examenes> = {
            success: true,
            message: "Exámenes obtenidos correctamente",
            data: examenes
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        console.error("Error al obtener exámenes:", error);

        const respuesta: ApiResponse<null> = {
            success: false,
            message: "Error al obtener los exámenes"
        };

        return NextResponse.json(respuesta, { status: 500 });
    }
}