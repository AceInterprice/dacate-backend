import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { obtenerUsuarioAutenticado } from "@/lib/auth";
import { getTareas } from "@/services/tarea.service";
import { Prioridad } from "@/generated/prisma/client";
import { z } from "zod";
import { manejarError } from "@/lib/manejar-error";

export async function GET(req: NextRequest) {
    try {
        const usuarioID = await obtenerUsuarioAutenticado();

        // Obtener los filtros de la URL
        const { searchParams } = new URL(req.url);

        const materiaParam = searchParams.get("materia");
        const prioridadParam = searchParams.get("prioridad");

        // Validar los filtros
        const filtros = z.object({
            prioridad: z.enum(Prioridad).optional()
        }).safeParse({
            ...(prioridadParam && { prioridad: prioridadParam })
        });

        if (!filtros.success) {
            const respuesta: ApiResponse<null> = {
                success: false,
                message: "Filtros inválidos",
                errors: filtros.error.issues.map(error => ({
                    campo: error.path.join("."),
                    mensaje: error.message
                }))
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        const tareas = await getTareas(
            usuarioID,
            filtros.data.prioridad
        );

        const respuesta: ApiResponse<typeof tareas> = {
            success: true,
            message: "Tareas obtenidas correctamente",
            data: tareas
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}