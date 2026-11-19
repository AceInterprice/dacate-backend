import { NextResponse, NextRequest } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { getUsuario } from "@/services/usuario.service";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({
                success: false,
                message: "ID de usuario requerido"
            }, { status: 400 });
        }

        const usuarioId = Number(id);

        if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
            return NextResponse.json({
                success: false,
                message: "ID de usuario inválido"
            }, { status: 400 });
        }

        const perfil = await getUsuario(usuarioId);

        const respuesta: ApiResponse<typeof perfil> = {
            success: true,
            message: "Perfil obtenido correctamente",
            data: perfil
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        console.error(error);

        const respuesta: ApiResponse<null> = {
            success: false,
            message: "Error al obtener el perfil"
        };

        return NextResponse.json(respuesta, { status: 500 });
    }
}