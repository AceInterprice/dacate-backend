import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { getUsuario } from "@/services/usuario.service";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { manejarError } from "@/lib/manejar-error";

export async function GET() {
    try {
        const usuarioId = await obtenerUsuarioAutenticado();

        const perfil = await getUsuario(usuarioId);

        const respuesta: ApiResponse<typeof perfil> = {
            success: true,
            message: "Perfil obtenido correctamente",
            data: perfil
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}