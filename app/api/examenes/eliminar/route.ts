
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { eliminarExamen } from "@/services/examen.service";
import { manejarError } from "@/lib/manejar-error";

export async function DELETE(req: NextRequest) {
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

        // Eliminar examen
        await eliminarExamen(examenID, usuarioID);

        const respuesta: ApiResponse<null> = {
            success: true,
            message: "Examen eliminado correctamente"
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}
