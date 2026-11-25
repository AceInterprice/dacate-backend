
import { NextRequest, NextResponse } from "next/server";

import type { ApiResponse } from "@/types/response.type";
import { solicitarRecuperacion } from "@/validations/recuperacion.validation";
import { solicitarRecuperacionPassword } from "@/services/recuperacion.service";
import { manejarError } from "@/lib/manejar-error";

export async function POST(req: NextRequest) {
    try {
        // 1. Recibir datos
        const body = await req.json();

        // 2. Validar datos
        const validacion = solicitarRecuperacion.safeParse(body);

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

        // 3. Solicitar recuperación
        await solicitarRecuperacionPassword(validacion.data.correo);

        // 4. Responder
        const respuesta: ApiResponse<null> = {
            success: true,
            message: "Si el correo está registrado, recibirás instrucciones para recuperar tu contraseña",
            data: null
        };

        return NextResponse.json(respuesta, { status: 200 });

    } catch (error) {
        return manejarError(error);
    }
}
