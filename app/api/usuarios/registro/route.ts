import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/response.type";
import { resgistroSchema } from "@/validations/usuario.validation";
import { registrarUsuario } from "@/services/usuario.service";
import { manejarError } from "@/lib/manejar-error";

export async function POST(req: NextRequest) {
    try {
        // 1. Recibir los datos
        const body = await req.json();

        // 2. Validar los datos con Zod
        const validacion = resgistroSchema.safeParse(body);

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

        // 3. Ejecutar el service
        await registrarUsuario(validacion.data);

        // 4. Construir respuesta exitosa
        const respuesta: ApiResponse<null> = {
            success: true,
            message: "Usuario registrado correctamente"
        };

        return NextResponse.json(respuesta, { status: 201 });

    } catch (error) {
      //  return manejarError(error);
      console.dir(error, { depth: null });
    }
}