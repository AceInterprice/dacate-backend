import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { AppError } from "@/lib/app-error";

export function manejarError(error: unknown) {
    console.error("Error en API:", error);

    // Errores controlados de la aplicación
    if (error instanceof AppError) {
        const respuesta: ApiResponse<null> = {
            success: false,
            message: error.message
        };

        return NextResponse.json(respuesta, {
            status: error.statusCode
        });
    }

    // Errores inesperados
    const respuesta: ApiResponse<null> = {
        success: false,
        message: "Error interno del servidor"
    };

    return NextResponse.json(respuesta, {
        status: 500
    });
}