
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { eliminarTarea } from "@/services/tarea.service";
import { manejarError } from "@/lib/manejar-error";

export async function DELETE(req: NextRequest) {
    try {
        const usuarioID = await obtenerUsuarioAutenticado();

        // Obtener y validar el ID desde la URL
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const tareaID = Number(id);

        if (!id || !Number.isInteger(tareaID) || tareaID <= 0) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "ID de tarea inválido"
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        // Eliminar tarea
        await eliminarTarea(tareaID, usuarioID);

        const respuesta: ApiResponse<null> = {
            success: true,
            message: "Tarea eliminada correctamente"
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}
