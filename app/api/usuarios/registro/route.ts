import {NextRequest, NextResponse} from 'next/server'; 
import type {ApiResponse} from '@/types/response.type'; 
import {resgistroSchema} from '@/validations/usuario.validation'; 
import {registrarUsuario} from '@/services/usuario.service';

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
                errors: validacion.error.issues.map(error => error.message)
            };

            return NextResponse.json(respuesta, { status: 400 });
        }

        // 3. Ejecutar el service
        const usuario = await registrarUsuario(validacion.data);

        // 4. Construir la respuesta
        const respuesta: ApiResponse<null> = {
            success: true,
            message: "Usuario registrado correctamente"
        };

        return NextResponse.json(respuesta, { status: 201 });

    } catch (error) {

        console.error("Error al registrar usuario:", error);

        const respuesta: ApiResponse<null> = {
            success: false,
            message: "Error interno del servidor"
        };

        return NextResponse.json(respuesta, { status: 500 });
    }
}